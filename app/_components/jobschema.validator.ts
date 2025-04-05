import { z } from 'zod';

// Zod schema for the "Apply for Job" form
export const ApplyJobSchema = z.object({
  // Proposed price for the job application (must be a positive integer)
  ProposedPrice: z
    .number()
    .min(1, 'Proposed price is required and must be greater than 0')
    .int('Proposed price must be an integer'),

  // Proposed date for the job application (must be a non-empty string representing a date)
  ProposedDate: z.string().nonempty('Proposed date is required'),

  // Message from the applicant (should have a minimum length of 10 characters)
  Message: z
    .string()
    .min(10, 'Message should be at least 10 characters long')
    .nonempty('Message is required'),
});

// TypeScript type derived from the Zod schema
export type ApplyJobSchemaType = z.infer<typeof ApplyJobSchema>;
