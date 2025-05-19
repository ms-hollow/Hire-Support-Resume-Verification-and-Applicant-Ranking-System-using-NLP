import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { Bar } from "react-chartjs-2"; // npm install react-chartjs-2 chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useRouter } from "next/router";
import { getJobHiringApplications } from "@/pages/api/companyJobApi";
import AuthContext from "@/pages/context/AuthContext";
import { toTitleCase } from "@/pages/utils/functions";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Ranking = () => {
    const [selectedOption, setSelectedOption] = useState("Overall");
    const [rankingData, setRankingData] = useState([]);
    const [applicantRank, setApplicantRank] = useState([]);
    const router = useRouter();
    const { id } = router.query;
    let { authTokens } = useContext(AuthContext);

    useEffect(() => {
        if (id && authTokens) {
            listsOfApplications();
        }
    }, [id, authTokens]);

    const listsOfApplications = async () => {
        if (!id) {
            console.error("Job ID is undefined");
            return;
        }

        try {
            const res = await getJobHiringApplications(id, authTokens);
            if (res) {
                const processedData = res.map((application) => {
                    const profile = application.applicant_profile || {};
                    const scores = application.scores || {};

                    return {
                        id: application.job_application_id,
                        name: `${profile.first_name || "N/A"} ${
                            profile.last_name || "N/A"
                        }`.trim(),
                        Education: scores.education_score ?? 0,
                        Work_Experience: scores.experience_score ?? 0,
                        Skills: scores.skills_score ?? 0,
                        Certifications: scores.certification_score ?? 0,
                        Overall: scores.overall_score ?? 0,
                        status: application.application_status || "Unknown",
                    };
                });

                const sortedData = processedData.sort(
                    (a, b) => b.Overall - a.Overall
                );

                setRankingData(sortedData);
                setApplicantRank(sortedData);
            } else {
                console.error("Failed to fetch job applications");
            }
        } catch (error) {
            console.error("Error fetching job applications:", error);
        }
    };

    const handleApplicantSelect = (applicant) => {
        // console.log("Selected Applicant ID:", applicantId);
        router.push({
            pathname: "/COMPANY/IndividualApplicantDetails",
            query: { id, applicant },
        });
    };

    const handleChange = (event) => {
        const option = event.target.value;
        setSelectedOption(option);

        // Sort applicants based on the selected option
        const sortedApplicants = [...rankingData].sort((a, b) => {
            if (option === "Overall") {
                return b.Overall - a.Overall;
            }
            return b[option] - a[option];
        });

        setApplicantRank(sortedApplicants);
    };

    const datasets = [];
    if (selectedOption === "Overall" || selectedOption === "") {
        datasets.push(
            {
                label: "Education",
                data: rankingData.map((applicant) => applicant.Education),
                backgroundColor: "#69C55F",
            },
            {
                label: "Work_Experience",
                data: rankingData.map(
                    (applicant) => applicant["Work_Experience"]
                ),
                backgroundColor: "#519949",
            },
            {
                label: "Skills",
                data: rankingData.map((applicant) => applicant.Skills),
                backgroundColor: "#3B7635",
            },
            {
                label: "Certifications",
                data: rankingData.map((applicant) => applicant.Certifications),
                backgroundColor: "#2F5F2A",
            }
        );
    } else if (selectedOption === "Education") {
        datasets.push({
            label: "Education",
            data: rankingData.map((applicant) => applicant.Education),
            backgroundColor: "#69C55F",
        });
    } else if (selectedOption === "Work_Experience") {
        datasets.push({
            label: "Work_Experience",
            data: rankingData.map((applicant) => applicant["Work_Experience"]),
            backgroundColor: "#519949",
        });
    } else if (selectedOption === "Skills") {
        datasets.push({
            label: "Skills",
            data: rankingData.map((applicant) => applicant.Skills),
            backgroundColor: "#3B7635",
        });
    } else if (selectedOption === "Certifications") {
        datasets.push({
            label: "Certifications",
            data: rankingData.map((applicant) => applicant.Certifications),
            backgroundColor: "#2F5F2A",
        });
    }

    const data = {
        labels: rankingData.map((applicant) => applicant.name),
        datasets: datasets,
    };

    const [options, setChartOptions] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
        scales: {
            x: {
                ticks: {
                    display: true, // default: show
                },
            },
        },
    });

    useEffect(() => {
        const updateChartOptions = () => {
            const isSmallScreen = window.innerWidth < 768;
            setChartOptions({
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            display: !isSmallScreen, // hide on small screens
                        },
                    },
                },
            });
        };

        updateChartOptions(); // run once on mount
        window.addEventListener("resize", updateChartOptions);
        return () => window.removeEventListener("resize", updateChartOptions);
    }, []);

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between">
                <h1 className="lg:text-large mb:text-large sm:text-large text-primary">
                    Applicant Ranking
                </h1>
                <div className="h-medium rounded-xs border-2 border-fontcolor flex justify-end">
                    <select
                        className="valid:text-fontcolor invalid:text-placeholder lg:w-auto mb:w-full sm:w-full xsm:w-full lg:text-medium mb:text-xsmall sm:text-xsmall xsm:text-xsmall"
                        id="ranking"
                        name="ranking"
                        value={selectedOption}
                        onChange={handleChange}
                        required
                    >
                        <option value="Overall">Overall Ranking</option>
                        <option value="Education">Education</option>
                        <option value="Work_Experience">Work Experience</option>
                        <option value="Skills">Skills</option>
                        <option value="Certifications">Certifications</option>
                    </select>
                </div>
            </div>

            <div className="flex lg:flex-row mb:flex-col sm:flex-col xsm:flex-col xxsm:flex-col gap-5 pt-1 pb-4">
                {/* Overall Bar Chart */}
                <div className="lg:w-[80%] md:w-full sm:w-full h-full">
                    <Bar data={data} options={options} />
                </div>

                {/* Top 5 Applicants */}
                <div className="flex flex-col lg:w-[60%]">
                    <h1 className="lg:text-large mb:text-large sm:text-large text-primary">
                        Top 5 Applicants in {selectedOption}
                    </h1>
                    <div className="overflow-hidden rounded-lg border border-[#F5F5F5]">
                        <table className="border-collapse w-full">
                            <tbody>
                                {applicantRank
                                    .slice(0, 5)
                                    .map((applicant, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-[#F5F5F5]"
                                        >
                                            <td className="px-4 py-1 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Image
                                                        src="/Avatar.svg"
                                                        width={25}
                                                        height={15}
                                                        alt="Applicant"
                                                    />
                                                    <p className="pl-2 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor">
                                                        {applicant.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="button1 flex flex-col items-center justify-center"
                                                        onClick={() =>
                                                            handleApplicantSelect(
                                                                applicant.id
                                                            )
                                                        }
                                                    >
                                                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall font-medium text-center">
                                                            View Applicant
                                                        </p>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rank List */}
            <div
                className="flex overflow-y-auto"
                style={{ height: "calc(59vh - 150px)" }}
            >
                <table className="table-fixed w-full border-collapse text-center">
                    <thead className="font-semibold lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-primary bg-background sticky top-0 z-10">
                        <tr>
                            <th className="w-2/12 text-center">Rank</th>
                            <th className="w-5/12 text-center">Name</th>
                            <th className="w-2/6 text-center">
                                Applicant Number
                            </th>
                            <th className="w-2/6 text-center">
                                {selectedOption} Score
                            </th>
                            <th className="w-2/6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="cursor-pointer">
                        {applicantRank.map((applicant, index) => (
                            <tr
                                key={index}
                                className=" hover:bg-[#F1F1F1] hover:border-primary border-b-2 border-[#D9D9D9]"
                                onClick={() =>
                                    handleApplicantSelect(applicant.id)
                                }
                            >
                                <td className="w-2/12 p-5 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor truncate">
                                    {index + 1}
                                </td>
                                <td className="w-5/12 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor truncate">
                                    {applicant.name}
                                </td>
                                <td className="w-2/6 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor truncate">
                                    {" "}
                                    {applicant.id}
                                </td>
                                <td className="w-2/6 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor truncate">
                                    {Math.round(
                                        (applicant[selectedOption] ?? 0) * 100
                                    ) / 100}
                                </td>
                                <td className="w-2/6 font-thin lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall xxsm:text-xsmall text-fontcolor truncate">
                                    {" "}
                                    {toTitleCase(applicant.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ranking;
