import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Upload,
  Plus,
  Eye,
} from "lucide-react";
import Tesseract from "tesseract.js";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import base64 from "base64-encode-file";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";

const ResumeUpload: React.FC = ({
  setPdfUrl,
  wassup,
  setAnalysis,
  analysis,
}: any) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //extracted text can be used to store the content in future, useful for extracting keywords,cards for the future video
  const [extractedText, setExtractedText] = useState<string>("");
  const [extractedSkills, setExtractedSkills] = useState<string>("");
  const router = useRouter();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      await handleFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const readFile = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", (event) =>
        resolve(
          new Uint8Array((event.target as FileReader).result as ArrayBuffer)
        )
      );
      reader.readAsArrayBuffer(file);
    });
  };

  const getStructured = async (text: string): Promise<void> => {
    if (!text) {
      toast.error("Upload a valid report.");
      return;
    }
    console.log("text", text);

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/extract-resume-skills`,
        { extractedText: text }
      );
      if (!response.data) {
        throw new Error("No data received from server");
      }
      setExtractedSkills(response.data.skills);
      setAnalysis(response.data.skills);
    } catch (error) {
      setLoading(false);
      wassup(true);
      console.error("Error in getStructured:", error);
      console.log("is this really coming here", error);
      toast.error("Model Overloaded. Please Try again.");
    } finally {
      setLoading(false);
    }
  };

  const convertToImage = async (
    pdf: pdfjsLib.PDFDocumentProxy
  ): Promise<string[]> => {
    const images: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: canvas.getContext("2d")!,
        viewport: viewport,
      }).promise;

      images.push(canvas.toDataURL("image/png"));
    }
    console.log("images", images);
    return images;
  };

  const convertToText = async (images: string[]): Promise<string> => {
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    let fullText = "";

    for (const image of images) {
      const {
        data: { text },
      } = await worker.recognize(image);
      fullText += text + "\n\n";
    }

    await worker.terminate();
    return fullText;
  };

  const uploadImage = async (file: File): Promise<void> => {
    try {
      // Generate a unique filename
      const fileExtension = file.name.split(".").pop() || "pdf";
      const fileName = `resumes/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExtension}`;

      // Create form data for server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      // console.log("formData",formData)
      // Send to server-side API that handles S3 upload
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      console.log("resume data", data);

      // Set PDF URL from the response
      setPdfUrl(data.fileUrl);
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  };

  const handleFile = async (file: File): Promise<void> => {
    // console.log("file",file)
    if (!file) return;

    setIsLoading(true);
    setError("");
    setExtractedText("");

    try {
      const fileData = await readFile(file);
      const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
      const images = await convertToImage(pdf);
      const text = await convertToText(images);
      // console.log("fileData",fileData)
      // console.log("pdf",pdf)
      // console.log("images",images)
      // console.log("text",text)

      setExtractedText(text);
      await uploadImage(file);
      await getStructured(text);
    } catch (error) {
      toast.error("Error processing PDF");
      setError(
        `Error processing PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-[80%] bg-transparent mx-auto border-none shadow-none">
      <CardHeader>
        <CardTitle className="mt-12 mb-4">
          <h1 className="text-4xl text-center md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Resume Analysis
          </h1>
          <p className="text-gray-600 text-lg text-center font-normal mt-4">
            Upload your resume for personalized jobs
          </p>
        </CardTitle>
      </CardHeader>
      <div
        className={`
              border-2 border-dashed rounded-lg p-8 text-center
              transition-all duration-200
              ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-primary/60"
              }
            `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isLoading || loading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <span className="text-lg">Analyzing your resume...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Upload
              className={`w-12 h-12 ${
                isDragging ? "text-primary" : "text-gray-400"
              } transition-colors duration-200`}
            />
            <div className="text-lg">
              Drag and drop your resume PDF here, or
              <label className="ml-1 text-primary cursor-pointer hover:text-primary/80">
                <span className="text-blue-600 underline">browse</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Supports PDF files only</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CardContent></CardContent>
    </Card>
  );
};

export default ResumeUpload;
