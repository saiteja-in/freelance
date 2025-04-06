'use client';
import { Briefcase, DollarSign, IndianRupee, MapPin, Bookmark, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { Job } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // Add your bookmark logic here
  };

  const navigateToJobDetails = () => {
    router.push(`/find-jobs/${job.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="w-full"
    >
      <Card 
        onClick={navigateToJobDetails}
        className="group flex w-full cursor-pointer flex-col border dark:border-zinc-800 border-zinc-200 
                 bg-white dark:bg-zinc-950 shadow-md transition-all 
                 hover:border-pink-500/50 hover:shadow-pink-500/10"
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              {job.companyLogo ? (
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-sm">
                  <Image
                    src={job.companyLogo}
                    alt={`${job.companyName} logo`}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-pink-500/20 text-lg font-bold text-pink-500">
                  {job.companyName?.charAt(0)}
                </div>
              )}
              
              <div className="flex flex-col">
                <h3 className="text-base font-medium text-zinc-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                  {job.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{job.companyName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => handleBookmark(e)}
                    >
                      <Bookmark 
                        className={`h-4 w-4 ${isBookmarked ? 'fill-pink-500 text-pink-500' : 'text-zinc-600 dark:text-zinc-400'}`} 
                      />
                      <span className="sr-only">Bookmark</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isBookmarked ? 'Remove bookmark' : 'Save job'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <Badge variant="outline" className="flex items-center gap-1 border-zinc-200 dark:border-zinc-700 
                                             bg-zinc-100 dark:bg-zinc-900 font-normal text-zinc-700 dark:text-zinc-300">
              <CalendarDays className="h-3 w-3 text-pink-500" />
              Posted {new Date(job.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Badge>
            
            <Badge variant="outline" className="border-zinc-200 dark:border-zinc-700 
                                            bg-zinc-100 dark:bg-zinc-900 font-normal text-zinc-700 dark:text-zinc-300">
              {job.jobType}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 border-zinc-200 dark:border-zinc-700 
                                             bg-zinc-100 dark:bg-zinc-900 font-normal text-zinc-700 dark:text-zinc-300">
              <MapPin className="h-3 w-3 text-pink-500" />
              Remote
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 border-zinc-200 dark:border-zinc-700 
                                             bg-zinc-100 dark:bg-zinc-900 font-normal text-zinc-700 dark:text-zinc-300">
              {job.currency === 'INR' ? (
                <IndianRupee className="h-3 w-3 text-pink-500" />
              ) : (
                <DollarSign className="h-3 w-3 text-pink-500" />
              )}
              {job.minSalary ? `${job.minSalary / 1000}k` : ''}{job.maxSalary ? `-${job.maxSalary / 1000}k` : ''}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1 border-zinc-200 dark:border-zinc-700 
                                             bg-zinc-100 dark:bg-zinc-900 font-normal text-zinc-700 dark:text-zinc-300">
              <Briefcase className="h-3 w-3 text-pink-500" />
              {`${job.minExperience}-${job.maxExperience}`} YOE
            </Badge>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2 p-4 pt-2">
          {job.skillsRequired.map((skill, i) => (
            <Badge 
              key={i} 
              className="bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20"
            >
              {skill}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}