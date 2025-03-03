
"use client";


export default function PersonDetails({ record, onBack }) {
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
    );
  }

  // Parse the finalAnalysis string to a JavaScript object
  const finalAnalysis = record.fields.finalAnalysis ? 
    JSON.parse(record.fields.finalAnalysis) : null;
    
  // Star Rating component
  const StarRating = ({ rating, maxRating = 5 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="ml-2 text-sm text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Record Details</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-sm text-gray-900">{record.fields.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{record.fields.mail_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Task ID</h3>
              <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                {record.fields.taskId}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
              <span
                className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  record.fields.verifiedResponse === "true"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {record.fields.verifiedResponse === "true" ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Links & Resources */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Links & Resources</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">GitHub URL</h3>
              <a
                href={record.fields["github url"]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-indigo-600 hover:text-indigo-900 block hover:underline truncate"
              >
                {record.fields["github url"]}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Video URL</h3>
              <a
                href={record.fields.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-indigo-600 hover:text-indigo-900 block hover:underline truncate"
              >
                {record.fields.video_url}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Final Analysis Section - Moved to the top below basic details */}
      {finalAnalysis && (
        <div className="mt-8 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">Final Analysis</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Summary Card */}
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="text-md font-medium text-gray-700 mb-2">Summary</h3>
              <p className="text-sm text-gray-800 leading-relaxed">{finalAnalysis.summary}</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             
              
             
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Score</h3>
                <span className="text-lg font-semibold text-gray-900">
                  {parseFloat(finalAnalysis.score).toFixed(1)} / 5
                </span>
              </div>

              {/* Rating */}
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
                <StarRating rating={parseFloat(finalAnalysis.rating)} />
              </div>
              
              {/* Project Functionality */}
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Project Functionality</h3>
                <p className="text-sm text-gray-900 font-medium">{finalAnalysis.projectFunctionality}</p>
              </div>
              
              {/* Completion Status */}
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Completion Status</h3>
                <div className="flex flex-col">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${finalAnalysis.completionStatus}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 font-medium">{finalAnalysis.completionStatus}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {/* System Prompt */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Prompt</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.fields.system_prompt}</p>
          </div>
        </div>

        {/* Code Analysis Report */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Code Analysis Report</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.fields.codeAnalysisReport}</p>
          </div>
        </div>

        {/* Screen Record Analysis */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Screen Record Analysis</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{record.fields.screenRecordAnalysis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}