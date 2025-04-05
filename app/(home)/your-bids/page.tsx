"use client";

import React, { useEffect, useState } from "react";
import { getJobSeekerCards } from "@/lib/server-actions";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";  // Using Shadcn for cards
import { Button } from "@/components/ui/button";  // Using Shadcn for button

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
  status: "PENDING" | "ACCEPTED" | "REJECTED";  // Added status for application assignment
}

const AppliedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const appliedJobs = await getJobSeekerCards();
        const jobsWithStatus = appliedJobs.map(job => ({
          ...job,
          status: "PENDING" as const
        }));
        setJobs(jobsWithStatus);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[90vh] w-full flex-col items-center justify-center p-10 dark:text-white text-gray-800">
        <Spinner className="h-10 w-10 text-pink-600" />
        <p className="mt-4 text-sm font-medium">Loading applied jobs...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {jobs.length === 0 ? (
        <p>No applied jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {jobs.map((job) => (
            <motion.div
              key={job.jobId}
              className="w-full max-w-xs bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transition-all"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.companyName}</p>
                </CardHeader>
                <div>

                  <p className="text-sm text-gray-700 mb-2">{job.description}</p>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-600">Location: {job.location}</p>
                    <p className="text-sm font-medium text-gray-600">Experience: {job.minExperience} - {job.maxExperience} YOE</p>
                    <p className="text-sm font-medium text-gray-600">Salary: {job.currency} {job.minSalary}k - {job.maxSalary}k</p>
                    <p className="text-sm font-medium text-gray-600">Expected Time: {job.ExpectedTime}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Skills Required: </span>
                    {job.skillsRequired.join(", ")}
                  </div>
                  {/* Show status based on ApplicationAssignmentStatus */}
                  {job.status === "PENDING" && (
                    <div className="mt-2 text-sm font-semibold text-yellow-500">Pending</div>
                  )}
                  {job.status === "ACCEPTED" && (
                    <div className="mt-2 text-sm font-semibold text-green-500">Accepted</div>
                  )}
                  {job.status === "REJECTED" && (
                    <div className="mt-2 text-sm font-semibold text-red-500">Rejected</div>
                  )}
                  </div>
                <CardFooter>
                  <Button className="w-full bg-pink-600 text-white hover:bg-pink-700">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AppliedJobs;
