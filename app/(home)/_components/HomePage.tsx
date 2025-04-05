"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  User,
  Star,
  Globe,
  Clock,
  DollarSign,
  Calendar,
  Filter,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AISearch from "./AISearch";

// Types for our data models
type FreelancerJob = {
  id: string;
  title: string;
  company: string;
  companyRating: number;
  paymentAmount: number;
  currency: string;
  requiredSkills: string[];
  deadline: string;
  timeZone: string;
};

type FreelancerProfile = {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  currency: string;
  languages: string[];
  timeZone: string;
  completedJobs: number;
};

// Sample data
const sampleJobs: FreelancerJob[] = [
  {
    id: "job1",
    title: "Full-Stack Web Developer Needed",
    company: "TechCorp Inc.",
    companyRating: 4.8,
    paymentAmount: 2500,
    currency: "USD",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    deadline: "2 weeks",
    timeZone: "GMT+0",
  },
  {
    id: "job2",
    title: "UI/UX Designer for E-commerce App",
    company: "ShopWave",
    companyRating: 4.5,
    paymentAmount: 1800,
    currency: "EUR",
    requiredSkills: ["Figma", "UI Design", "User Testing"],
    deadline: "10 days",
    timeZone: "GMT-5",
  },
  {
    id: "job3",
    title: "Mobile App Developer (React Native)",
    company: "AppFusion",
    companyRating: 4.9,
    paymentAmount: 3200,
    currency: "USD",
    requiredSkills: ["React Native", "Firebase", "Redux"],
    deadline: "3 weeks",
    timeZone: "GMT+5:30",
  },
];

const sampleFreelancers: FreelancerProfile[] = [
  {
    id: "freelancer1",
    name: "Alex Johnson",
    skills: ["React", "TypeScript", "Node.js"],
    rating: 4.9,
    hourlyRate: 45,
    currency: "USD",
    languages: ["English", "Spanish"],
    timeZone: "GMT-8",
    completedJobs: 127,
  },
  {
    id: "freelancer2",
    name: "Sara Williams",
    skills: ["UI/UX Design", "Figma", "Adobe XD"],
    rating: 4.7,
    hourlyRate: 38,
    currency: "EUR",
    languages: ["English", "French"],
    timeZone: "GMT+1",
    completedJobs: 85,
  },
  {
    id: "freelancer3",
    name: "Mike Chen",
    skills: ["React Native", "Swift", "Kotlin"],
    rating: 4.8,
    hourlyRate: 52,
    currency: "USD",
    languages: ["English", "Mandarin"],
    timeZone: "GMT+8",
    completedJobs: 93,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const HomePage: React.FC = () => {
  // Use "freelancer" or "employer" as user types.
  const [userType, setUserType] = useState<"freelancer" | "employer">(
    "freelancer"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // getResponse extracts functionality from AISearch.
  // In our mapping, employers (i.e. hiring talent) search for freelancers,
  // and freelancers search for jobs.
  const getResponse = async () => {
    try {
      if (userType === "employer") {
        // For employers, call the API to find freelancers.
        const response = await axios.post("/api/personalized/freelancers", {
          searchPrompt: searchTerm,
        });
        toast.success("Found matching freelancers");
        console.log(response.data.filters);
      } else {
        // For freelancers, call the API to find jobs.
        const response = await axios.post("/api/personalized/jobs", {
          searchPrompt: searchTerm,
        });
        toast.success("Found matching jobs");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Failed to get personalized results", error);
      toast.error("Failed to get personalized results");
    }
  };

  // Features that make your platform unique
  const uniqueFeatures = [
    {
      icon: <Filter size={32} />,
      title: "Advanced Matching Algorithm",
      description:
        "Our platform suggests jobs based on your skills, preferred rates, and company ratings",
    },
    {
      icon: <Globe size={32} />,
      title: "Time Zone Compatibility",
      description:
        "Find work that aligns with your preferred working hours across different time zones",
    },
    {
      icon: <Star size={32} />,
      title: "Transparent Rating System",
      description:
        "Make informed decisions with our comprehensive rating system for both freelancers and employers",
    },
    {
      icon: <DollarSign size={32} />,
      title: "Instant Currency Conversion",
      description:
        "See job rates in your preferred currency with real-time conversion rates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-0 right-0 w-full h-full bg-blue-500 rounded-full opacity-5"
            initial={{ scale: 0.8, x: "50%", y: "-50%" }}
            animate={{ scale: 1, x: "40%", y: "-40%" }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-full bg-purple-500 rounded-full opacity-5"
            initial={{ scale: 0.8, x: "-50%", y: "50%" }}
            animate={{ scale: 1, x: "-40%", y: "40%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Find The Perfect <span className="text-blue-600">Match</span> For
              Your Work
            </motion.h1>

            <motion.p
              className="text-xl text-gray-700 max-w-3xl mb-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Connect with top freelancers and clients based on skills, budgets,
              ratings, languages, time zones, and deadlines - all in one place.
            </motion.p>

            <motion.div
              className="w-full max-w-4xl bg-white rounded-xl shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <AISearch />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects talented freelancers with quality clients
              through a personalized matching system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Showcase your skills, experience, preferred rates, and working
                hours to attract the perfect clients.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Filter className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Get Matched</h3>
              <p className="text-gray-600">
                Our algorithm matches you with jobs that fit your skills,
                preferred payment, and scheduling requirements.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Work & Get Paid</h3>
              <p className="text-gray-600">
                Complete projects on schedule, build your reputation, and
                receive payment in your preferred currency.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our top-rated jobs and talents currently available
              on our platform.
            </p>
          </motion.div>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-10">
              <TabsTrigger value="jobs" className="text-lg py-3">
                Latest Jobs
              </TabsTrigger>
              <TabsTrigger value="freelancers" className="text-lg py-3">
                Top Freelancers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {sampleJobs.map((job) => (
                  <motion.div key={job.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3">{job.title}</h3>
                        <div className="flex items-center mb-4">
                          <span className="font-medium text-gray-700 mr-2">
                            {job.company}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm ml-1">
                              {job.companyRating}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requiredSkills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-semibold text-green-600">
                              {job.paymentAmount} {job.currency}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {job.deadline}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Time Zone: {job.timeZone}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center mt-12">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 text-lg">
                  Browse All Jobs
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="freelancers">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {sampleFreelancers.map((freelancer) => (
                  <motion.div key={freelancer.id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">
                          {freelancer.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm">
                            {freelancer.rating} • {freelancer.completedJobs}{" "}
                            jobs
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {freelancer.skills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-purple-100 text-purple-800"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-semibold text-green-600">
                              {freelancer.hourlyRate} {freelancer.currency}/hr
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Globe className="h-4 w-4 mr-1" />
                            <span>{freelancer.languages.join(", ")}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Time Zone: {freelancer.timeZone}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center mt-12">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 text-lg">
                  Browse All Freelancers
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Our platform goes beyond basic freelancing with these unique
              features designed to provide you with the perfect match.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of freelancers and businesses finding their perfect
              match on our platform. Sign up today and experience the
              difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 text-lg font-semibold">
                Sign Up as Freelancer
              </Button>
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 py-3 px-8 text-lg font-semibold">
                Post a Job
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
