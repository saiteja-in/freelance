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
  
  export const getUsersWithRatings = async () => {
    const usersWithUpvoteCounts = await db.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        location: true,
        githubLink: true,
        portfolioLink: true,
        linkedinLink: true,
        twitterLink: true,
        websiteLink: true,
        skills: true,
        upvotes: true, // all upvotes on the user’s products
        products: {
          select: {
            id: true,
            upvotes: true,
          },
        },
      },
    });
  
    // Calculate total upvotes per user
    const usersWithRatings = usersWithUpvoteCounts.map((user) => {
      const totalUpvotes = user.products.reduce(
        (acc, product) => acc + product.upvotes.length,
        0
      );
  
      return {
        ...user,
        rating: totalUpvotes,
      };
    });
  
    return usersWithRatings;
  };
  
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
      if (!session) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }
  
      const userId = session.user.id; // This should always be a string now
  
      // Validate input data using Zod schema
      const parsed = CreateJobSchema.safeParse(data);
      if (!parsed.success) {
        return {
          success: false,
          error: "Bad request - Invalid data",
          details: parsed.error.format(),
        };
      }
  
      // Get user's company information to populate job details
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
          error: "User not found",
        };
      }
  
      // Prepare job data
      const jobData = {
        posterId: userId!, // Non-null assertion: userId is guaranteed to be a string here
        title: parsed.data.title,
        companyName: parsed.data.companyName || user.name || "",
        companyLogo: parsed.data.companyLogo || user.image || "",
        companyDescription: parsed.data.companyDescription || user.bio || "",
        companyWebsite: parsed.data.companyWebsite || user.websiteLink || "",
        location: parsed.data.location || user.location || "",
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
      };
  
      // Create the job record in the database
      await db.job.create({
        data: jobData,
      });
  
      return {
        success: true,
        message: "Job created successfully",
      };
    } catch (err) {
      console.error("Error in creating job: ", err);
      return {
        success: false,
        error: "Internal server error",
      };
    }
  };
  
  
  export const getJobs = async (
    page: number,
    limit: number,
    searchQuery?: string,
    commitmentTypes?: string[],
    experienceTypes?: string[],
    payTypes?: string[],
  ) => {
    try {
      const skipRecords = (page - 1) * limit;
  
      const expRanges = experienceTypes?.map((exp) => {
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


  export const applyJob = async (jobId: string) => {
    try {
      const session = await auth()
      if (!session) {
        return {
          success: false,
          error: 'Unauthorised',
        };
      }
  
      // const customSession = session as CustomSession;
      const id = session.user.id
      if (!jobId) {
        return {
          success: false,
          error: 'Bad request',
        };
      }
  
      // const isRecordAlreadyExists = await db.applied.findUnique({
      //   where: {
      //     jobSeekerId: id,
      //   },
      // });
  
      // if (isRecordAlreadyExists) {
      //   return {
      //     success: false,
      //     error: 'Already applied',
      //   };
      // }
  
      await db.applied.create({
        data: {
          jobSeekerId: id,
          jobId: jobId,
        },
      });
  
      return {
        success: true,
        message: 'applied',
      };
    } catch (err) {
      console.error('error adding applied data : ', err);
      return {
        success: false,
        error: 'Internal server error',
      };
    }
  };