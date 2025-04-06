"use client"
import { useForm } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { CreateJobSchema, CreateJobSchemaType } from './jobs.validator';
import { createJob } from '@/lib/server-actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, Clock, DollarSign, Globe } from 'lucide-react';

function ErrorMessage({ err }: { err: FieldError | undefined  }) {
    return <>{err && <p className="text-xs text-red-500">{err.message}</p>}</>;
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export enum Currency {
  INR = 'INR',
  USD = 'USD',
}

export default function CreateJobForm() {
  const [skills, setSkills] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<CreateJobSchemaType>({
    resolver: zodResolver(CreateJobSchema),
  });

  const handleCreateJob = async (data: CreateJobSchemaType) => {
    try {
      setLoading(true);
      const response = await createJob(data);
      if (response.success) {
        toast.success("🎉 Job posted successfully!");
      } else {
        toast.error(response.error || "Failed to post the job. Please try again.");
      }
    } catch (error) {
      console.error('Error during creating job : ', error);
      toast.error("Something went wrong while posting the job.");
    } finally {
      setLoading(false);
      reset();
      setSkills('');
    }
  };
    

  useEffect(() => {
    setValue('skills', skills.split(','));
  },[setValue,skills]);

  return (
    <div className="flex h-full w-full flex-col items-start">
      <Card className="mx-auto mt-8 max-w-2xl bg-background shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Briefcase className="h-5 w-5 text-pink-500" />
            Create New Job
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleCreateJob)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Job Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="mt-1 bg-background focus-visible:ring-pink-500"
                />
                <ErrorMessage err={errors.title} />
              </div>

              <div>
                <Label htmlFor="ExpectedTime" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-pink-500" />
                  Expected Time (months/years/days)
                </Label>
                <Input
                  type="text"
                  id="ExpectedTime"
                  {...register('ExpectedTime')}
                  placeholder="e.g. 6 months, 2 years, 30 days"
                  className="mt-1 bg-background focus-visible:ring-pink-500"
                />
                <ErrorMessage err={errors.ExpectedTime} />
              </div>

              <div>
                <Label htmlFor="jobType" className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-pink-500" />
                  Job Type
                </Label>
                <Select onValueChange={(value: JobType) => setValue('jobType', value)}>
                  <SelectTrigger className="mt-1 bg-background focus-visible:ring-pink-500">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(JobType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minExperience" className="text-sm font-medium">
                    Min Experience (years)
                  </Label>
                  <Input
                    type="number"
                    id="minExperience"
                    {...register('minExp')}
                    min="0"
                    className="mt-1 bg-background focus-visible:ring-pink-500"
                  />
                </div>
                <div>
                  <Label htmlFor="maxExperience" className="text-sm font-medium">
                    Max Experience (years)
                  </Label>
                  <Input
                    type="number"
                    id="maxExperience"
                    {...register('maxExp')}
                    min="0"
                    className="mt-1 bg-background focus-visible:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Job Description
                </Label>
                <Textarea
                  id="description"
                  {...register('jobDesc')}
                  rows={4}
                  className="mt-1 bg-background focus-visible:ring-pink-500"
                />
              </div>

              <div>
                <Label htmlFor="skillsRequired" className="text-sm font-medium">
                  Skills Required (comma-separated)
                </Label>
                <Input
                  type="text"
                  id="skillsRequired"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="mt-1 bg-background focus-visible:ring-pink-500"
                />
              </div>

              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="minSalary" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-pink-500" />
                    Min Salary (Per annum)
                  </Label>
                  <Input
                    type="number"
                    id="minSalary"
                    {...register('minSalary')}
                    min="0"
                    className="mt-1 bg-background focus-visible:ring-pink-500"
                  />
                </div>
                <div>
                  <Label htmlFor="maxSalary" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-pink-500" />
                    Max Salary (Per annum)
                  </Label>
                  <Input
                    type="number"
                    id="maxSalary"
                    {...register('maxSalary')}
                    min="0"
                    className="mt-1 bg-background focus-visible:ring-pink-500"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium">
                    Currency
                  </Label>
                  <Select onValueChange={(value: Currency) => setValue('currency', value as Currency)}>
                    <SelectTrigger className="mt-1 bg-background focus-visible:ring-pink-500">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Currency).map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="link" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-pink-500" />
                  Application Link
                </Label>
                <Input
                  type="url"
                  id="link"
                  {...register('link')}
                  className="mt-1 bg-background focus-visible:ring-pink-500"
                />
              </div>
            </div>

            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white focus:ring-pink-500"
              >
                {loading ? <Spinner /> : 'Post Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}