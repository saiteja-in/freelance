"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RiShining2Line,
  RiAttachment2,
  RiMicLine,
  RiLeafLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { getContractParties } from "@/lib/server-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { getMessages, sendMessage } from "@/actions/messages";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  avatar?: string;
  role?: string;
  online?: boolean;
}

interface Message { 
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
}

export default function Messages() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  
  const [activeChat, setActiveChat] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [contractData, setContractData] = useState<{freelancerId: string, clientId: string} | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch contract parties on mount
  useEffect(() => {
    const fetchContractParties = async () => {
      try {
        setLoading(true);
        const contract = await getContractParties();
        setContractData(contract);
        
        // Set up active chat based on user role
        if (contract && currentUserId) {
          const isFreelancer = currentUserId === contract.freelancerId;
          const chatUserId = isFreelancer ? contract.clientId : contract.freelancerId;
          
          const chatUser: User = {
            id: chatUserId,
            name: isFreelancer ? "Client" : "Freelancer",
            email: "",
            image: "",
            role: isFreelancer ? "Client" : "Freelancer",
            online: false,
          };
          setActiveChat(chatUser);
        }
      } catch (error) {
        console.error("Failed to fetch contract parties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUserId) {
      fetchContractParties();
    }
  }, [currentUserId]);

  // Fetch the messages when the active chat is set
  useEffect(() => {
    if (!activeChat?.id || !currentUserId) return;
    
    const fetchMessages = async () => {
      try {
        const msgs = await getMessages(currentUserId, activeChat.id);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    
    fetchMessages();
  }, [currentUserId, activeChat?.id]);

  // Handle real-time messages via Pusher
  useEffect(() => {
    if (!activeChat?.id || !currentUserId) return;

    const channel = pusherClient.subscribe("chat");

    const handleNewMessage = (message: Message) => {
      const isRelevant = [message.senderId, message.receiverId].includes(currentUserId) &&
        [message.senderId, message.receiverId].includes(activeChat.id);
      if (isRelevant) {
        setMessages((prev) => [...prev, message]);
      }
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe("chat");
    };
  }, [currentUserId, activeChat?.id]);

  // Send the message to the server and reset input
  const handleSendMessage = async () => {
    if (!input.trim() || !activeChat || !currentUserId) return;

    try {
      await sendMessage({
        senderId: currentUserId,
        receiverId: activeChat.id,
        content: input.trim(),
      });
      setInput(""); // Reset input field
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // UI helper for message display
  const ChatMessage = ({ children, isUser = false }: { children: React.ReactNode, isUser?: boolean }) => (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} max-w-3xl mx-auto`}>
      <div className={`${isUser ? "bg-primary text-primary-foreground" : "bg-secondary"} rounded-lg p-3 max-w-[75%]`}>
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-center h-screen">
            <p>Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        <ScrollArea className="flex-1 h-screen [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
          <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
            {/* Header */}
            {activeChat && (
              <div className="py-4 border-b border-border">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeChat.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">{activeChat.role}</div>
                        {activeChat.online && (
                          <div className="flex items-center">
                            <div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs text-muted-foreground">Online</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
              </div>
            )}

            {/* Chat */}
            <div className="relative grow">
              <div className="max-w-3xl mx-auto mt-6 space-y-6">
                <div className="text-center my-8">
                  <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                    <RiShining2Line
                      className="me-1.5 text-muted-foreground/70 -ms-1"
                      size={14}
                      aria-hidden="true"
                    />
                    Today
                  </div>
                </div>
                
                {messages.map((message) => {
                  const isMe = message.senderId === currentUserId;
                  return (
                    <ChatMessage key={message.id} isUser={isMe}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`mt-1 text-right text-xs ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </ChatMessage>
                  );
                })}
                
                <div ref={messagesEndRef} aria-hidden="true" />
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 pt-4 md:pt-8 z-9999">
              <div className="max-w-3xl mx-auto bg-background rounded-[20px] pb-4 md:pb-8">
                <div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
                  <textarea
                    className="flex sm:min-h-[84px] w-full bg-transparent px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none]"
                    placeholder="Ask me anything..."
                    aria-label="Enter your message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  />
                  {/* Textarea buttons */}
                  <div className="flex items-center justify-between gap-2 p-3">
                    {/* Left buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                      >
                        <RiAttachment2
                          className="text-muted-foreground/70 size-5"
                          size={20}
                          aria-hidden="true"
                        />
                        <span className="sr-only">Attach</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                      >
                        <RiMicLine
                          className="text-muted-foreground/70 size-5"
                          size={20}
                          aria-hidden="true"
                        />
                        <span className="sr-only">Audio</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                      >
                        <RiLeafLine
                          className="text-muted-foreground/70 size-5"
                          size={20}
                          aria-hidden="true"
                        />
                        <span className="sr-only">Action</span>
                      </Button>
                    </div>
                    {/* Right buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full size-8 border-none hover:bg-background hover:shadow-md transition-[box-shadow]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                        >
                          <g clipPath="url(#icon-a)">
                            <path
                              fill="url(#icon-b)"
                              d="m8 .333 2.667 5 5 2.667-5 2.667-2.667 5-2.667-5L.333 8l5-2.667L8 .333Z"
                            />
                            <path
                              stroke="#451A03"
                              strokeOpacity=".04"
                              d="m8 1.396 2.225 4.173.072.134.134.071L14.604 8l-4.173 2.226-.134.071-.072.134L8 14.604l-2.226-4.173-.071-.134-.134-.072L1.396 8l4.173-2.226.134-.071.071-.134L8 1.396Z"
                            />
                          </g>
                          <defs>
                            <linearGradient
                              id="icon-b"
                              x1="8"
                              x2="8"
                              y1=".333"
                              y2="15.667"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FDE68A" />
                              <stop offset="1" stopColor="#F59E0B" />
                            </linearGradient>
                            <clipPath id="icon-a">
                              <path fill="#fff" d="M0 0h16v16H0z" />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="sr-only">Generate</span>
                      </Button>
                      <Button className="rounded-full h-8" onClick={handleSendMessage}>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}