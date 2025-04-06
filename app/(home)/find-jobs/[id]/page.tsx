'use client';
import {
  ArrowLeft,
  Briefcase,
  Building,
  DollarSign,
  Calendar,
  IndianRupee,
  MapPin,
  BookmarkIcon,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Job } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/ui/spinner';
import { applyJob, getJobDetails } from '@/lib/server-actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // adjust import as per your project
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplyJobSchema, ApplyJobSchemaType } from '@/app/_components/jobschema.validator';

export default function Page() {
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { status, data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const fetchJobInfo = async () => {
    try {
      setLoading(true);
      const { job, success, error } = await getJobDetails(id as string);
      setLoading(false);
      if (!success) {
        toast.error(error);
      }
      if (job) {
        setJobDetails(job);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching job details : ', error);
      toast.error('Something went wrong while fetching job details');
    }
  };

  // Set up react-hook-form for the Apply dialog
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyJobSchemaType>({
    resolver: zodResolver(ApplyJobSchema),
  });

  const handleApplySubmit = async (data: ApplyJobSchemaType) => {
    try {
      // Call the backend applyJob action with the additional fields
      const { ProposedPrice, ProposedDate, Message } = data;
      const { success, error } = await applyJob(
        jobDetails!.id,
        ProposedPrice,
        ProposedDate,
        Message
      );
      if (!success) {
        toast.error(error || 'Failed to apply for this job');
        return;
      }
      toast.success('Successfully applied for this job!');
      setOpenDialog(false);
      reset();
      // Redirect after applying (using the job's application link if available)
      router.push('/');
    } catch (error) {
      console.error('Error applying: ', error);
      toast.error('Something went wrong while applying');
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    // Implement actual bookmark logic here if needed
  };

  useEffect(() => {
    if (id) {
      fetchJobInfo();
    }
  }, [id]);

  if (!id) {
    router.back();
    return null;
  }

  if (loading || status === 'loading') {
    return (
      <div className="flex h-[90vh] w-full flex-col items-center justify-center p-10 text-zinc-800 dark:text-zinc-100">
        <Spinner className="h-10 w-10 text-pink-600" />
        <p className="mt-4 text-sm font-medium">Loading job details...</p>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="flex h-[90vh] w-full flex-col items-center justify-center p-10 text-zinc-800 dark:text-zinc-100">
        <p className="text-lg font-medium">Job not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center text-pink-600 hover:text-pink-700 dark:hover:text-pink-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to jobs
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] w-full flex-col items-center bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-200">
      {/* Header with back button */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-6">
        <button
          className="group flex items-center space-x-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to jobs</span>
        </button>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Job header */}
          <div className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3">
                  {jobDetails?.companyLogo ? (
                    <Image
                      src={jobDetails.companyLogo}
                      alt={`${jobDetails.companyName} logo`}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <Building className="h-12 w-12 text-pink-600 dark:text-pink-500" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {jobDetails.title}
                  </h1>
                  <p className="text-base font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                    {jobDetails.companyName}
                  </p>
                  <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                    <Calendar className="h-4 w-4 mr-1.5 text-pink-600 dark:text-pink-500" />
                    <p>
                      Posted on{' '}
                      {new Date(jobDetails.postedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  className="flex items-center justify-center h-10 px-6 py-2 text-sm font-medium text-white bg-pink-600 dark:bg-pink-500 rounded-md hover:bg-pink-700 dark:hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-colors"
                  onClick={() => setOpenDialog(true)}
                >
                  Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                </button>
                <button
                  onClick={toggleBookmark}
                  className={`h-10 w-10 rounded-md flex items-center justify-center transition-colors ${
                    bookmarked
                      ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
                      : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400'
                  }`}
                  aria-label={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  <BookmarkIcon className="h-5 w-5" fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          {/* Job highlights */}
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Job Type
                </span>
                <span className="mt-1 font-medium text-zinc-900 dark:text-white flex items-center">
                  <Briefcase className="h-4 w-4 text-pink-600 dark:text-pink-500 mr-2" />
                  {jobDetails.jobType}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Location
                </span>
                <span className="mt-1 font-medium text-zinc-900 dark:text-white flex items-center">
                  <MapPin className="h-4 w-4 text-pink-600 dark:text-pink-500 mr-2" />
                  Remote
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Experience
                </span>
                <span className="mt-1 font-medium text-zinc-900 dark:text-white flex items-center">
                  <Briefcase className="h-4 w-4 text-pink-600 dark:text-pink-500 mr-2" />
                  {`${jobDetails.minExperience}-${jobDetails.maxExperience}`} YOE
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Salary
                </span>
                <span className="mt-1 font-medium text-zinc-900 dark:text-white flex items-center">
                  {jobDetails.currency === 'INR' ? (
                    <IndianRupee className="h-4 w-4 text-pink-600 dark:text-pink-500 mr-2" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-pink-600 dark:text-pink-500 mr-2" />
                  )}
                  {(jobDetails.minSalary as number) / 1000}k-{(jobDetails.maxSalary as number) / 1000}k
                </span>
              </div>
            </div>
          </div>

          {/* Job content */}
          <div className="px-6 py-6">
            {/* Skills */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {jobDetails.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Job description */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                Job Description
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {jobDetails.description}
                </p>
              </div>
            </section>

            {/* About company */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                About {jobDetails.companyName}
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {jobDetails.companyDescription}
                </p>
              </div>
            </section>
          </div>

          {/* Apply footer */}
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Job ID: {jobDetails.id.slice(0, 8)}
            </p>
            <button
              className="px-5 py-2 text-sm font-medium text-white bg-pink-600 dark:bg-pink-500 rounded-md hover:bg-pink-700 dark:hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-colors"
              onClick={() => setOpenDialog(true)}
            >
              Apply for this position
            </button>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white">Apply for this Job</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleApplySubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Proposed Price (in {jobDetails.currency})
              </label>
              <input
                type="number"
                {...register('ProposedPrice', { valueAsNumber: true })}
                className="mt-1 w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400"
              />
              {errors.ProposedPrice && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.ProposedPrice.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Proposed Date
              </label>
              <input
                type="date"
                {...register('ProposedDate')}
                className="mt-1 w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400"
              />
              {errors.ProposedDate && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.ProposedDate.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Message
              </label>
              <textarea
                {...register('Message')}
                className="mt-1 w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400"
                rows={4}
              />
              {errors.Message && (
                <p className="text-sm text-red-500 dark:text-red-400">{errors.Message.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-pink-600 dark:bg-pink-500 text-white rounded-md hover:bg-pink-700 dark:hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-colors"
              >
                Apply
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}