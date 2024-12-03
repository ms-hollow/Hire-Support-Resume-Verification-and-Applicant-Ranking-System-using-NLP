import Image from 'next/image';
const JobDetails = () => {
    return (
        <div className="flex flex-col h-full"> 
            {/* Top Part of Job Details - Fixed */}
            <div className="job-details-box border-b-8 top rounded-t-lg p-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-fontcolor text-large">Job Title</p>
                    <div className="flex items-center gap-2">
                        <p className="font-thin text-fontcolor text-xsmall">Date Posted</p>
                        <Image 
                            src="/Menu.svg" 
                            width={23} 
                            height={20} 
                            alt="Menu" 
                        />
                    </div>
                </div>

                <p className="font-thin text-fontcolor text-xsmall">Company</p>
                <p className="font-thin text-fontcolor text-xsmall">Job Industry  <span className="font-thin text-fontcolor text-xsmall"> (JavaScript, React)</span></p>
                <div className="flex flex-row mt-2">
                    <div className="flex flex-row">
                        <Image 
                            src="/Location Icon.svg" 
                            width={23} 
                            height={20} 
                            alt="Location Icon" 
                        />
                        <p className="ml-1.5 font-thin text-xsmall text-fontcolor">Valenzuela</p>
                    </div>
                    <div className="flex flex-row mx-4">
                        <Image 
                            src="/Work Setup Icon.svg" 
                            width={23} 
                            height={20} 
                            alt="Work Setup Icon" 
                        />
                        <p className="ml-2 font-thin text-xsmall text-fontcolor">Remote</p>
                    </div>
                    <div className="flex flex-row">
                        <Image 
                            src="/Schedule Icon.svg" 
                            width={18} 
                            height={20} 
                            alt="Schedule Icon" 
                        />
                        <p className="ml-2 font-thin text-xsmall text-fontcolor">8 hrs shift</p>
                    </div>
                </div>
                <div className="flex flex-row mt-2 px-1">
                    <Image 
                        src="/Salary Icon.svg" 
                        width={18} 
                        height={20} 
                        alt="Salary Icon" 
                    />
                    <p className="ml-2 font-thin text-xsmall pl-px text-fontcolor">Php 17,000 - 21,000 Monthly</p>
                </div>

                <div className="flex mt-4 gap-8">
                    <button type="button" className="button1 flex items-center justify-center">
                        <a href="/APPLICANT/JobApplication"className="lg:text-medium font-medium">Apply</a>
                    </button>

                    <button type="button" className="button2 flex items-center justify-center">
                        <a href="/APPLICANT/MyJobs" className="lg:text-medium font-medium">Save</a>
                    </button>
                </div>
            </div>

            {/* Main Part of Job Details - Scrollable */}
            <div className="job-details-box rounded-b-lg overflow-y-auto flex-1 bg-white p-4">
                {/*Employment Type*/} 
                <p className="font-semibold text-xsmall text-fontcolor ">Employment Type</p>
                <p id='EmployType' className="font-thin text-xsmall text-fontcolor pb-3">RemCompanLorem ipsum dolor sit amet, consectetur adipiscing elit.yote</p>
                
                {/*Job Description*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Job Description</p>
                <p id='JobDescription' className="font-thin text-xsmall text-fontcolor pb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet tincidunt et turpis habitasse ultrices condimentum velit. At nulla eu urna cras sed odio mauris vivamus erat. Elit mi massa nisl enim. Tristique massa sit est in senectus amet, ut nullam. Amet consectetur netus duis diam. Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor dignissim pretium aliquet nunc, pulvinar. Faucibus tincidunt odio tincidunt massa lobortis aliquam venenatis neque. Tortor porttitor parturient sagittis non faucibus faucibus tincidunt ut aliquam. Egestas sed massa enim tempor at orci dignissim id. Sed metus mi leo rutrum felis. </p>

                {/*Qualifications*/} 
                <p className="font-semibold text-xsmall text-fontcolor ">Qualifications (Credentials and Skills) </p>
                <p id='Qualifications' className="font-thin text-xsmall text-fontcolor pb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet tincidunt et turpis habitasse ultrices condimentum velit. At nulla eu urna cras sed odio mauris vivamus erat. Elit mi massa nisl enim. Tristique massa sit est in senectus amet, ut nullam. Amet consectetur netus duis diam. Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor dignissim pretium aliquet nunc, pulvinar. Faucibus tincidunt odio tincidunt massa lobortis aliquam venenatis neque. Tortor porttitor parturient sagittis non faucibus faucibus tincidunt ut aliquam. Egestas sed massa enim tempor at orci dignissim id. Sed metus mi leo rutrum felis. </p>

                {/*Application Requirements*/} 
                <p className="font-semibold text-xsmall text-fontcolor ">Application Requirements </p>
                <p id='AppliReq' className="font-thin text-xsmall text-fontcolor pb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet tincidunt et turpis habitasse ultrices condimentum velit. At nulla eu urna cras sed odio mauris vivamus erat. Elit mi massa nisl enim. Tristique massa sit est in senectus amet, ut nullam. Amet consectetur netus duis diam. Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor dignissim pretium aliquet nunc, pulvinar. Faucibus tincidunt odio tincidunt massa lobortis aliquam venenatis neque. Tortor porttitor parturient sagittis non faucibus faucibus tincidunt ut aliquam. Egestas sed massa enim tempor at orci dignissim id. Sed metus mi leo rutrum felis. </p>

                {/* Benefit*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Benefits </p>
                <p id='Benefits' className="font-thin text-xsmall text-fontcolor pb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet tincidunt et turpis habitasse ultrices condimentum velit. At nulla eu urna cras sed odio mauris vivamus erat. Elit mi massa nisl enim. Tristique massa sit est in senectus amet, ut nullam. Amet consectetur netus duis diam. Consectetur pellentesque non eget nisl, pretium, ultrices. Tortor dignissim pretium aliquet nunc, pulvinar. Faucibus tincidunt odio tincidunt massa lobortis aliquam venenatis neque. Tortor porttitor parturient sagittis non faucibus faucibus tincidunt ut aliquam. Egestas sed massa enim tempor at orci dignissim id. Sed metus mi leo rutrum felis. </p>

                {/* No of Positions*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> No. of Positions</p>
                <p id='noPosition' className="font-thin text-xsmall text-fontcolor pb-3">RemCompanLorem ipsum dolor sit amet, consectetur adipiscing elit.yote</p>
                
                {/* App Deadline*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Application Deadline</p>
                <p id='deadline' className="font-thin text-xsmall text-fontcolor pb-3">RemCompanLorem ipsum dolor sit amet, consectetur adipiscing elit.yote</p>
                
                {/* Add Notes*/} 
                <p className="font-semibold text-xsmall text-fontcolor "> Additional Note </p>
                <p id='Notes' className="font-thin text-xsmall text-fontcolor pb-6">RemCompanLorem ipsum dolor sit amet, consectetur adipiscing elit.yote</p>

                {/* Report Job Button */}
                <button type="button" className="button2 flex items-center justify-center">
                    <p className="lg:text-medium font-medium">Report Job</p>
                </button>
            </div>
        </div>
    );
};

const JobDetailsWrapper = () => {
    return (
        <div className="flex-1 h-[calc(100vh-150px)] border border-none rounded-lg">
            <JobDetails />
        </div>
    );
};

export default JobDetailsWrapper;
