import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION1!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY1!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1!
  }
});

const generateFileName = (bytes = 32) => {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
};

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as Blob;
    const userId = formData.get("userId") as string;
    const routeId = formData.get("routeId") as string;

    if (!file || !userId || !routeId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate checksum for the file
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const checksum = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const fileName = generateFileName();
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME1!,
      Key: fileName,
      ContentType: file.type,
      ChecksumSHA256: checksum,
      Metadata: {
        userId: userId
      }
    });

    try {
      const signedURL = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60
      });

      // Upload file to S3
      const uploadResponse = await fetch(signedURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to S3");
      }

      // Construct the permanent URL for the uploaded file
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME1}.s3.${process.env.AWS_BUCKET_REGION1}.amazonaws.com/${fileName}`;

      // Save to database
    //   const image = await db.image.create({
    //     data: {
    //       url: imageUrl,
    //       userId: userId,
    //       routeId: routeId
    //     }
    //   });

      return NextResponse.json({ image, imageUrl: image.url }, { status: 201 });
    } catch (uploadError) {
      console.error("S3 Upload Error:", uploadError);
      return NextResponse.json(
        { message: "Error uploading image to S3" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General Error:", error);
    return NextResponse.json(
      { message: `Error uploading image: ${error}` },
      { status: 500 }
    );
  }
}

//comment out above code and replace with the below code if any errors with the aws s3
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import cloudinary from "@/lib/cloudinary";
// import { NextRequest } from "next/server";
// import streamifier from "streamifier";
// import { currentUser } from "@/lib/auth";
// import { db } from "@/lib/db";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   const user = await currentUser();
//   if (!user) {
//     return NextResponse.json(
//       { message: "User not authenticated" },
//       { status: 401 },
//     );
//   }

//   try {
//     const formData = await req.formData();
//     const file = formData.get("image") as Blob;
//     const userId = formData.get("userId") as string;
//     const routeId = formData.get("routeId") as string;

//     if (!file || !userId || !routeId) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     let uploadedImage;
//     try {
//       uploadedImage = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           },
//         );
//         streamifier.createReadStream(buffer).pipe(uploadStream);
//       });
//     } catch (uploadError) {
//       console.error("Cloudinary Upload Error:", uploadError);
//       return NextResponse.json(
//         { message: "Error uploading image to Cloudinary" },
//         { status: 500 },
//       );
//     }

//     let image;
//     try {
//       if (
//         typeof uploadedImage === "object" &&
//         uploadedImage !== null &&
//         "secure_url" in uploadedImage
//       ) {
//         const imageUrl = (uploadedImage as { secure_url: string }).secure_url;
        
//         image = await db.image.create({
//           data: {
//             url: imageUrl,
//             userId: userId,
//             routeId: routeId,
//           },
//         });
//       } else {
//         throw new Error("Invalid uploaded image");
//       }
//     } catch (dbError) {
//       console.error("Database Insertion Error:", dbError);
//       return NextResponse.json(
//         { message: "Error saving image to database" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({ image, imageUrl: image.url }, { status: 201 });
//   } catch (error) {
//     console.error("General Error:", error);
//     return NextResponse.json(
//       { message: `Error uploading image: ${error}` },
//       { status: 500 },
//     );
//   }
// }
