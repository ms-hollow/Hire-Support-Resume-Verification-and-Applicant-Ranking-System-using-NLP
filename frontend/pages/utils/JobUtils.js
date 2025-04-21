const generateJobId = (existingJobs) => {
    const maxId = Math.max(...existingJobs.map(job => job.Id), 0);
    return maxId + 1;
  };
  
  // Function to format salary range
  const formatSalary = (min, max, frequency) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };
  
  // Function to save new job details
  export const saveJobDetails = (formData, existingJobs = []) => {
    const today = new Date();
    const creation_date = (today.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                          today.getDate().toString().padStart(2, '0') + '/' + 
                          today.getFullYear();
  
    const application_deadline = formData.application_deadline ? 
      new Date(formData.application_deadline).toLocaleDateString('en-US') : '';
  
    const newJob = {
      Id: generateJobId(existingJobs),
      job_title: formData.job_title || '',
      job_industry: formData.job_industry || '',
      specialization: {
          specOptions: formData.specialization?.specOptions || [],
          selectedOptions: formData.specialization?.selectedOptions || [],
        },
      job_description: formData.job_description || '',
      company_name: formData.company_name || '',
      region: formData.region || '',
      province: formData.province || '',
      city: formData.city || '',
      work_setup: formData.work_setup || '',
      employment_type: formData.employment_type || '',
      qualifications: formData.qualifications || '',
      schedule: formData.schedule || '',
      benefits: formData.benefits || '',
      experience_level: formData.experience_level || '',
      num_positions: formData.num_positions || '',
      creation_date: creation_date,
      status: formData.status || 'draft',
      salary: formatSalary(formData.salary_min || 0, formData.salary_max || 0, formData.salary_frequency),
      
      /* Setting */
      required_documents: formData.required_documents || [],
      application_deadline: application_deadline,
      verification_option: formData.verification_option || "",
      weightOfCriteria: formData.weightOfCriteria || "",
      criteria_weights: formData.criteria_weights || {
        work_experience: 100,
        skills: 100,
        education: 100,
        additional_points: 100,
        certifications: 100
      },
      criteria: formData.criteria || {
        workExperience: {
          weight: formData.criteria?.workExperience?.weight || "",
          directlyRelevant: formData.criteria?.workExperience?.directlyRelevant || [],
          highlyRelevant: formData.criteria?.workExperience?.highlyRelevant || [],
          moderatelyRelevant: formData.criteria?.workExperience?.moderatelyRelevant || [],
          selectedOptions: formData.criteria?.workExperience?.selectedOptions || [],
        },
        skills: {
          weight: formData.criteria?.skills.weight || "", 
          primarySkills: formData.criteria?.skills?.primarySkills || [],
          secondarySkills: formData.criteria?.skills?.secondarySkills || [],
          additionalSkills: formData.criteria?.skills?.additionalSkills || [],
          selectedOptions: formData.criteria?.skills?.selectedOptions || [] 
        },
        education: { 
          weight: formData.criteria?.education.weight || "", 
          firstChoice: formData.criteria?.education?.firstChoice || [],
          secondChoice: formData.criteria?.education?.secondChoice || [],
          thirdChoice: formData.criteria?.education?.thirdChoice || [],
          selectedOptions: formData.criteria?.education?.selectedOptions || [] 
        },
        
        schools: { 
          schoolPreference: formData.criteria?.schools?.schoolPreference || [] ,
          selectedOptions: formData.criteria?.schools?.selectedOptions || [] 
        },
        additionalPoints: { honor: "", multipleDegrees: "" },
        certificates: { 
          preferred: formData.criteria?.certificates?.preferred || [], 
          weight: formData.criteria?.certificates?.weight || [] 
        }
      },
    };
  
    // Replace the last job if it's a draft, otherwise append
    if (existingJobs.length > 0 && existingJobs[existingJobs.length - 1].status === 'draft') {
      return [...existingJobs.slice(0, -1), newJob];
    }
    return [...existingJobs, newJob];
  };
  
  
  // Function to update existing job details
  export const updateJobDetails = (jobId, formData, existingJobs) => {
    return existingJobs.map(job => {
      if (job.Id === jobId) {
        return {
          ...job,
          ...formData
        };
      }
      return job;
    });
  };