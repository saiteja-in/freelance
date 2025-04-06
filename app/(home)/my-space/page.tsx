"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Chat from "@/components/chat";
import { Kanban } from "lucide-react";
import { RiProgress1Fill } from "@remixicon/react";
import Progress from "./progress";

// export const metadata: Metadata = {
//   title: "Experiment 02 - Crafted.is",
// };

export default function Page() {
  const [tab, setTab] = useState("chat");

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 pt-10 border-r p-4 space-y-4">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex flex-col space-y-2">
            <TabsTrigger value="chat" className="justify-start">
              <span className="mr-2">💬</span> Chat
            </TabsTrigger>
            <TabsTrigger value="kanban" className="justify-start">
              <Kanban className="w-4 h-4 mr-2" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="progress" className="justify-start">
              <RiProgress1Fill className="w-4 h-4 mr-2" /> Progress
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {tab === "chat" && (
            <motion.div
              key="chat"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Chat />
            </motion.div>
          )}

          {tab === "kanban" && (
            <motion.div
              key="kanban"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {/* Replace this with your actual Kanban component */}
              <div className="text-lg font-semibold">Kanban Board goes here</div>
            </motion.div>
          )}

          {tab === "progress" && (
            <motion.div
              key="progress"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Progress/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
