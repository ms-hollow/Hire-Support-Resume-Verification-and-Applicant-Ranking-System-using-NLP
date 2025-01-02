import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2"; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title,} from "chart.js";
import VerifiedCredentialsWrapper from "./VerifiedCredentials";
import UnverifiedCredentialsWrapper from "./UnerifiedCredentials";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const IndividualScore = ({ applicantId }) => {
  const [indivScore, setindivScore] = useState(null);
  const [activeTab, setActiveTab] = useState('verified');

  useEffect(() => {
    const fetchData = async () => {

      try {
        const currentApplicantId = applicantId || localStorage.getItem('selectedApplicantId');
        
        if (!currentApplicantId) {
          console.error("No applicant ID provided");
          return;
        }

        const res = await fetch('/placeHolder/dummy_ApplicantRanking.json');
        const json = await res.json();
        const item = json.applicants.find(item => item.id === currentApplicantId);

        if (item) {
          setindivScore(item);
        } else {
          console.error("Applicant not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

      fetchData();
    }, [applicantId]);

    if (!indivScore) return <p>Loading...</p>;

    // Bar chart data for the selected applicant
    const barData = {
      labels: ["Education", "Work Experience", "Skills", "Certifications"],
      datasets: [
        {
          label: "Applicant Score",
          data: [
            indivScore.Education,
            indivScore["Work Experience"],
            indivScore.Skills,
            indivScore.Certifications,
          ],
          backgroundColor: ["#69C55F", "#519949", "#3B7635", "#2F5F2A"],
        },
      ],
    };

    const barOptions = {
      responsive: true,
      plugins: {
        legend: false,
      },
    };

    // Doughnut chart data for the overall score
    const totalScore =indivScore.Education +  indivScore["Work Experience"] + indivScore.Skills + indivScore.Certifications;
    const overallPercentage = ((totalScore / 400) * 100).toFixed(2);
    const remainingPercentage = (100 - overallPercentage).toFixed(2); 

    const ratio = totalScore / 400;
    const educationPercentage = ((indivScore.Education * ratio) / totalScore * 100).toFixed(2);
    const workExpPercentage = ((indivScore["Work Experience"] * ratio) / totalScore * 100).toFixed(2);
    const skillsPercentage = ((indivScore.Skills * ratio) / totalScore * 100).toFixed(2);
    const certificationsPercentage = ((indivScore.Certifications * ratio) / totalScore * 100).toFixed(2);

    const doughnutData = {
      labels: [
        `Education: ${educationPercentage}%`,
        `Work Experience: ${workExpPercentage}%`,
        `Skills: ${skillsPercentage}%`,
        `Certifications: ${certificationsPercentage}%`,
      
      ],
      datasets: [
        {
          data: [
            indivScore.Education,
            indivScore["Work Experience"],
            indivScore.Skills,
            indivScore.Certifications,
            remainingPercentage,
          ],
          backgroundColor: ["#69C55F", "#519949", "#3B7635", "#2F5F2A", "#E0E0E0"],
        },
      ],
    };

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw; // Ensure the value is extracted
              return `${value.toFixed ? value.toFixed(2) : value}%`;
            },
          },
        },
        legend: { position: "right" },
      },
      layout: {
        padding: {
          top: 0,    
          bottom: 0,
        },
      },
    };
  

  return (
    <div className="w-full flex flex-col p-5">
      <div className="flex justify-between">
        <h1 className="lg:text-large mb:text-large sm:text-large text-primary"> Applicant Score</h1>
        <h1 className="lg:text-large mb:text-large sm:text-large text-primary"> Overall Score </h1>
      </div>

      <div className="flex w-full lg:flex-row mb:flex-row sm:flex-col pt-1 pb-5 ">
        {/* Bar Chart */}
        <div style={{ width: "80%" }}>
          <Bar data={barData} options={barOptions} />
        </div>

     
        {/* Doughnut Chart */}
        <div style={{ position: "relative", width: "80%" }}>
          {/* Doughnut Chart */}
          <Doughnut data={doughnutData} options={doughnutOptions} />
          
          {/* Percentage Display */}
          <div style={{position: "absolute",top: "50%",left: "29%",transform: "translate(-50%, -50%)",textAlign: "center",}}>
            <p className="text-xl font-bold text-fontcolor">{overallPercentage}%</p>
          </div>
        </div>
      </div>


       {/*Verified and Unverified Documents */}
      <div className="flex flex-col w-full  pl-2" style={{ height: "calc(59vh - 150px)" }}>
     
        <div className="flex w-full flex-row justify-center gap-56 relative">
          <p className={`text-fontcolor font-normal text-medium  cursor-pointer ${ activeTab === 'verified' ? 'text-primary' : ''}`} onClick={() => setActiveTab('verified')}> Verified Credentials</p>
          <p className={`text-fontcolor font-normal text-medium cursor-pointer ${activeTab === 'unverified' ? 'text-primary' : ''}`} onClick={() => setActiveTab('unverified')} > Unverified Credentials</p>

          {/* Static Underline */}
          <div className="absolute top-8 left-0 w-full h-[1px] bg-primary " />
          {/* Dynamic Underline */}
          <div className="absolute top-8 h-[3px] bg-primary transition-all duration-300 ease-in-out" style={{ width: '50%', left: activeTab === 'verified' ? '0%' : '50%', }} /> </div>

          {/* Content Below the Underline */}
          <div className="flex-1 overflow-y-auto mt-4">
            {activeTab === 'verified' ? (<VerifiedCredentialsWrapper/>
            ) : (
              <UnverifiedCredentialsWrapper/>
            )}
          </div>
      </div>

    </div>
  );
};

export default IndividualScore;
