'use client';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Job } from '@prisma/client';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getJobs } from '@/lib/server-actions';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BriefcaseBusiness, Loader2 } from 'lucide-react';

export default function JobSearch() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <p className="text-sm text-zinc-400">Loading jobs...</p>
          </div>
        </div>
      }
    >
      <JobSearchContent />
    </Suspense>
  );
}

function JobSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  const limit = 6;

  const commitmentTypes = searchParams.getAll('commitment');
  const experienceTypes = searchParams.getAll('exp');
  const skillTypes = searchParams.getAll('skills');
  const payTypes = searchParams.getAll('pay');

  const fetchJobs = useCallback(
    async (resetJobs = false, query?: string) => {
      if (loading || (!hasMore && !resetJobs)) return;

      const currentPage = resetJobs ? 1 : page;

      try {
        setLoading(true);
        const currentCommitments = Array.from(
          searchParams.getAll('commitment'),
        );
        const currentExps = Array.from(searchParams.getAll('exp'));
        const currentPays = Array.from(searchParams.getAll('pay'));

        const { jobs, hasMore } = await getJobs(
          currentPage,
          limit,
          query,
          currentCommitments,
          currentExps,
          currentPays,
          skillTypes.join(','),
        );

        if (query || resetJobs) {
          setJobs(jobs);
        } else {
          setJobs((prevJobs) => [...prevJobs, ...jobs]);
        }

        setPage((prevPage) => (resetJobs ? 2 : prevPage + 1));
        setHasMore(hasMore);
        setInitialLoad(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setInitialLoad(false);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, searchParams],
  );

  // debounced search for perfomance
  const debouncedSearch = useCallback(
    debounce((query?: string) => {
      setJobs([]);
      setPage(1);
      setHasMore(true);
      fetchJobs(true, query);
    }, 500),
    [fetchJobs],
  );

  // handling search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // handling changes in commitment
  const handleCommitmentChange = (type: string) => {
    const params = new URLSearchParams(searchParams);

    if (commitmentTypes.includes(type)) {
      const updatedCommitments = commitmentTypes.filter((t) => t !== type);

      params.delete('commitment');
      updatedCommitments.forEach((t) => params.append('commitment', t));
    } else {
      params.append('commitment', type);
    }

    router.replace(`?${params.toString()}`);
  };

  // handling changes in experience
  const handleExperienceChange = (exp: string) => {
    const params = new URLSearchParams(searchParams);

    if (experienceTypes.includes(exp)) {
      const updatedExps = experienceTypes.filter((t) => t !== exp);

      params.delete('exp');
      updatedExps.forEach((t) => params.append('exp', t));
    } else {
      params.append('exp', exp);
    }

    router.replace(`?${params.toString()}`);
  };

  // handling changes in skills
  const handleSkills = (skills: string) => {
    const params = new URLSearchParams(searchParams);

    if (skillTypes.includes(skills)) {
      const updatedSkills = skillTypes.filter((t) => t !== skills);

      params.delete('skills');
      updatedSkills.forEach((t) => params.append('skills', t));
    } else {
      params.append('skills', skills);
    }

    router.replace(`?${params.toString()}`);
  };

  // handling changes in pay
  const handlePayChange = (pay: string) => {
    const params = new URLSearchParams(searchParams);

    if (payTypes.includes(pay)) {
      const updatedPays = payTypes.filter((p) => p !== pay);

      params.delete('pay');
      updatedPays.forEach((p) => params.append('pay', p));
    } else {
      params.append('pay', pay);
    }

    router.replace(`?${params.toString()}`);
  };
  
  // fetch job when searchParams changes
  useEffect(() => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    fetchJobs(true, searchQuery);
  }, [searchParams]);

  // debounce clean up
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // infinite scrolling
  useEffect(() => {
    if (inView) {
      fetchJobs(false, searchQuery);
    }
  }, [inView, fetchJobs, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col gap-8 px-4 py-6 md:flex-row md:py-10"
    >
      <JobFilter
        handleCommitment={handleCommitmentChange}
        handleExp={handleExperienceChange}
        handlePay={handlePayChange}
        handleSearch={handleSearchChange}
        handleSkills={handleSkills}
        searchQuery={searchQuery}
      />

      <div className="flex w-full flex-1 flex-col md:px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Available Jobs
            {jobs.length > 0 && (
              <span className="ml-2 text-base font-normal text-zinc-400">
                ({jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found)
              </span>
            )}
          </h1>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] w-full pr-4">
          <AnimatePresence>
            {initialLoad ? (
              <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              </div>
            ) : jobs.length === 0 && !loading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-64 flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/50 p-8 text-center"
              >
                <BriefcaseBusiness className="mb-4 h-16 w-16 text-zinc-700" />
                <h3 className="mb-2 text-lg font-medium text-white">No jobs found</h3>
                <p className="text-sm text-zinc-400">
                  Try adjusting your search criteria or removing some filters
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job, i) => (
                  <JobCard job={job} key={job.id || i} />
                ))}
                
                <div ref={ref} className="flex h-20 w-full items-center justify-center">
                  {loading && (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
                      <p className="text-sm text-zinc-400">Loading more jobs...</p>
                    </div>
                  )}
                  
                  {!loading && !hasMore && jobs.length > 0 && (
                    <p className="text-sm text-zinc-500">
                      You've reached the end of the list
                    </p>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </motion.div>
  );
}