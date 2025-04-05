"use client";

import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

interface SubmitProps {
  products: any;
  authenticatedUser: any;
}

const Submit: React.FC<SubmitProps> = ({ products, authenticatedUser }) => {
  const router = useRouter();

  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

  const handleClick = async () => {
      router.push("/create-product");
    
  };

  return (
    <div>
      <button 
        onClick={handleClick}
        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
      >
        Add Work
      </button>
    </div>
  );
};

export default Submit;
