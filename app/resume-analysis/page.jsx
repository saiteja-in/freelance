"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ResumeAnalysisLoading from "@/components/resume-analysis/ResumeAnalysisLoading";
import ResumeUpload from "@/components/resume-analysis/ResumeUpload";
import { redirect, useRouter } from "next/navigation";
import { currentUser } from "@/lib/auth";
import NavBar from "../_components/navbar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Input } from "@/components/ui/input";

const PDFExtractor = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [sup, wassup] = useState(false);
  const router = useRouter();
  console.log("analysis", analysis);
  console.log("parsedData", parsedData);
  // console.log("selectedJob",selectedJob)
  // console.log("pdfUrl",pdfUrl)
  const user = useCurrentUser();

  if (!user) {
    return redirect("/sign-up");
  }

  const handleUploadAgain = () => {
    setPdfUrl("");
    setAnalysis(null);
    setParsedData(null);
    wassup(false);
    router.push("/resume-analysis");
  };

  const handleGoHome = () => {
    wassup(false);
    // router.push("/");
  };

  return (
    <>
      {/* <NavBar /> */}

      <div>
        {/* comment out !analysis to test the loading state */}
        {!pdfUrl && (
          <ResumeUpload
            setParsedData={setParsedData}
            setPdfUrl={setPdfUrl}
            analysis={analysis}
            setAnalysis={setAnalysis}
            wassup={wassup}
          />
        )}

        {sup && (
          <Card className="max-w-md mx-auto mt-8 text-center">
            <CardHeader>
              <CardTitle>Invalid File</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Please upload a valid PDF file to continue.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleGoHome}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={handleUploadAgain}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Upload Resume
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* comment out analysis to test the loading state */}
        {pdfUrl && !sup && (
          <div className="grid grid-cols-5 gap-4 w-full">
            <div className="col-span-2 sticky top-4 h-[calc(100vh-2rem)]">
              <div className="w-full h-full py-4 ml-4">
                <embed
                  src={`${pdfUrl}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: "calc(100vh - 4rem)" }}
                />
              </div>
            </div>

            {!analysis && !sup && pdfUrl && (
              <div className="w-[93%] mx-auto m-4 col-span-3">
                {/* <ResumeAnalysisLoading /> */}
                <p>loading analysissssssssss</p>
              </div>
            )}

            {analysis && (
              <Card className="w-[93%] mx-auto m-4 col-span-3">
                <CardHeader className="flex flex-row items-start justify-between gap-6 py-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl font-bold">
                        Analysed skills
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div>
                    {analysis?.skills?.map((skill) => (
                      <Input key={skill} value={skill} className="w-72" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PDFExtractor;
