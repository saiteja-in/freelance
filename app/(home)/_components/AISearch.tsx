"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Router,
  Search,
  Star,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AISearch() {
  const [activeTab, setActiveTab] = useState<"find" | "browse">("find");
  const [gliderStyle, setGliderStyle] = useState({});
  const [prompt, setPrompt] = useState<string>("");
  const findRef = useRef<HTMLButtonElement>(null);
  const browseRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Map activeTab to role for API calls
  const role = activeTab === "find" ? "client" : "freelancer";

  useEffect(() => {
    // Update glider position when tab changes or on initial render
    const updateGliderPosition = () => {
      const activeButton =
        activeTab === "find" ? findRef.current : browseRef.current;
      if (activeButton) {
        setGliderStyle({
          width: `${activeButton.offsetWidth}px`,
          height: `${activeButton.offsetHeight}px`,
          transform: `translateX(${
            activeTab === "find" ? 0 : activeButton.offsetWidth
          }px)`,
        });
      }
    };

    updateGliderPosition();
    window.addEventListener("resize", updateGliderPosition);
    return () => window.removeEventListener("resize", updateGliderPosition);
  }, [activeTab]);

  const getResponse = async () => {
    console.log(prompt);
    try {
      if (role === "client") {
        const response = await axios.post("/api/personalized/freelancers", {
          searchPrompt: prompt,
        });
        console.log(response.data.url);
        toast.success("Found matching freelancers");
        router.push(response.data.url);
        // router.push(
        //   "/find-jobs?exp=0-1+YOE&exp=3-6+YOE&pay=0-10&pay=100%2B&commitment=INTERNSHIP"
        // );
      } else {
        const response = await axios.post("/api/personalized/jobs", {
          searchPrompt: prompt,
        });
        console.log(response.data);
        toast.success("Found matching jobs");
      }
    } catch (error) {
      console.error("Failed to get personalized results", error);
      toast.error("Failed to get personalized results");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-xl">
      <div className=" backdrop-blur-md rounded-xl p-8 shadow-2xl text-white">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

        {/* Toggle Bar */}
        <div className="relative flex rounded-full p-1 mb-6 overflow-hidden">
          {/* Animated Glider */}
          <motion.div
            className="absolute top-1 left-1 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-0"
            style={gliderStyle}
          />
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
          </div>

          <button
            ref={findRef}
            onClick={() => setActiveTab("find")}
            className={`relative z-10 flex-1 py-2 text-center font-medium text-sm rounded-full transition-colors ${
              activeTab === "find" ? "text-blue-600" : "text-white"
            }`}
          >
            Find talent
          </button>
          <button
            ref={browseRef}
            onClick={() => setActiveTab("browse")}
            className={`relative z-10 flex-1 py-2 text-center font-medium text-sm rounded-full transition-colors ${
              activeTab === "browse" ? "text-blue-600" : "text-white"
            }`}
          >
            Browse jobs
          </button>
        </div>

        {/* Search Area */}
        <div className="relative mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Search by role, skills, or keywords"
            className="w-full py-3 px-4 pr-16 bg-white text-blue-800 rounded-full focus:outline-none shadow-lg transition duration-200 ease-in-out focus:scale-105"
          />
          <motion.button
            onClick={getResponse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-1 top-1 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2 flex items-center justify-center shadow-md"
          >
            <Search className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 mr-2 font-medium">Search</span>
          </motion.button>
        </div>

        {/* Current Role Indicator */}
        <div className="text-sm text-blue-100 mb-4">
          Searching as: <span className="font-medium text-white">{role}</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
            <Filter className="mr-1 h-4 w-4" /> Advanced Filters
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
            <Star className="mr-1 h-4 w-4" /> Company Rating
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
            <DollarSign className="mr-1 h-4 w-4" /> Payment Range
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
            <Clock className="mr-1 h-4 w-4" /> Time Zone Match
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
            <Calendar className="mr-1 h-4 w-4" /> Deadline
          </Badge>
        </div>
      </div>
    </div>
  );
}
