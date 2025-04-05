"use client";

import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

interface SubmitProps {
//   products: any;
  authenticatedUser: any;
}

const Jobs: React.FC<SubmitProps> = ({  authenticatedUser }) => {
  const router = useRouter();

  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

  const handleClick = async () => {
      router.push("/create-job");
    
  };

  return (
    <div>
      <button 
        onClick={handleClick}
        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
      >
        Post a Job
      </button>
    </div>
  );
};

export default Jobs;
