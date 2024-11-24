import ApplicantHeader from '@/components/ApplicantHeader';
import JobListings from '@/components/JobListings';
import Image from 'next/image';
import { useState } from "react";

export default function ApplicantHome() {
  const [isVisible, setIsVisible] = useState(false);  // State to toggle visibility
  const [selectedSalary, setSelectedSalary] = useState("100");  // Default selected salary

  const toggleVisibility = () => {
    setIsVisible(!isVisible);  // Toggle the visibility of the options
  };

  const handleSalaryChange = (event) => {
    setSelectedSalary(event.target.value);  // Update selected salary
  };
  
  
  
    return (
    <div>
    <ApplicantHeader/>
      <div  className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:p-20 sm:p-20 xsm:p-20 lg:p-20 mx-auto"> 
        <div>
          <p>Hi, Name</p>  
        </div>

        {/* Search*/} 
        <div className="pt-5 flex-wrap w-full">
            <div className="flex lg:flex-row gap-5 pb-5 mb:flex-row sm:flex-col xsm:flex-col">
                  <div className="relative h-medium rounded-xs border-2 border-fontcolor flex flex-grow items-center">
                      <div className="absolute left-3">
                        <Image 
                          src="/Search Icon.png" 
                          width={26} 
                          height={24}
                          alt="Search Icon"
                        />
                      </div>
                      <input type="text" id="keyword" name="keyword" placeholder="Enter Keyword" required className="w-full h-full border-primarycolor lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pl-12"/*onChange={handleChange}*/></input>
                  </div>

                  <div className="h-medium rounded-xs border-2 border-fontcolor flex flex-grow">
                        <select className="valid:text-fontcolor invalid:text-placeholder lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="classification" name="classifcation" required/*onChange={handleChange}*/>
                            <option value=''disabled selected hidden>Classifcation</option>
                            <option value="Science and Technology">Science and Technology</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Computer Science">Computer Science</option>  
                        </select>
                  </div>
                  <div className="relative h-medium rounded-xs border-2 border-fontcolor flex flex-grow items-center">
                      <div className="absolute left-3">
                        <Image 
                          src="/Location Icon.png" 
                          width={24} 
                          height={24}
                          alt="Search Icon"
                        />
                      </div>
                      <input type="text" id="location" name="location" placeholder="Metro Manila" required className="w-full h-full border-primarycolor  lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall pl-12"/*onChange={handleChange}*/></input>
                  </div>   
                  
                  <button className="button1 items-center flex justify-center flex-shrink-0 p-5 ">
                      <p className="lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-center">Find Job</p>
                  </button>
              </div>
        </div>

         {/* Filter*/} 
        <div className="pt-5 flex-wrap w-full">
          <div className="flex lg:flex-row gap-5 pb-5">
            <div className="h-medium rounded-xs  bg-secondary flex flex-grow">
                <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="date-posted" name="DatePosted" required/*onChange={handleChange}*/>
                    <option value=''disabled selected hidden>Date Posted</option>
                    <option value="Last Hour"> Last Hour</option>
                    <option value="Today">Today</option>
                    <option value="Last Week ">Last Week </option>  
                </select>
              </div>

              <div className="h-medium rounded-xs bg-secondary flex flex-grow">
                <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="work-setup" name="WorkSetup" required/*onChange={handleChange}*/>
                    <option value=''disabled selected hidden> Work Setup</option>
                    <option value="Last Hour"> Remote</option>
                    <option value="Today">Onsite</option>
                    <option value="Last Week ">Hybrid </option>  
                </select>
              </div>

              <div className="h-medium rounded-xs bg-secondary  flex flex-grow">
                <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="employ-type" name="EmployType" required/*onChange={handleChange}*/>
                    <option value=''disabled selected hidden> Employment Type</option>
                    <option value="Full-time"> Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value=" Internship ">Internship </option>
                    <option value=" Contract ">Contract </option>  
                </select>
              </div>

              <div className="h-medium rounded-xs bg-secondary  flex flex-grow">
                <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="salary" name="salary" required/*onChange={handleChange}*/>
                    <option value=''disabled selected hidden> Salary</option>
                    <option value="Annually"> Annually</option>
                    <option value="Monthly">Monthly</option>
                    <option value=" Hourly ">Hourly </option>
                </select>
              </div>

              <div className="h-medium rounded-xs bg-secondary  flex flex-grow">
                <select className="bg-secondary valid:text-fontcolor invalid:text-fontcolor lg:flex-grow mb:flex-grow sm:flex-grow xsm:flex-grow lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall " id="exp-level" name="ExperienceLevel" required/*onChange={handleChange}*/>
                    <option value=''disabled selected hidden> Experience Level</option>
                    <option value="Entry-Level"> Entry-Level</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Mid-Level">Mid-Level</option>
                </select>
              </div> 
          </div>
        </div>

        <div className='flex flex-row pt-4'>
          <JobListings/>


        </div>









      </div>
    </div>
      
    );
  }
 
