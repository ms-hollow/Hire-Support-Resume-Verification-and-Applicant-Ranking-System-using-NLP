import torch
from transformers import BertTokenizerFast, BertForTokenClassification


class ResumeNER:
    def __init__(self, confidence_threshold=0.75):
        # Define labels
        self.LABELS = ['O', 'B-JOB_TITLE', 'I-JOB_TITLE', 'B-COMPANY', 'I-COMPANY']
        self.label2id = {label: id for id, label in enumerate(self.LABELS)}
        self.id2label = {id: label for label, id in self.label2id.items()}

        # Add confidence threshold for entity recognition
        self.confidence_threshold = confidence_threshold

        # Load model and tokenizer during initialization
        self.model, self.tokenizer = self._load_model_and_tokenizer()

        # Define sliding window parameters
        self.max_length = 512  # Maximum sequence length for BERT
        self.stride = 128  # Number of overlapping tokens between windows
        self.window_size = 384  # Size of each window (excluding overlap)

    def _load_model_and_tokenizer(self):
        # Initialize tokenizer and model
        tokenizer = BertTokenizerFast.from_pretrained('bert-base-cased')
        model = BertForTokenClassification.from_pretrained('bert-base-cased',
                                                           num_labels=len(self.LABELS),
                                                           id2label=self.id2label,
                                                           label2id=self.label2id)

        # Load the trained model weights
        model.load_state_dict(torch.load(r'backend/main_model/experience_ner_model.pt', map_location=torch.device('cpu')))
        model.eval()
        return model, tokenizer


    def _get_entities_from_predictions(self, tokens, predictions, probabilities, offset=0, is_last_window=False):
        """
        Extract entities from a sequence of tokens and their predictions.

        Args:
            tokens (list): List of token IDs
            predictions (list): List of predicted labels
            probabilities (list): List of confidence scores for predictions
            offset (int): Token offset for the current window
            is_last_window (bool): Whether this is the last window

        Returns:
            tuple: Lists of (job_titles, companies) with their positions and confidence scores
        """
        job_titles = []
        companies = []
        current_entity = []
        current_probs = []  # Track probabilities for current entity
        current_label = None
        entity_start = None

        token_words = self.tokenizer.convert_ids_to_tokens(tokens)

        for idx, (token, label, prob) in enumerate(zip(token_words, predictions, probabilities)):
            # Skip special tokens
            if token in ['[CLS]', '[SEP]', '[PAD]']:
                if current_entity:
                    # Handle current entity with confidence check
                    self._handle_current_entity(
                        current_entity, current_probs, current_label,
                        entity_start, offset, job_titles, companies
                    )
                current_entity = []
                current_probs = []  # Reset probabilities
                current_label = None
                entity_start = None
                continue

            if label.startswith('B-'):
                if current_entity:
                    # Handle current entity with confidence check
                    self._handle_current_entity(
                        current_entity, current_probs, current_label,
                        entity_start, offset, job_titles, companies
                    )
                current_entity = [token]
                current_probs = [prob]  # Start tracking probabilities
                current_label = label
                entity_start = idx

            elif label.startswith('I-'):
                if current_entity and label[2:] == current_label[2:]:
                    current_entity.append(token)
                    current_probs.append(prob)  # Add probability for continuing token
                else:
                    if current_entity:
                        # Handle current entity with confidence check
                        self._handle_current_entity(
                            current_entity, current_probs, current_label,
                            entity_start, offset, job_titles, companies
                        )
                    current_entity = [token]
                    current_probs = [prob]  # Start tracking probabilities
                    current_label = 'B-' + label[2:]
                    entity_start = idx

            else:  # O label
                if current_entity:
                    # Handle current entity with confidence check
                    self._handle_current_entity(
                        current_entity, current_probs, current_label,
                        entity_start, offset, job_titles, companies
                    )
                current_entity = []
                current_probs = []  # Reset probabilities
                current_label = None
                entity_start = None

        # Handle any remaining entity
        if current_entity:
            # Handle final entity with confidence check
            self._handle_current_entity(
                current_entity, current_probs, current_label,
                entity_start, offset, job_titles, companies
            )

        return job_titles, companies

    def _handle_current_entity(self, current_entity, current_probs, current_label,
                               entity_start, offset, job_titles, companies):
        """
        Helper method to process current entity if it meets confidence threshold.

        Args:
            current_entity (list): List of tokens in the current entity
            current_probs (list): List of confidence scores for each token
            current_label (str): Label of the current entity
            entity_start (int): Starting position of the entity
            offset (int): Current window offset
            job_titles (list): List to store job title entities
            companies (list): List to store company entities
        """
        # Calculate average confidence for the entity
        avg_confidence = sum(current_probs) / len(current_probs)

        # Only add entity if it meets confidence threshold
        if avg_confidence >= self.confidence_threshold:
            entity_text = self.tokenizer.convert_tokens_to_string(current_entity)

            # Filtering of results for Job Title
            if current_label.endswith('JOB_TITLE'):
                # Apply job title specific filters
                words = entity_text.split()

                if (len(words) >= 2 and             # Must have at least 2 words
                        len(entity_text) >= 8):     # Must be at least 8 characters long

                    # Remove commonly included
                    common_suffixes = ['Manila', ' Philippines', ' PH', ' Asia' 'Experience' 'Work']
                    cleaned_text = entity_text
                    for suffix in common_suffixes:
                        if cleaned_text.endswith(suffix):
                            cleaned_text = cleaned_text[:-len(suffix)].strip()

                    # Only add if the cleaned text still meets the length requirements
                    if len(cleaned_text.split()) >= 2 and len(cleaned_text) >= 8:
                        job_titles.append((cleaned_text, entity_start + offset, avg_confidence))

            # Filtering of results for Company
            elif current_label.endswith('COMPANY'):
                companies.append((entity_text, entity_start + offset, avg_confidence))

    def extract_entities(self, text):
        """
        Extract job titles and companies from the given text using sliding windows.

        Args:
            text (str): Input text containing experience information

        Returns:
            tuple: Two lists containing (job_titles, companies) with confidence scores
        """
        # Tokenize the full text
        encoded = self.tokenizer.encode_plus(
            text,
            add_special_tokens=False,
            return_tensors='pt'
        )

        # If text is shorter than max_length, process it normally
        if len(encoded['input_ids'][0]) <= self.max_length - 2:
            return self._process_single_window(text)

        return self._process_sliding_windows(encoded['input_ids'][0])

    def _process_single_window(self, text):
        """
        Process a single window of text (for shorter texts).

        Args:
            text (str): Input text to process

        Returns:
            tuple: Lists of (job_titles, companies) with confidence scores
        """
        tokens = self.tokenizer(
            text,
            return_tensors='pt',
            truncation=True,
            max_length=self.max_length
        )

        with torch.no_grad():
            outputs = self.model(**tokens)
            logits = outputs.logits
            # Calculate probabilities using softmax
            probabilities = torch.softmax(logits, dim=2)
            predictions = torch.argmax(logits, dim=2)

        predicted_labels = [self.id2label[pred.item()] for pred in predictions[0]]
        # Get confidence scores for each token
        token_probs = [prob.max().item() for prob in probabilities[0]]

        job_titles, companies = self._get_entities_from_predictions(
            tokens['input_ids'][0],
            predicted_labels,
            token_probs,
            offset=0,
            is_last_window=True
        )

        # Return entities with confidence scores
        return (
            [(title, conf) for title, _, conf in job_titles],
            [(company, conf) for company, _, conf in companies]
        )

    def _process_sliding_windows(self, input_ids):
        """
        Process longer texts using sliding windows.

        Args:
            input_ids (tensor): Input token IDs

        Returns:
            tuple: Lists of (job_titles, companies) with confidence scores
        """
        total_length = len(input_ids)
        window_entities = []

        for start_idx in range(0, total_length, self.window_size):
            end_idx = min(start_idx + self.max_length - 2, total_length)  # -2 for [CLS] and [SEP]
            is_last_window = end_idx == total_length

            # Extract window tokens
            window_input_ids = input_ids[start_idx:end_idx]
            window_input_ids = torch.cat([
                torch.tensor([self.tokenizer.cls_token_id]),
                window_input_ids,
                torch.tensor([self.tokenizer.sep_token_id])
            ]).unsqueeze(0)

            attention_mask = torch.ones(window_input_ids.shape)

            # Get predictions for window
            with torch.no_grad():
                outputs = self.model(
                    input_ids=window_input_ids,
                    attention_mask=attention_mask
                )
                logits = outputs.logits
                # Calculate probabilities using softmax
                probabilities = torch.softmax(logits, dim=2)
                predictions = torch.argmax(logits, dim=2)

            predicted_labels = [self.id2label[pred.item()] for pred in predictions[0]]
            # Get confidence scores for each token
            token_probs = [prob.max().item() for prob in probabilities[0]]

            job_titles, companies = self._get_entities_from_predictions(
                window_input_ids[0],
                predicted_labels,
                token_probs,
                offset=start_idx,
                is_last_window=is_last_window
            )

            window_entities.append((job_titles, companies, start_idx, end_idx))

        # Merge entities with confidence scores
        merged_job_titles = {}
        merged_companies = {}

        for job_titles, companies, start_idx, end_idx in window_entities:
            # Only include entities that start in the non-overlapping region
            # except for the last window
            for title, pos, conf in job_titles:
                if pos - start_idx < self.window_size or pos >= end_idx - self.stride:
                    # Keep entity with highest confidence if duplicated
                    if pos not in merged_job_titles or conf > merged_job_titles[pos][1]:
                        merged_job_titles[pos] = (title, conf)

            for company, pos, conf in companies:
                if pos - start_idx < self.window_size or pos >= end_idx - self.stride:
                    # Keep entity with highest confidence if duplicated
                    if pos not in merged_companies or conf > merged_companies[pos][1]:
                        merged_companies[pos] = (company, conf)

        # Sort entities by position and return with confidence scores
        final_job_titles = [item for _, item in sorted(merged_job_titles.items())]
        final_companies = [item for _, item in sorted(merged_companies.items())]

        return final_job_titles, final_companies


