"use client";

import React, { useEffect, useState } from "react";
import { getEmployerJobApplications, assignApplicantToJob } from "@/lib/server-actions";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

interface Applicant {
  id: string;
  name: string;
  email: string;
  appliedAt: string;
}

interface Job {
  jobId: string;
  title: string;
  companyName: string;
  location: string | null;
  minExperience: number;
  maxExperience: number;
  description: string;
  skillsRequired: string[];
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  ExpectedTime: string | null;
  Applied: {
    id: string;
    status: string;
    jobSeeker: Applicant;
  }[];
}

const EmployerProposals: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getEmployerJobApplications();
        console.log("jobdata", jobData);
        setJobs(jobData);
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAssignApplicant = async (appliedId: string) => {
    try {
      await assignApplicantToJob(appliedId);
      // Re-fetch or update the job status locally
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          Applied: job.Applied.map((application) =>
            application.id === appliedId
              ? { ...application, status: "ACCEPTED" }
              : application
          ),
        }))
      );
    } catch (error) {
      console.error("Error assigning applicant:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[90vh] w-full flex-col items-center justify-center p-10 dark:text-white text-gray-800">
        <Spinner className="h-10 w-10 text-pink-600" />
        <p className="mt-4 text-sm font-medium">Loading proposals...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center w-full p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {jobs.length === 0 ? (
        <p>No job applications found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <motion.div
              key={job.jobId}
              className="w-full max-w-md bg-white rounded-lg shadow-md p-6 hover:shadow-2xl transition-all"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.companyName}</p>
                </CardHeader>

                <p className="text-sm text-gray-700 mb-2">{job.description}</p>
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-600">Location: {job.location}</p>
                  <p className="text-sm font-medium text-gray-600">Experience: {job.minExperience} - {job.maxExperience} YOE</p>
                  <p className="text-sm font-medium text-gray-600">Salary: {job.currency} {job.minSalary}k - {job.maxSalary}k</p>
                  <p className="text-sm font-medium text-gray-600">Expected Time: {job.ExpectedTime}</p>
                </div>

                <div className="space-y-4">
                  {job.Applied.map((application) => (
                    <div key={application.id} className="flex justify-between items-center p-3 border-b">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-800">{application.jobSeeker.name}</p>
                        <p className="text-xs text-gray-500">{application.jobSeeker.email}</p>
                        <p className="text-xs text-gray-600">Applied on: {new Date(application.jobSeeker.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        {application.status === "PENDING" ? (
                          <Button
                            onClick={() => handleAssignApplicant(application.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            Accept
                          </Button>
                        ) : (
                          <Button disabled className="bg-green-500 text-white">
                            Accepted
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EmployerProposals;
