"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Chat from "@/components/chat";
import { Kanban } from "lucide-react";
import { RiProgress1Fill } from "@remixicon/react";
import Progress from "./progress";

export default function Page() {
  const [tab, setTab] = useState("chat");

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background/95 shadow-sm flex flex-col">
        <div className="p-5 border-b">
          {/* <h2 className="font-semibold text-lg">My Workspace</h2> */}
        </div>
        <div className="p-6 py-8 flex-1">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="flex flex-col space-y-2 bg-transparent">
              <TabsTrigger 
                value="chat" 
                className="justify-start w-full px-4 py-3 text-sm font-medium transition-all rounded-md hover:bg-accent"
              >
                <span className="mr-2 text-lg">💬</span> Chat
              </TabsTrigger>
              <TabsTrigger 
                value="kanban" 
                className="justify-start w-full px-4 py-3 text-sm font-medium transition-all rounded-md hover:bg-accent"
              >
                <Kanban className="w-4 h-4 mr-2" /> Kanban
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="justify-start w-full px-4 py-3 text-sm font-medium transition-all rounded-md hover:bg-accent"
              >
                <RiProgress1Fill className="w-4 h-4 mr-2" /> Progress
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 h-full">
          <AnimatePresence mode="wait">
            {tab === "chat" && (
              <motion.div
                key="chat"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="h-full"
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
                className="h-full"
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
                className="h-full"
              >
                <Progress/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
