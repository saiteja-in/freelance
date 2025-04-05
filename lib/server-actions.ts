"use server"

import { auth } from "@/auth";
import { db } from "./db";
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
  
  
  