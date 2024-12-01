import ApplicantHeader from "@/components/ApplicantHeader";
import SavedJobs from "@/components/SavedJobs";
import AppliedJobs from "@/components/AppliedJobs";

export default function  MyJobs () {
    return ( 
        <div>
            <ApplicantHeader/>
            <div className="text-primary lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 sm:px-20 xsm:px-20 lg:px-20 mx-auto"><b>My Jobs</b></div>
            <div className="relative flex justify-between items-center lg:pt-10 mb:pt-24 xsm:pt-24 sm:pt-24 lg:px-80 mb:px-80 sm:px-80 xsm:px-80 mx-auto">
                {/* Shared Underline */}
                <div className="absolute bottom-[-5px] w-[44%] h-[5px] bg-[#5352e9] transition-all duration-300 ease-in-out" id="hover-line-MyJobs"></div>
    
                {/* Saved */}
                <p className="text-black font-normal cursor-pointer relative top-[-10px] hover:text-primary" 
                    onMouseEnter={() => document.getElementById('hover-line-MyJobs').style.left = '5%'}
                    onMouseLeave={() => document.getElementById('hover-line-MyJobs').style.left = '5%'}
                    onClick={() => {
                        document.getElementById('hover-line-MyJobs').style.left = '5%';
                        document.getElementById('saved-jobs').style.display = 'block';
                        document.getElementById('applied-jobs').style.display = 'none';
                    }}>Saved</p>
                
                {/* Applied */}
                <p className="text-black hover:text-primary font-normal cursor-pointer relative top-[-10px]" 
                    onMouseEnter={() => document.getElementById('hover-line-MyJobs').style.left = '51%'}
                    onMouseLeave={() => document.getElementById('hover-line-MyJobs').style.left = '51%'}
                    onClick={() => {
                        document.getElementById('hover-line-MyJobs').style.left = '51%';
                        document.getElementById('saved-jobs').style.display = 'none';
                        document.getElementById('applied-jobs').style.display = 'block';
                    }}>Applied</p>
           </div>

            <div className="mt-0.25 h-[1px] w-[1200px] bg-[#5352E9] mx-auto"></div>
            <div className='flex flex-row pt-4'>
            <div id="saved-jobs" style={{ display: "block" }}><SavedJobs /></div>
            <div id="applied-jobs" style={{ display: "none" }}><AppliedJobs /></div>
            </div>
        </div>
        
     );
}