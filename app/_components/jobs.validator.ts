import { string, z } from 'zod';

export const CreateJobSchema = z.object({
    title: z.string().min(1, 'Job title is required'),
    jobType: z.enum(['PART_TIME', 'FULL_TIME', 'FREELANCE', 'INTERNSHIP']),
    minExp: z.string().min(1, 'Minimum experience is required'),
    maxExp: z.string().min(1, 'Maximum experience is required'),
    jobDesc: z.string().min(1, 'Description is required'),
    skills: z.array(string()),
    minSalary: z.string().min(1, 'Minimum salary is required'),
    maxSalary: z.string().min(1, 'Maximum salary is required'),
    currency: z.enum(['INR', 'USD']),
    link: z.string().url(),
    
    // New field
    isRemote: z.boolean().optional(),
  
    // Company-related fields
    companyName: z.string().optional(),
    companyLogo: z.string().optional(),
    companyDescription: z.string().optional(),
    companyWebsite: z.string().optional(),
    location: z.string().optional(),
    
    applicationEmail: z.string().optional(),
  });

export type CreateJobSchemaType = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  jobType: z.enum(['PART_TIME', 'FULL_TIME', 'FREELANCE', 'INTERNSHIP']),
  minExp: z.string().min(1, 'Minimum experience is required'),
  maxExp: z.string().min(1, 'Maximum experience is required'),
  jobDesc: z.string().min(1, 'Description is required'),
  skills: z.array(string()),
  minSalary: z.string().min(1, 'Minimum salary is required'),
  maxSalary: z.string().min(1, 'Maximum salary is required'),
  currency: z.enum(['INR', 'USD']),
  link: z.string().url(),

  // Include the company-related fields for updating jobs
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  companyDescription: z.string().optional(),
  companyWebsite: z.string().optional(),
  location: z.string().optional(),

  // Include applicationEmail for updates as well
  applicationEmail: z.string().email().optional(),
});

export type UpdateJobSchemaType = z.infer<typeof UpdateJobSchema>;
