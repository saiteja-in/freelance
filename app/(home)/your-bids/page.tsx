"use client";

import React, { useEffect, useState } from 'react';
import { getJobSeekerCards } from '@/lib/server-actions';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        console.log(appliedJobs)
        const jobsWithStatus = appliedJobs.map(job => ({
          ...job,
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
        <p className="text-xl font-semibold text-zinc-800 dark:text-white">No applied jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {jobs.map((job) => (
            <motion.div
              key={job.jobId}
              className="w-full max-w-xs bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4 hover:shadow-2xl transition-all"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="p-4">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{job.companyName}</p>
                </CardHeader>

                <CardContent className="flex-1 p-4">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{job.description}</p>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Location: </span>
                      {job.location ?? 'Not specified'}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Experience: </span>
                      {job.minExperience} - {job.maxExperience} YOE
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Salary: </span>
                      {job.currency} {job.minSalary}k - {job.maxSalary}k
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Expected Time: </span>
                      {job.ExpectedTime ?? 'Not specified'}
                    </p>
                  </div>

                  <div className="mt-3">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Skills Required: </span>
                    {job.skillsRequired.join(', ')}
                  </div>

                  <div className="mt-3">
                    {job.status === 'PENDING' && (
                      <span className="text-sm font-semibold text-yellow-500">Pending</span>
                    )}
                    {job.status === 'ACCEPTED' && (
                      <span className="text-sm font-semibold text-green-500">Accepted</span>
                    )}
                    {job.status === 'REJECTED' && (
                      <span className="text-sm font-semibold text-red-500">Rejected</span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4">
                  <Button className="w-full bg-pink-600 text-white hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600">
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