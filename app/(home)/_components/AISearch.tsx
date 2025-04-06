"use client";

import { useState, useEffect, useRef } from "react";
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  Router,
  Search,
  Star,
  Timer,
  UserCog,
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
    <div className="w-full max-w-7xl mx-auto p-6 rounded-xl">
      <div className=" backdrop-blur-md rounded-xl p-8 shadow-2xl text-white">

        {/* Toggle Bar */}
        <div className="relative flex rounded-full p-1 mb-6 bg-white/10 dark:bg-slate-800/50 overflow-hidden backdrop-blur-sm">
          {/* Animated Glider */}
          <motion.div
            className="absolute top-1 left-1 bg-white dark:bg-slate-700 rounded-full shadow-md transition-transform duration-300 ease-in-out z-0"
            style={gliderStyle}
          />
          
          <button
            ref={findRef}
            onClick={() => setActiveTab("find")}
            className={`relative z-10 flex-1 py-2 text-center font-medium text-sm rounded-full transition-colors ${
              activeTab === "find" ? "text-blue-600" : "text-black"
            }`}
          >
            Find talent
          </button>
          <button
            ref={browseRef}
            onClick={() => setActiveTab("browse")}
            className={`relative z-10 flex-1 py-2 text-center font-medium text-sm rounded-full transition-colors ${
              activeTab === "browse" ? "text-blue-600" : "text-black"
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
            className="w-full py-3 px-4 pe-32 pr-16 bg-white text-blue-800 rounded-full focus:outline-none shadow-lg transition duration-200 ease-in-out focus:scale-105"
          />
          <motion.button
            onClick={getResponse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-1 top-1 bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70 text-primary-foreground rounded-full p-2 flex items-center justify-center shadow-md"
          >
            <Search className="h-5 w-5" />
            <span className="ml-1 mr-2 font-medium">Search</span>
          </motion.button>
        </div>

        {/* Current Role Indicator */}
        <div className="text-sm text-muted-foreground dark:text-slate-400 mb-4">
          Searching as: <span className="font-medium text-foreground dark:text-slate-200">{role}</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
              <Filter className="mr-1 h-4 w-4" /> Advanced Filters
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
              <DollarSign className="mr-1 h-4 w-4" /> Budget
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
              <BadgeCheck className="mr-1 h-4 w-4" /> Skills
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
              <Briefcase className="mr-1 h-4 w-4" /> Experience
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer py-2 px-3">
              <UserCog className="mr-1 h-4 w-4" /> Commitment
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
