"use server"

import { auth } from "@/auth";
import { db } from "./db";
import { JobType } from '@prisma/client';
import { CreateJobSchema, CreateJobSchemaType } from "@/app/_components/jobs.validator";

interface ProductData {
    name: string;
    slug: string;
    headline: string;
    description: string;
    logo: string;
    website: string;
    twitter: string;
    github: string;
    images: string[];
    category: string[];
    rank?: number;
  }
  
  export const createProduct = async ({
    name,
    slug,
    headline,
    description,
    logo,
    website,
    twitter,
    github,
    images,
    category,
  }: ProductData): Promise<any> => {
    try {
      const authenticatedUser = await auth();
  
      if (!authenticatedUser) {
        throw new Error("You must be signed in to create a product");
      }
  
      const userId = authenticatedUser.user?.id;
  
      const product = await db.product.create({
        data: {
          name,
          rank: 0,
          slug,
          headline,
          description,
          logo,
          website,
          twitter,
          github,
          categories: {
            connectOrCreate: category.map((name) => ({
              where: {
                name,
              },
              create: {
                name,
              },
            })),
          },
          images: {
            createMany: {
              data: images.map((image) => ({ url: image })),
            },
          },
  
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      console.log("project",product)
      return product;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  export const getOwnerProducts = async () => {
    const authenticatedUser = await auth();
  
    if (!authenticatedUser) {
      return [];
    }
  
    const userId = authenticatedUser.user?.id;
  
    const products = await db.product.findMany({
      where: {
        userId,
      },
    });
  
    return products;
  };
  
  export const commentOnProduct = async (
    productId: string,
    commentText: string
  ) => {
    try {
      const authenticatedUser = await auth();
  
      if (
        !authenticatedUser ||
        !authenticatedUser.user ||
        !authenticatedUser.user.id
      ) {
        throw new Error("User ID is missing or invalid");
      }
  
      const userId = authenticatedUser.user.id;
  
      // Check if authenticated user has a profile picture
      const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined
  
      await db.comment.create({
        data: {
          createdAt: new Date(),
          productId,
          userId,
          body: commentText,
          profilePicture: profilePicture,
        },
        include: {
          user: true,
        },
      });
  
      const productDetails = await db.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          userId: true,
          name: true, // Include the product name in the query
        },
      });
  
      // Check if the commenter is not the owner of the product
      // if (productDetails && productDetails.userId !== userId) {
      //   // Notify the product owner about the comment
      //   await db.notification.create({
      //     data: {
      //       userId: productDetails.userId,
      //       body: `Commented on your product "${productDetails.name}"`,
      //       profilePicture: profilePicture,
      //       productId: productId,
      //       type: "COMMENT",
      //       status: "UNREAD",
      //       // Ensure commentId is included here
      //     },
      //   });
      // }
    } catch (error) {
      console.error("Error commenting on product:", error);
      throw error;
    }
  };
  
  export const deleteComment = async (commentId: string) => {
    try {
      await db.comment.delete({
        where: {
          id: commentId,
        },
      });
      return true;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };
  export const getActiveProducts = async () => {
    const products = await db.product.findMany({
      include: {
        categories: true,
        images: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
    });
  
    return products;
  };


  export const upvoteProduct = async (productId: string) => {
    try {
      const authenticatedUser = await auth();
  
      if (
        !authenticatedUser ||
        !authenticatedUser.user ||
        !authenticatedUser.user.id
      ) {
        throw new Error("User ID is missing or invalid");
      }
  
      const userId = authenticatedUser.user.id;
  
      const upvote = await db.upvote.findFirst({
        where: {
          productId,
          userId,
        },
      });
  
      const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined
  
      if (upvote) {
        await db.upvote.delete({
          where: {
            id: upvote.id,
          },
        });
      } else {
        await db.upvote.create({
          data: {
            productId,
            userId,
          },
        });
  
        const productOwner = await db.product.findUnique({
          where: {
            id: productId,
          },
          select: {
            userId: true,
          },
        });
  
        // notify the product owner about the upvote
  
        // if (productOwner && productOwner.userId !== userId) {
        //   await db.notification.create({
        //     data: {
        //       userId: productOwner.userId,
        //       body: `Upvoted your product`,
        //       profilePicture: profilePicture,
        //       productId: productId,
        //       type: "UPVOTE",
        //       status: "UNREAD",
        //     },
        //   });
        // }
      }
      return true;
    } catch (error) {
      console.error("Error upvoting product:", error);
      throw error;
    }
  };


  export const createJob = async (data: CreateJobSchemaType) => {
    try {
      // Get authenticated user session
      const session = await auth();
      if (!session || !session.user.id) {
        return {
          success: false,
          error: 'Unauthorized', // Handle case where user is not authenticated
        };
      }
  
      const userId = session.user.id; // `userId` is guaranteed to be a string now
  
      // Validate input data using Zod schema
      const parsed = CreateJobSchema.safeParse(data);
      if (!parsed.success) {
        return {
          success: false,
          error: 'Bad request - Invalid data',
          details: parsed.error.format(),
        };
      }
  
      // Get user's company information
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
          image: true,
          bio: true,
          location: true,
          websiteLink: true,
        },
      });
  
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }
  
      // Prepare job data
      const jobData = {
        posterId: userId, // Now guaranteed to be a string
        title: parsed.data.title,
        companyName: parsed.data.companyName || user.name || '',
        companyLogo: parsed.data.companyLogo || user.image || '',
        companyDescription: parsed.data.companyDescription || user.bio || '',
        companyWebsite: parsed.data.companyWebsite || user.websiteLink || '',
        location: parsed.data.location || user.location || '',
        minExperience: parseInt(parsed.data.minExp, 10) || 0,
        maxExperience: parseInt(parsed.data.maxExp, 10) || 0,
        minSalary: parsed.data.minSalary ? parseInt(parsed.data.minSalary, 10) : undefined,
        maxSalary: parsed.data.maxSalary ? parseInt(parsed.data.maxSalary, 10) : undefined,
        description: parsed.data.jobDesc,
        jobType: parsed.data.jobType,
        currency: parsed.data.currency,
        applicationLink: parsed.data.link,
        applicationEmail: parsed.data.applicationEmail || user.email,
        isRemote: parsed.data.isRemote || false,
        skillsRequired: parsed.data.skills,
        ExpectedTime: parsed.data.ExpectedTime,  // New field
      };
  
      // Create the job record in the database
      await db.job.create({
        data: jobData,
      });
  
      return {
        success: true,
        message: 'Job created successfully',
      };
    } catch (err) {
      console.error('Error in creating job: ', err);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  };
  
  
  
  
  export const getJobs = async (
    page: number,
    limit: number,
    searchQuery: string="",
    commitmentTypes: string[]=[],
    experienceTypes: string[]=[],
    payTypes: string[]=[],
    skills: string=""
  ) => {
    console.log({
      page,
      limit,
      searchQuery,
      commitmentTypes,
      experienceTypes,
      payTypes,
      skills
    })
    try {
      const skipRecords = (page - 1) * limit;

      if(skills==="" && commitmentTypes.length === 0 && experienceTypes.length === 0 && payTypes.length === 0 && searchQuery==="") {
        const jobs = await db.job.findMany({
          take: limit,
        })

        const cnt = await db.job.count();

        return {
          success: true,
          jobs,
          hasMore: limit < cnt,
        }
      }
  
      const expRanges = experienceTypes.map((exp) => {
        if (exp.includes('+')) {
          const minExp = parseInt(exp.replace('+', '').trim());
          return { min: minExp, max: 100 };
        }
  
        const [min, max] = exp
          .split('-')
          .map((num) => parseInt(num.replace('YOE', '').trim()));
  
        return { min, max };
      });
  
      const payRanges = payTypes?.map((pay) => {
        if (pay.includes('+')) {
          const minPay = parseInt(pay.replace('+', '').trim());
          return { min: minPay, max: 10000 };
        }
  
        const [min, max] = pay.split('-').map((num) => parseInt(num));
  
        return { min, max };
      });

      const skillsArray = skills?.split(',').map((skill) => skill.trim().toLowerCase()) ?? [];
  
      const [jobs, totalCount] = await Promise.all([
        db.job.findMany({
          take: limit,
          where: {
            AND: [
              {
                ...(searchQuery
                  ? { title: { contains: searchQuery, mode: 'insensitive' } }
                  : {}),
              },
              {
                ...(skillsArray.length > 0
                  ? {
                      skillsRequired: { hasSome: skillsArray },
                    }
                  : {}),
              },
              {
                ...(commitmentTypes && commitmentTypes.length > 0
                  ? {
                      jobType: { in: commitmentTypes as JobType[] },
                    }
                  : {}),
              },
              {
                ...(experienceTypes && experienceTypes.length > 0
                  ? {
                      OR: expRanges?.map((range) => ({
                        AND: [
                          { minExperience: { lte: range.max } },
                          { maxExperience: { gte: range.min } },
                        ],
                      })),
                    }
                  : {}),
              },
              {
                ...(payTypes && payTypes.length > 0
                  ? {
                      OR: payRanges?.map((range) => ({
                        AND: [
                          { minSalary: { lte: range.max * 1000 } },
                          { maxSalary: { gte: range.min * 1000 } },
                        ],
                      })),
                    }
                  : {}),
              }
            ],
          },
          skip: skipRecords,
          orderBy: {
            postedAt: 'desc',
          },
        }),
  
        db.job.count({
          where: {
            AND: [
              {
                ...(searchQuery
                  ? { title: { contains: searchQuery, mode: 'insensitive' } }
                  : {}),
              },
              {
                ...(commitmentTypes && commitmentTypes.length > 0
                  ? {
                      jobType: { in: commitmentTypes as JobType[] },
                    }
                  : {}),
              },
              {
                ...(experienceTypes && experienceTypes.length > 0
                  ? {
                      OR: expRanges?.map((range) => ({
                        AND: [
                          { minExperience: { lte: range.max } },
                          { maxExperience: { gte: range.min } },
                        ],
                      })),
                    }
                  : {}),
              },
              {
                ...(payTypes && payTypes.length > 0
                  ? {
                      OR: payRanges?.map((range) => ({
                        AND: [
                          { minSalary: { lte: range.max * 1000 } },
                          { maxSalary: { gte: range.min * 1000 } },
                        ],
                      })),
                    }
                  : {}),
              },
            ],
          },
        }),
      ]);
      console.log(jobs);
      return {
        jobs,
        hasMore: skipRecords + jobs.length < totalCount,
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  };


  export const getJobDetails = async (jobId: string) => {
    try {
      if (!jobId) {
        return {
          success: false,
          error: 'Bad request',
        };
      }
  
      const job = await db.job.findUnique({
        where: {
          id: jobId,
        },
      });
  
      if (!job) {
        return {
          success: false,
          error: 'Job not found',
        };
      }
  
      return {
        success: true,
        job,
      };
    } catch (err) {
      console.error('error fetching job details : ', err);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  };


  export const applyJob = async (
    jobId: string,
    ProposedPrice: number,
    ProposedDate: string,
    Message: string
  ) => {
    console.log(jobId);
    console.log(ProposedDate);
    console.log(ProposedPrice);
    console.log(Message);
  
    try {
      // Check if the user is authenticated
      const session = await auth();
      if (!session || !session.user || !session.user.id) {
        return {
          success: false,
          error: 'Unauthorized', // If session or user id is missing, return Unauthorized
        };
      }
  
      const id = session.user.id;
  
      // Check if the user has already applied for the job
      const isRecordAlreadyExists = await db.applied.findFirst({
        where: {
          jobSeekerId: id,
          jobId: jobId,
        },
      });
  
      if (isRecordAlreadyExists) {
        return {
          success: false,
          error: 'Already applied',
        };
      }
  
      // Get employer information from the job
      const job = await db.job.findUnique({
        where: { id: jobId },
        select: {
          posterId: true, // The user who posted the job
        },
      });
  
      if (!job) {
        return {
          success: false,
          error: 'Job not found',
        };
      }
  
      const employerId = job.posterId;
  
      // Apply for the job
      await db.applied.create({
        data: {
          jobSeekerId: id, // `id` is guaranteed to be a string
          jobId: jobId,
          employerId: employerId, // Set employerId from the job poster
          ProposedPrice,
          ProposedDate: new Date(ProposedDate), // Ensure the ProposedDate is a valid Date object
          Message,
        },
      });
  
      return {
        success: true,
        message: 'Applied successfully',
      };
    } catch (err) {
      console.error('Error adding applied data:', err);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  };
  
  
  
  

  export const getJobSeekerCards = async () => {
    try {
      const authenticatedUser = await auth();
      if (!authenticatedUser || !authenticatedUser.user?.id) {
        throw new Error("Unauthorized");
      }
  
      const jobSeekerId = authenticatedUser.user.id;
  
      // Fetch applied jobs with only the necessary fields
      const appliedJobs = await db.applied.findMany({
        where: {
          jobSeekerId,
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              companyName: true,
              location: true,
              minExperience: true,
              maxExperience: true,
              description: true,
              skillsRequired: true,
              minSalary: true,
              maxSalary: true,
              currency: true,
              ExpectedTime: true,
            },
          },
        },
      });
  
      return appliedJobs.map((appliedJob) => ({
        jobId: appliedJob.job.id,
        title: appliedJob.job.title,
        companyName: appliedJob.job.companyName,
        location: appliedJob.job.location,
        minExperience: appliedJob.job.minExperience,
        maxExperience: appliedJob.job.maxExperience,
        description: appliedJob.job.description,
        skillsRequired: appliedJob.job.skillsRequired,
        minSalary: appliedJob.job.minSalary,
        maxSalary: appliedJob.job.maxSalary,
        currency: appliedJob.job.currency,
        ExpectedTime: appliedJob.job.ExpectedTime,
      }));
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      throw new Error("Failed to fetch applied jobs");
    }
  };