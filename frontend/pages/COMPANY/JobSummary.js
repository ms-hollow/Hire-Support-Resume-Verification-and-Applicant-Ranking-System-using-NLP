import CompanyHeader from "@/components/CompanyHeader";
import GeneralFooter from "@/components/GeneralFooter";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import JobDetailsWrapper from "@/components/JobDetails";

export default function JobSummary() {
    const [formData, setFormData] = useState({
        requiredDocuments: [],
    });

    return (
        <div>
            <CompanyHeader />
            <div className="lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-20 mb:px-20 sm:px-8 xsm:px-8 mx-auto">
                <h1 className="lg:text-xl mb:text-xl sm:text-large text-primary"> Job Hiring Summary </h1>
                <div className="ml-4">
                    <div className="flex pt-2 pb-2">
                        <div className="w-full bg-background h-1. border-2 border-primary rounded-full relative">
                            <div className={`relative h-1 rounded-full transition-all duration-300 bg-primary`} style={{ width: "100%" }}></div>
                        </div>
                    </div>

                    <p className="font-medium lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall text-fontcolor">Please take a moment to carefully review all of your Job Hiring Information to ensure everything is accurate and complete, then click 'Publish Job Hiring' to proceed.</p>

                    <form className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Job Title Section */}
                        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Title</h2>

                            {/* Company */}
                            <div className="mb-1">
                                <label className="block text-sm font-medium text-gray-600">
                                    Company
                                </label>
                            </div>

                            {/* Job Industry */}
                            <div className="mb-1">
                                <label className="block text-sm font-medium text-gray-600">
                                    Job Industry
                                </label>
                            </div>

                            {/* Job Details */}
                            <div className="flex space-x-6 mb-4">
                                {/* Location */}
                                <div className="flex items-center">
                                    <Image
                                        src="/Location Icon.svg"
                                        width={20}
                                        height={10}
                                        alt="Location Icon"
                                    />
                                    <span className="text-fontcolor text-sm font-medium ml-1">Valenzuela</span>
                                </div>

                                {/* Work Setup */}
                                <div className="flex items-center">
                                    <Image
                                        src="/Work Setup Icon.svg"
                                        width={20}
                                        height={10}
                                        alt="Work Setup Icon"
                                        className="ml-2"
                                    />
                                    <span className="text-fontcolor text-sm font-medium ml-1"> Remote</span>
                                </div>

                                {/* Schedule */}
                                <div className="flex items-center">
                                    <Image
                                        src="/Schedule Icon.svg"
                                        width={15}
                                        height={10}
                                        alt="Schedule Icon"
                                        className="ml-2"
                                    />
                                    <span className="text-fontcolor text-sm font-medium ml-1">8hrs shift</span>
                                </div>
                            </div>

                            {/* Salary */}
                            <div className="flex items-center">
                                <Image
                                    src="/Salary Icon.svg"
                                    width={20}
                                    height={10}
                                    alt="Salary Icon"
                                />
                                <span className="text-fontcolor text-sm font-medium ml-1">Php 17,000-21,000 monthly</span>
                            </div>
                            <p className="text-fontcolor font-semibold mt-4">Salary is negotiable based on experience.</p>
                            <p className="text-fontcolor text-xs font-medium">We offer a comprehensive benefits package including healthcare, retirement plans, and professional development opportunities</p>

                            {/* Job Description */}
                            <p className="text-fontcolor font-semibold mt-4">Job Description</p>
                            <div>
                                <span className="text-fontcolor text-xs font-medium">
                                    <ul>
                                        <li className="mb-3">We are seeking a skilled Software Engineer to join our dynamic team. The ideal candidate will be responsible for developing, testing, and maintaining software applications, collaborating with cross-functional teams, and ensuring high-quality code delivery.</li>
                                        <li className="mb-3">Develop and maintain software applications: Write clean, efficient, and well-documented code to create and update software products.</li>
                                        <li className="mb-3">Collaborate with cross-functional teams: Work with various departments to gather requirements and develop effective solutions.</li>
                                    </ul>
                                </span>
                                <p className="text-fontcolor font-semibold mt-4">Qualifications (Credentials and Skills)</p>
                                <span className="text-fontcolor text-xs font-medium">
                                      <ul className="list-disc pl-5 space-y-1">
                                        <li className="mb-1">Bachelor's degree in Computer Science, Software Engineering, or a related field.</li>
                                        <li className="mb-3">1+ years of experience in software development.</li>
                                        <li className="mb-3">Proficiency in at least one programming language (e.g., Java, Python, C#).</li>
                                        <li className="mb-3">Familiarity with software development methodologies and tools (e.g., Agile, Git).</li>
                                        <li className="mb-3">Strong problem-solving and analytical skills.</li>
                                        <li className="mb-3">Excellent communication and teamwork abilities.</li>
                                    </ul>
                                </span>
                                <p className="text-fontcolor font-semibold mt-4">Application Requirements</p>
                                <span className="text-xs font-semibold text-fontcolor"> 
                                <ul className="list-disc pl-5 space-y-1">
                                        <li className="mb-1">Updated resume.</li>
                                        <li className="mb-3">Professional references.</li>
                                        <li className="mb-3">Portfolio or examples of previous work.</li>
                                    </ul>
                                </span>
                                <p className="text-fontcolor font-semibold mt-4">Benefits</p>
                                <span className="text-xs font-semibold text-fontcolor">
                                      <ul className="list-disc pl-5 space-y-1">
                                        <li className="mb-1">Competitive salary and performance-based bonuses.</li>
                                        <li className="mb-3">Retirement savings plan with company matching.</li>
                                        <li className="mb-3">Health, dental, and vision insurance.</li>
                                        <li className="mb-3">Paid time off and holidays.</li>
                                        <li className="mb-3">Professional development opportunities.</li>
                                        <li className="mb-3">Flexible work hours and remote work options.</li>
                                  </ul>
                                </span>
                                <p className="text-fontcolor font-semibold mt-4">No. of Position</p>
                                <span className="text-fontcolor text-xs font-medium">5</span>
                                <p className="text-fontcolor font-semibold mt-4">Application Deadline</p>
                                <span className="text-fontcolor text-xs font-medium">October 10, 2024</span>
                                <p className="text-fontcolor font-semibold mt-4">Additional Note</p>
                                <span className="text-fontcolor text-xs font-medium">This position offers the opportunity to work on cutting-edge projects and make a significant impact on the company's success.</span>
                                <span className="text-fontcolor text-xs font-medium">Applicants should be proactive, innovative, and passionate about technology.</span>
                              </div>
                          </div>

                          <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-primary mb-4">Settings</h2>

                        <div className="grid grid-cols-2 gap-8">
                          {/* Left Side - Required Documents */}
                          <div>
                            <h3 className="text-sm font-semibold text-primary mb-2">Required Documents</h3>
                            {[
                              "Resume",
                              "Diploma",
                              "Transcript of Records (TOR)",
                              "Certificate of Employment",
                              "Seminar/Workshop/Skills Certificates"
                            ].map((doc, index) => (
                              <label key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                  type="checkbox"
                                  value={doc}
                                  onChange={(e) => {
                                    // Handle checkbox logic here
                                  }}
                                  className="w-4 h-4 border border-gray-300 rounded text-black"
                                />
                                <span className="text-fontcolor text-sm">{doc}</span>
                              </label>
                            ))}
                          </div>

                          {/* Right Side - Other Settings */}
                          <div>
                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-primary">Deadline</h3>
                              <p className="text-fontcolor text-sm">10/10/2024</p>
                            </div>

                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-primary">Weight of Criteria</h3>
                              <p className="text-fontcolor text-sm">Customize Criteria Weight Percentage</p>
                            </div>

                            <div className="mb-4">
                              <h3 className="text-sm font-semibold text-primary">Verification Option</h3>
                              <p className="text-fontcolor text-sm">Ignore Unverified Credentials</p>
                            </div>
                          </div>
                        </div>

                        {/* Criteria Scoring Section */}
                        <div className="mt-6">
                          <h3 className="text-xm font-semibold text-primary mb-4">Criteria Scoring</h3>
                          <div className="space-y-6">
                        
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-semibold text-primary">Work Experience</h4>
                                <span className="text-fontcolor text-sm">Weight: 100%</span>
                                </div>
                        <ul className="pl-5 mt-2 space-y-1">
                          <div className="border-b pb-1">
                          <li className="text-fontcolor text-xs">Directly Relevant</li>
                          <li className="text-semibold text-sm">1-3 year(s) as Full Stack Developer</li> 
                        </div>
                        <div className="border-b pb-1">
                          <li className="text-fontcolor text-xs">Highly Relevant</li>
                          <li className="text-semibold text-sm">1-2 year(s) as Frontend Developer </li>   
                          </div>
                          <div className="border-b pb-1">
                          <li className="text-fontcolor text-sm">Moderately Relevant</li>
                          <li className="text-semibold text-sm">1 year IT Support</li>   
                          </div>
                        </ul>

                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-semibold text-primary">Skills</h4>
                                <span className="text-fontcolor text-sm">Weight: 100%</span>
                              </div>
                              <ul className="pl-5 mt-2 space-y-1">
                          <div className="border-b pb-1">
                          <li className="text-fontcolor text-xs">Primary Skills</li>
                          <li className="text-semibold text-sm">Java, Python, JavaScript, C++</li> 
                        </div>
                      <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">Secondary Skills</li>
                        <li className="text-semibold text-sm">React, Node.js, SQL, MongoDB</li>   
                        </div>
                        <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">Additional Skills</li>
                        <li className="text-semibold text-sm">Git version control</li>   
                        </div>
                      </ul>
                    


                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-semibold text-primary">Education</h4>
                              <span className="text-fontcolor text-sm">Weight: 100%</span>
                            </div>
                            <ul className="pl-5 mt-2 space-y-1">
                        <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">1st Choice Field Study</li>
                        <li className="text-semibold text-sm">BS/MS Computer Science</li> 
                      </div>
                      <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">2nd Choice Field Study</li>
                        <li className="text-semibold text-sm">BS Information Technology</li> 
                        </div>
                        <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">2nd Choice Field Study</li>
                        <li className="text-semibold text-sm">BS Information Systems</li> 
                        </div>
                      </ul>
                    
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-semibold text-primary">Additional Points</h4>
                              <span className="text-fontcolor text-sm">Weight: 100%</span>
                            
                          </div>
                          <ul className="pl-5 mt-2 space-y-1">
                        <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">School Preference</li>
                        <li className="text-semibold text-sm">Technological University of the Philippines</li> 
                      </div>
                      <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">Honors</li>
                        <li className="text-semibold text-sm">Academic excellence awards (is a plus but not required)</li> 
                      </div>
                        <div className="border-b pb-1">
                        <li className="text-fontcolor text-xs">Multiple Degrees</li>
                        <li className="text-semibold text-sm">Not required</li> 
                      </div>
                      </ul>
                          <div>
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-semibold text-primary">Certifications</h4>
                              <span className="text-fontcolor text-sm">Weight: 100%</span>
                            </div>
                            <ul className="pl-5 mt-2 space-y-1">
                              <li className="text-fontcolor text-xs">Institutional Preference Bonus</li>
                              <li className="text-semibold text-sm">Google Cloud Professional Developer (is a plus but not required)</li> 
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">          
                    <button type="button" className="button2 flex items-center justify-center">
                  <Link href="/COMPANY/CompanySettings" className="ml-auto">
                    <div className="flex items-center space-x-2">
                        <Image 
                        src="/Arrow Left.svg" 
                        width={23} 
                        height={10} 
                        alt="Back Icon" 
                        />
                    <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Back</p>
                      </div>
                      </Link>
                      </button>
                    <div className="flex gap-4">
                    <button type="button"  className="button2 flex items-center justify-center">
                      <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center"> Save as Draft</p>
                          </button>
                          <button type="button"  className="button1 flex items-center justify-center">
                          <Link href="/COMPANY/CompanyHome" className="flex items-center space-x-2 ml-auto">
                          <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">Publish Job Hiring</p>
                          </Link>
                        </button>
                       </div>
                    </div>   
                 </form>
              </div>
           </div>
            <GeneralFooter/>
        </div>
    );
}
