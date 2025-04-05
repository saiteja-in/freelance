"use client"
import NavBar from "@/app/_components/navbar";
import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { CircleAlert, Globe2Icon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { LogoUploader } from "@/app/_components/logo-uploader";
import { ImagesUploader } from "@/app/_components/images-uploader";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { createProduct } from "@/lib/server-actions";
const categories = [
  "Media",
  "Blockchain",
  "Cloud",
  "Commerce",
  "Cybersecurity",
  "Data",
  "Design",
  "Photography",
  "E-commerce",
  "Education",
  "Entertainment",
  "Video",
  "Finance",
  "Social",
  "Health",
  "Fitness",
  "Marketing",
  "Music",
  "Productivity",
  "Engineering",
  "Sales",
  "Sports",
  "Travel",
  "Bootstrapped",
  "Art",
  "Analytics",
];
const NewProduct = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [headline, setHeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
      []
    );
    const [shortDescription, setShortDescription] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [slug, setSlug] = useState("");
    const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>("");
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [github, setGithub] = useState("");
    const prevStep = useCallback(() => {
      setStep(step - 1);
    }, [step]);
    const handleWebsiteChange = (e: any) => {
      setWebsite(e.target.value);
    };
    const handleXChange = (e: any) => {
      setTwitter(e.target.value);
    };
  
    const handleGithubChange = (e: any) => {
      setGithub(e.target.value);
    };
    const handleHeadlineChange = (e: any) => {
      const headlineText = e.target.value.slice(0, 70);
      setHeadline(headlineText);
    };
    const handleShortDescriptionChange = (e: any) => {
      setShortDescription(e.target.value.slice(0, 300));
    };
    const handleLogoUpload = useCallback((url: any) => {
      setUploadedLogoUrl(url);
    }, []);
  
    const handleProductImagesUpload = useCallback((urls: string[]) => {
      setUploadedProductImages(urls);
    }, []);
  
    const handleCategoryToggle = (category: string) => {
      if (selectedCategories.includes(category)) {
        setSelectedCategories((prevCategories) =>
          prevCategories.filter((prevCategory) => prevCategory !== category)
        );
      } else if (selectedCategories.length < 3) {
        setSelectedCategories((prevCategories) => [...prevCategories, category]);
        console.log(selectedCategories.length)
      }
    };
  
    const handleGoToProducts = () => {
      window.location.href = "/my-products";
    };
  
    const submitAnotherProduct = () => {
      setStep(1);
      setName("");
      setSlug("");
      setHeadline("");
      setShortDescription("");
      setWebsite("");
      setTwitter("");
      setGithub("");
      setSelectedCategories([]);
      setUploadedProductImages([]);
      setUploadedLogoUrl("");
    };
    const handleNameChange = (e: any) => {
        const productName = e.target.value;
        const truncatedName = productName.slice(0, 30);
        setName(truncatedName);
    
        //create slug from product name
    
        const slugValue = truncatedName
          .toLowerCase()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/\./g, "-"); // Replace periods with hyphens in the slug
        setSlug(slugValue);
      };


      const nextStep = useCallback(() => {
        if (step === 1 && name.length < 4) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Please enter at least 4 characters for the product name.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
    
          return;
        }
        if (step === 2 && selectedCategories.length < 3) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Please select at least 3 categories for the product.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
          return;
        }
    
        if (step === 3 && headline.length < 10) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Please enter at least 10 characters for the headline.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
          return;
        }
        if (step === 3 && shortDescription.length < 20) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Please enter at least 20 characters for the short description.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
          return;
        }
    
        if (step === 4 && !uploadedLogoUrl) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Please upload a logo for the product.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
          return;
        }
    
        if (step === 4 && uploadedProductImages.length < 1) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Upload at least 3 images for the product.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
          return;
        }
    
        // if (step === 5 && !date) {
        //   toast(
        //     <>
        //       <div className="flex items-center gap-4  mx-auto">
        //         <PiXCircleFill className="text-red-500 text-3xl" />
        //         <div className="text-md font-semibold">
        //           Please select a release date or choose the Coming soon option.
        //         </div>
        //       </div>
        //     </>,
        //     {
        //       position: "top-center",
        //     }
        //   );
        //   return;
        // }
    
        if (step == 5 && !website && !twitter && !github) {
          toast(
            <>
              <div className="flex items-center gap-4  mx-auto">
                <CircleAlert className="text-red-500 text-3xl" />
                <div className="text-md font-semibold">
                  Please enter at least one link for the product.
                </div>
              </div>
            </>,
            {
              position: "top-center",
            }
          );
          return;
        }
    
        setStep(step + 1);
      }, [
        step,
        name,
        selectedCategories,
        headline,
        shortDescription,
        uploadedLogoUrl,
        uploadedProductImages,
        // date,
        website,
        twitter,
        github,
      ]);
      const submitProduct = async () => {
        setLoading(true);
    
        try {
          await createProduct({
            name,
            slug,
            headline,
            website,
            twitter,
            github,
            description: shortDescription,
            logo: uploadedLogoUrl,
            images: uploadedProductImages,
            category: selectedCategories,
          });
          setStep(8);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
  return (
    <div className="flex items-center justify-center py-8 md:py-20">
      <div className="px-8 md:w-3/5 md:mx-auto">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} // Slide in from the right
            animate={{ opacity: 1, x: 0 }} // Slide to the center
            exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            <h1 className="text-4xl font-semibold"> 📦 New product</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Ready to showcase your product to the world? You came to the right
              place. Follow the steps below to get started.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Name of the product</h2>
              <input
                type="text"
                value={name}
                maxLength={30}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                onChange={handleNameChange}
              />
              <div className="text-sm text-gray-500 mt-1">
                {name.length} / 30
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-medium">
                Slug (URL) - This will be used to create a unique URL for
                yourproduct
              </h2>

              <input
                type="text"
                value={slug}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                readOnly
              />
            </div>
          </motion.div>
        )}
                {step === 2 && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }} // Slide in from the right
          animate={{ opacity: 1, x: 0 }} // Slide to the center
          exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
          transition={{ duration: 0.3 }}
          
          className="space-y-10">
            <h1 className="text-4xl font-semibold">
              {" "}
              📊 What category does your product belong to ?{" "}
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Choose at least 3 categories that best fits your product. This
              will people discover your product
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Select Categories</h2>
              <div className="grid grid-cols-4 gap-2 pt-4 items-center justify-center">
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    className="flex border rounded-full"
                    onClick={() => handleCategoryToggle(category)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className={`text-xs md:text-sm p-2 cursor-pointer w-full text-center
                     ${
                       selectedCategories.includes(category)
                         ? "bg-[#ff6154] text-white rounded-full"
                         : "text-black dark:text-white"
                     }`}
                    >
                      {category}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
                {step === 3 && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }} // Slide in from the right
          animate={{ opacity: 1, x: 0 }} // Slide to the center
          exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
          transition={{ duration: 0.3 }}
          
          className="space-y-10">
            <div className="text-4xl font-semibold">📝 Product Details</div>
            <p className="text-xl font-light mt-4 leading-8">
              Keep it simple and clear. Describe your product in a way that
              makes it easy for people to understand what it does.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Headline</h2>
              <input
                type="text"
                value={headline}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                onChange={handleHeadlineChange}
              />

              <div className="text-sm text-gray-500 mt-1">
                {headline.length} / 70
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-medium">Short Description</h2>
              <textarea
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                rows={8}
                maxLength={300}
                value={shortDescription}
                onChange={handleShortDescriptionChange}
              />

              <div className="text-sm text-gray-500 mt-1">
                {shortDescription.length} / 300
              </div>
            </div>
          </motion.div>
        )}
                {step === 4 && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }} // Slide in from the right
          animate={{ opacity: 1, x: 0 }} // Slide to the center
          exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
          transition={{ duration: 0.3 }}
          
          className="space-y-10">
            <h1 className="text-4xl font-semibold">
              🖼️ Add images to showcase your product
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Include images that best represent your product. This will help
              people understand what your product looks like.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Logo</h2>
              {uploadedLogoUrl ? (
                <div className="mt-2">
                  <Image
                    src={uploadedLogoUrl}
                    alt="logo"
                    width={1000}
                    height={1000}
                    className="rounded-md h-40 w-40 object-cover"
                  />
                </div>
              ) : (
                <LogoUploader
                  endpoint="productLogo"
                  onChange={handleLogoUpload}
                />
              )}
            </div>
            <div className="mt-4">
              <div className="font-medium">
                Product Images ( upload atleast 3 images )
              </div>
              {uploadedProductImages.length > 0 ? (
                <div className="mt-2 md:flex gap-2 space-y-4 md:space-y-0">
                  {uploadedProductImages.map((url, index) => (
                    <div key={index} className="relative  md:w-40 h-40 ">
                      <Image
                        priority
                        src={url}
                        alt="Uploaded Product Image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ImagesUploader
                  endpoint="productImages"
                  onChange={handleProductImagesUpload}
                />
              )}
            </div>
          </motion.div>
        )}
          {step === 5 && (
          <motion.div
          initial={{ opacity: 0, x: "100%" }} // Slide in from the right
          animate={{ opacity: 1, x: 0 }} // Slide to the center
          exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
          transition={{ duration: 0.3 }}
          
          className="space-y-10">
            <h1 className="text-4xl font-semibold">Additional Links </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Add links to your product&apos;s website, github , and other
              platforms
            </p>

            <div className="mt-10">
              <div className="font-medium flex items-center gap-x-2">
                <Globe2Icon className="text-2xl text-gray-600" />
                <span>Website</span>
              </div>

              <input
                type="text"
                value={website}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                placeholder="https://www.yourdomain.com"
                onChange={handleWebsiteChange}
              />
            </div>

            <div className="mt-10">
              <div className="font-medium flex items-center gap-x-2">
                <FaGithub className="text-2xl text-sky-400" />
                <div>Github</div>
              </div>

              <input
                placeholder="https://www.github.com/your-username/your-repo"
                type="text"
                className="border rounded-md p-2 w-full mt-2 focus:outline-none "
                value={github}
                onChange={handleGithubChange}
              />
            </div>

            <div className="mt-10">
              <div className="font-medium flex items-center gap-x-2">
                <TwitterLogoIcon className="text-2xl text-indigo-500" />
                <div>X</div>
              </div>

              <input
                placeholder="https://www.x.com"
                type="text"
                className="border rounded-md p-2 w-full mt-2 focus:outline-none "
                value={twitter}
                onChange={handleXChange}
              />
            </div>
          </motion.div>
        )}
            {step === 6 && (
          <motion.div 
          initial={{ opacity: 0, x: "100%" }} // Slide in from the right
          animate={{ opacity: 1, x: 0 }} // Slide to the center
          exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
          transition={{ duration: 0.3 }}
          
          
          className="space-y-10">
            <h1 className="text-4xl font-semibold"> 🔍 Review and submit</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Review the details of your product and submit it to the world.
              Your product will be reviewed by our team before it goes live.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-8">
              <div className="">
                <div className="font-semibold">Name of the product</div>
                <div className=" mt-2 text-gray-600">{name}</div>
              </div>

              <div className="">
                <div className="font-semibold">Slug ( URL ) </div>
                <div className=" mt-2 text-gray-600">{slug}</div>
              </div>

              <div className="">
                <div className="font-semibold">Category</div>
                <div className="  mt-2 text-gray-600">
                  {selectedCategories.join(", ")}
                </div>
              </div>

              <div>
                <div className="font-semibold">Website URL</div>
                <div className=" mt-2 text-gray-600">{website}</div>
              </div>

              <div className="">
                <div className="font-semibold">Headline</div>
                <div className="  mt-2 text-gray-600">{headline}</div>
              </div>
              <div className="">
                <div className="font-semibold">Short description</div>
                <div className=" mt-2 text-gray-600 ">{shortDescription}</div>
              </div>

              <div>
                <div className="font-semibold">Twitter</div>
                <div className=" mt-2 text-gray-600">{twitter}</div>
              </div>

              <div>
                <div className="font-semibold">Github</div>
                <div className=" mt-2 text-gray-600">{github}</div>
              </div>

             

              <div className="cols-span-2">
                <div className="font-semibold">Product Images</div>
                <div className="mt-2 md:flex gap-2 w-full">
                  {uploadedProductImages.map((url, index) => (
                    <div key={index} className="relative w-28 h-28">
                      <Image
                        priority
                        src={url}
                        alt="Uploaded Product Image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
                {step === 7 && (
          <div className="space-y-10">
            <div className="text-4xl font-semibold"> Congratulations 🎉 </div>
            <div className="text-xl font-light mt-4 leading-8 ">
              Your product has been successfully submitted. Our team will review
              it and get back to you soon.
            </div>

            <div className="flex flex-col  gap-4">
              <div
                onClick={handleGoToProducts}
                className="bg-[#ff6154] text-white py-2 px-4
                 rounded mt-4 flex w-60 justify-center items-center cursor-pointer"
              >
                Go to your products
              </div>

              <Separator />

              <div
                onClick={submitAnotherProduct}
                className="text-[#ff6154] py-2 px-4 rounded mt-4 
                flex w-60 justify-center items-center cursor-pointer"
              >
                Submit another product
              </div>
            </div>
          </div>
        )}
          {step !== 7 && (
          <>
            <div className="flex justify-between items-center mt-10">
              {step !== 1 && (
                <button onClick={prevStep} className="text-gray-600">
                  Previous
                </button>
              )}

              <div className="flex items-center">
                {step === 6 ? (
                  <button
                    onClick={submitProduct}
                    className="bg-[#ff6154] text-white py-2 px-4 rounded-md mt-4 items-end"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="bg-[#ff6154] text-white py-2 px-4 rounded-md mt-4 items-end"
                  >
                    {step === 7 ? "Submit" : "Continue"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewProduct;
