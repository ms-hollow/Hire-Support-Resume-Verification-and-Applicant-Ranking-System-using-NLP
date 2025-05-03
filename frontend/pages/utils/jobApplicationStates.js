/**
 * Helper functions to manage job application state across multiple screens
 */

const JOB_APPLICATION_STORAGE_KEY = 'job_application_draft';

/**
 * Save job application data to localStorage
 * @param {Object} data - The data to save
 */

export const saveJobApplicationDraft = (data) => {
  try {
    const existingData = getJobApplicationDraft() || {};
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(JOB_APPLICATION_STORAGE_KEY, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error saving job application draft:', error);
    return false;
  }
};

/**
 * Get job application data from localStorage
 * @returns {Object|null} The stored data or null if not found
 */
export const getJobApplicationDraft = () => {
  try {
    const data = localStorage.getItem(JOB_APPLICATION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving job application draft:', error);
    return null;
  }
};

/**
 * Clear job application data from localStorage
 */
export const clearJobApplicationDraft = () => {
  try {
    localStorage.removeItem(JOB_APPLICATION_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing job application draft:', error);
    return false;
  }
};

/**
 * Save specific section data to localStorage
 * @param {string} section - The section name (personalInfo, documents, etc.)
 * @param {Object} data - The section data to save
 */
export const saveSectionData = (section, data) => {
  try {
    const existingData = getJobApplicationDraft() || {};
    existingData[section] = data;
    localStorage.setItem(JOB_APPLICATION_STORAGE_KEY, JSON.stringify(existingData));
    return true;
  } catch (error) {
    console.error(`Error saving ${section} data:`, error);
    return false;
  }
};

/**
 * Get specific section data from localStorage
 * @param {string} section - The section name to retrieve
 * @returns {Object|null} The section data or null if not found
 */
export const getSectionData = (section) => {
  try {
    const data = getJobApplicationDraft();
    return data?.[section] || null;
  } catch (error) {
    console.error(`Error retrieving ${section} data:`, error);
    return null;
  }
};

/**
 * Get temp uploaded files from window object
 * @returns {Object} Object containing all temporary files
 */
export const getTempUploadedFiles = () => {
  return window.tempUploadedFiles || {};
};

/**
* Get a specific file by its ID from temp storage
* @param {string} fileId - The ID of the file to retrieve
* @returns {File|null} The file object or null if not found
*/
export const getTempFileById = (fileId) => {
  return window.tempUploadedFiles?.[fileId] || null;
};

/**
* Clear all temporary files from memory
*/
export const clearTempFiles = () => {
  window.tempUploadedFiles = {};
};
