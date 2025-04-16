"use client"

import { useState } from "react"

export default function ComprehensiveDetailView({ record, onBack }) {
  const [activeSection, setActiveSection] = useState("overview")

  // Parse the data from record
  const finalAnalysis = record?.fields.finalAnalysis ? JSON.parse(record.fields.finalAnalysis) : null

  const techStack = record?.fields.techStack ? JSON.parse(record.fields.techStack) : null

  const quizData = record?.fields.quizData ? JSON.parse(record.fields.quizData) : null

  const screenRecordAnalysis = record?.fields.screenRecordAnalysis
    ? JSON.parse(record.fields.screenRecordAnalysis)
    : null

  const codeAnalysisReport = record?.fields.codeAnalysisReport ? JSON.parse(record.fields.codeAnalysisReport) : null

  // Star Rating component
  const StarRating = ({ rating, maxRating = 5 }) => {
    return (
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-700">{typeof rating === "number" ? rating.toFixed(1) : rating}</span>
      </div>
    )
  }

  // Tab icons
  const tabIcons = {
    overview: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    resources: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    systemPrompt: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
    screenRecord: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    codeAnalysis: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    techStack: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
    quizData: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }

  // Tab data
  const tabs = [
    { id: "overview", title: "Overview" },
    { id: "resources", title: "Resources" },
    { id: "systemPrompt", title: "System Prompt" },
    { id: "screenRecord", title: "Screen Record" },
    { id: "codeAnalysis", title: "Code Analysis" },
    ...(techStack ? [{ id: "techStack", title: "Tech Stack" }] : []),
    ...(quizData ? [{ id: "quizData", title: "Quiz Data" }] : []),
  ]

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-2xl text-center">
          <div className="text-gray-500 text-xl mb-6">Record not found</div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-7xl mx-auto transition-all duration-300 hover:shadow-xl">
      {/* Header with title and back button */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Record Details</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white bg-opacity-20 text-gray-600 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Horizontal Tabs - Redesigned to avoid scrolling */}
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center justify-center px-3 py-3 rounded-lg transition-all duration-300 transform ${
                activeSection === tab.id
                  ? "bg-indigo-50 text-indigo-700 font-medium scale-105 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:scale-105"
              }`}
            >
              <span
                className={`p-1.5 rounded-full mr-2 transition-all duration-300 ${
                  activeSection === tab.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"
                }`}
              >
                {tabIcons[tab.id]}
              </span>
              <span className="truncate">{tab.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Content sections with animations */}
        <div className={`${activeSection === "overview" && finalAnalysis ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "overview" && finalAnalysis && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">Overview & Final Analysis</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      finalAnalysis.isRelevantTask ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {finalAnalysis.isRelevantTask ? "Relevant Task" : "Irrelevant Task"}
                  </span>
                </div>
                <div
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="text-xs text-gray-500 mb-1">Score</div>
                  <div className="text-gray-600 font-semibold">{Number.parseFloat(finalAnalysis.score).toFixed(1)*10} / 10</div>
                </div>
                <div
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="text-xs text-gray-500 mb-1">Rating</div>
                  <StarRating rating={Number.parseFloat(finalAnalysis.rating)} />
                </div>
                <div
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="text-xs text-gray-500 mb-1">Project Functionality</div>
                  <div className="text-gray-600 font-medium">{finalAnalysis.projectFunctionality}</div>
                </div>
              </div>

              {/* Summary */}
              <div
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                style={{ animationDelay: "0.5s" }}
              >
                <h3 className="text-lg font-medium text-gray-700 mb-3">Summary</h3>
                <p className="text-gray-600 leading-relaxed">{finalAnalysis.overallReport}</p>
              </div>

              {/* Completion Status */}
              <div
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                style={{ animationDelay: "0.6s" }}
              >
                <h3 className="text-md font-medium text-gray-700 mb-3">Completion Status</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full animate-progressBar"
                      style={{ width: `${finalAnalysis.completionStatus}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{finalAnalysis.completionStatus}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${activeSection === "resources" ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "resources" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">Information & Resources</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                  style={{ animationDelay: "0.1s" }}
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Name</div>
                      <div className="text-gray-800">{record.fields.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Email</div>
                      <div className="text-gray-800">{record.fields.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Task ID</div>
                      <div className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                        {record.fields.taskId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links & Resources */}
                <div
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                  style={{ animationDelay: "0.2s" }}
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Links & Resources</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">GitHub URL</div>
                      <a
                        href={record.fields.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 block hover:underline truncate transition-all duration-200"
                      >
                        {record.fields.githubUrl}
                      </a>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Video URL</div>
                      <a
                        href={record.fields.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 block hover:underline truncate transition-all duration-200"
                      >
                        {record.fields.videoUrl}
                      </a>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">DEPLOYMENT URL</div>
                      <a
                        href={record.fields.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 block hover:underline truncate transition-all duration-200"
                      >
                        {record.fields.deploymentUrl}
                      </a>
                    </div>

                    {/* Tech Stack & Quiz Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {techStack && (
                        <button
                          onClick={() => setActiveSection("techStack")}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-300 flex items-center gap-2 hover:shadow-md hover:translate-y-[-2px] active:translate-y-[0px]"
                        >
                          {tabIcons.techStack}
                          View Tech Stack
                        </button>
                      )}

                      {quizData && (
                        <button
                          onClick={() => setActiveSection("quizData")}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-300 flex items-center gap-2 hover:shadow-md hover:translate-y-[-2px] active:translate-y-[0px]"
                        >
                          {tabIcons.quizData}
                          View Quiz Data
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${activeSection === "systemPrompt" ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "systemPrompt" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">System Prompt</h2>

              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {record.fields.systemPrompt}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${activeSection === "screenRecord" ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "screenRecord" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">Screen Record Analysis</h2>

              {screenRecordAnalysis ? (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 animate-fadeIn">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        screenRecordAnalysis.isRelevantTask ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {screenRecordAnalysis.isRelevantTask ? "Relevant Task" : "Irrelevant Task"}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {screenRecordAnalysis.functionality}
                    </span>
                  </div>

                  {/* Overall Report */}
                  <div
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Overall Report</h3>
                    <p className="text-gray-600 leading-relaxed">{screenRecordAnalysis.overallReport}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500">No screen record analysis available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`${activeSection === "codeAnalysis" ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "codeAnalysis" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">Code Analysis Report</h2>

              {codeAnalysisReport ? (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 mb-4 animate-fadeIn">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        codeAnalysisReport.isRelevantTask ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {codeAnalysisReport.isRelevantTask ? "Relevant Task" : "Irrelevant Task"}
                    </span>

                    {/* Star Rating */}
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3.5 h-3.5 ${i < codeAnalysisReport.starRating ? "text-yellow-500" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-yellow-800 ml-1.5">
                        {codeAnalysisReport.starRating}/5
                      </span>
                    </div>

                    {/* Completion Status Badge */}
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                      {codeAnalysisReport.completionStatus}% Complete
                    </span>
                  </div>

                  {/* Overall Report */}
                  <div
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Overall Report</h3>
                    <p className="text-gray-600 leading-relaxed">{codeAnalysisReport.overallReport}</p>
                  </div>

                  {/* Tech Stack */}
                  <div
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Tech Stack</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(codeAnalysisReport.techStack).map(([key, value], index) => (
                        <div
                          key={key}
                          className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                          style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                        >
                          <span className="text-xs text-gray-500 uppercase">{key}</span>
                          <p className="text-gray-800 font-medium mt-1">{value || "None"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools Section */}
                  {codeAnalysisReport.tools && (
                    <div
                      className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Tools</h3>
                        <div className="flex items-center">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              codeAnalysisReport.tools.isUsed
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {codeAnalysisReport.tools.numberOfTools} Tools Used
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{codeAnalysisReport.tools.summary}</p>
                    </div>
                  )}

                  {/* Memory Section */}
                  {codeAnalysisReport.memory && (
                    <div
                      className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Memory Management</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            codeAnalysisReport.memory.isUsed.longTerm
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Long-term Memory: {codeAnalysisReport.memory.isUsed.longTerm ? "Yes" : "No"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            codeAnalysisReport.memory.isUsed.shortTerm
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Short-term Memory: {codeAnalysisReport.memory.isUsed.shortTerm ? "Yes" : "No"}
                        </span>
                      </div>
                      <p className="text-gray-600">{codeAnalysisReport.memory.summary}</p>
                    </div>
                  )}

                  {/* Vector DB Section */}
                  {codeAnalysisReport.vectorDB && (
                    <div
                      className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <h3 className="text-lg font-medium text-gray-700 mb-3">Vector Database</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            codeAnalysisReport.vectorDB.isUsed
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Vector DB: {codeAnalysisReport.vectorDB.isUsed ? "Used" : "Not Used"}
                        </span>
                      </div>
                      <p className="text-gray-600">{codeAnalysisReport.vectorDB.summary}</p>
                    </div>
                  )}

                  {/* Completion Status */}
                  <div
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Completion Status</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full animate-progressBar"
                          style={{ width: `${codeAnalysisReport.completionStatus}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{codeAnalysisReport.completionStatus}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <p className="mt-4 text-gray-500">No code analysis available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`${activeSection === "techStack" && techStack ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "techStack" && techStack && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">Technology Stack</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(techStack).map(([key, value], index) => (
                  <div
                    key={key}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </h3>
                    <div className="text-md font-semibold text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={`${activeSection === "quizData" && quizData ? "animate-slideIn" : "hidden"}`}>
          {activeSection === "quizData" && quizData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeInDown">Quiz Data Results</h2>

              <div className="space-y-6">
                {Object.values(quizData).map((item, index) => (
                  <div
                    key={item.questionNumber}
                    className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] animate-fadeIn"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="flex items-start">
                      <div className="bg-green-100 text-green-800 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0 animate-pulse">
                        {item.questionNumber}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium text-gray-800">{item.question}</h3>

                        {/* Code Snippet */}
                        {item.codeSnippet && (
                          <pre className="mt-3 p-3 bg-indigo-50 rounded-md border border-indigo-100 text-xs font-mono overflow-x-auto text-gray-800">
                            {item.codeSnippet}
                          </pre>
                        )}

                        {/* Details */}
                        <div className="mt-3 space-y-3">
                          {item.label && (
                            <div className="flex">
                              <span className="text-sm font-medium text-gray-500 w-20">Label:</span>
                              <span className="text-sm text-gray-800">{item.label}</span>
                            </div>
                          )}

                          {item.value !== undefined && (
                            <div className="flex">
                              <span className="text-sm font-medium text-gray-500 w-20">Value:</span>
                              <span className="text-sm text-gray-800">{item.value}</span>
                            </div>
                          )}

                          {item.response && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-gray-500">Response:</span>
                              <div className="mt-1 text-sm text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-200">
                                {item.response}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