def ner_experience(text, confidence_threshold=0.75):
    """
    Process the input text and return extracted experience entities.
    This function can be called when using the script as a module.

    Args:
        text (str): Input text to process
        confidence_threshold (float, optional): Minimum confidence score for entity recognition.

    Returns:
        tuple: Two lists containing:
            - job_titles: List of tuples (title, confidence_score)
            - companies: List of tuples (company, confidence_score)

    Example:
        >>> text = "I worked as a Software Engineer at Google"
        >>> job_titles, companies = ner_experience(text, confidence_threshold)
        >>> print(job_titles)
        [('Software Engineer', 0.92)]
        >>> print(companies)
        [('Google', 0.95)]
    """
    if not 0 <= confidence_threshold <= 1:
        raise ValueError("Confidence threshold must be between 0 and 1")

    ner = ResumeNER(confidence_threshold=confidence_threshold)
    return ner.extract_entities(text)


if __name__ == "__main__":
    # This block executes when the script is run directly
    print("Please enter the text to analyze (press Enter twice when finished):")

    # Collect multiple lines of input until user enters a blank line
    lines = []
    while True:
        line = input()
        if line:
            lines.append(line)
        else:
            break

    # Combine the lines into a single text
    input_text = '\n'.join(lines)

    # Create NER instance and process the text
    # Using a slightly higher threshold for command-line usage
    job_titles, companies = ner_experience(input_text, confidence_threshold=0.75)

    # Print results with confidence scores
    print("\nExtracted Job Titles:")
    for title, confidence in job_titles:
        print(f"- {title} (confidence: {confidence:.2f})")

    print("\nExtracted Companies:")
    for company, confidence in companies:
        print(f"- {company} (confidence: {confidence:.2f})")