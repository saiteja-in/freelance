"use server"

import { auth } from "@/auth";
import { db } from "./db";

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