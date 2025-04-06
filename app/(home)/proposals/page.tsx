'use client';

import React, { useEffect, useState } from 'react';
import { getEmployerJobApplications, assignApplicantToJob } from '@/lib/server-actions';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Applicant {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  location: string | null;
  experienceRange: string | null;
  skills: string[];
  bio: string | null;
  portfolioLink: string | null;
  githubLink: string | null;
  linkedinLink: string | null;
  resume: string | null;
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
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobData = await getEmployerJobApplications();
        setJobs(
          jobData.map((job: any) => ({
            ...job,
            expectedTime: job.ExpectedTime, // Map ExpectedTime to expectedTime
          }))
        );
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAssignApplicant = async (appliedId: string) => {
    try {
      await assignApplicantToJob(appliedId);
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          Applied: job.Applied.map((application:any) =>
            application.id === appliedId
              ? { ...application, status: 'ACCEPTED' }
              : application
          ),
        }))
      );
    } catch (error) {
      console.error('Error assigning applicant:', error);
    }
  };

  const navigateToMySpace = () => {
    router.push('/my-space');
  };

  // Check if job has any accepted applications
  const hasAcceptedApplications = (job: Job): boolean => {
    return job.Applied.some(application => application.status === 'ACCEPTED');
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
        <p className="text-xl font-semibold text-zinc-800 dark:text-white">No job applications found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <motion.div
              key={job.jobId}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 hover:shadow-2xl transition-all"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">{job.companyName}</p>
                </CardHeader>

                <CardContent className="flex-1 p-4">
                  <p className="text-sm text-gray-700 dark:text-zinc-300">{job.description}</p>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <span className="font-medium">Location: </span>
                      {job.location ?? 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <span className="font-medium">Experience: </span>
                      {job.minExperience} - {job.maxExperience} YOE
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <span className="font-medium">Salary: </span>
                      {job.currency} {job.minSalary}k - {job.maxSalary}k
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      <span className="font-medium">Expected Time: </span>
                      {job.ExpectedTime ?? 'Not specified'}
                    </p>
                  </div>

                  <div className="mt-3">
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Skills Required: </span>
                    {job.skillsRequired.join(', ')}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col">
                  <div className="w-full space-y-4">
                    {job.Applied.map((application:any) => (
                      <div
                        key={application.id}
                        className="flex justify-between items-center p-3 border-b dark:border-zinc-800"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{application.jobSeeker.name}</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">{application.jobSeeker.email}</p>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">
                            {/* Applied on: {new Date(application.jobSeeker.appliedAt).toLocaleDateString()} */}
                          </p>
                        </div>
                        <div>
                          {application.status === 'PENDING' ? (
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
                  
                  {/* Only show "View Job Details" button if there are accepted applications */}
                  {hasAcceptedApplications(job) && (
                    <Button 
                      onClick={navigateToMySpace} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    >
                      View Job Details
                    </Button>
                  )}
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