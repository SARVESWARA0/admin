'use client';
import { useState, useEffect } from 'react';
import Loader from './loader';
import PersonDetails from '../components/personalDetails';

// AlertCard component for showing alerts in a card style
const AlertCard = ({ type, message, onClose }) => {
  // Define color classes based on alert type
  const colors = {
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      border: 'border-yellow-500 dark:border-yellow-700',
      text: 'text-yellow-900 dark:text-yellow-100',
      icon: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      border: 'border-blue-500 dark:border-blue-700',
      text: 'text-blue-900 dark:text-blue-100',
      icon: 'text-blue-600'
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900',
      border: 'border-amber-500 dark:border-amber-700',
      text: 'text-amber-900 dark:text-amber-100',
      icon: 'text-amber-600'
    },
    success: {
      bg: 'bg-green-100 dark:bg-green-900',
      border: 'border-green-500 dark:border-green-700',
      text: 'text-green-900 dark:text-green-100',
      icon: 'text-green-600'
    }
  };

  const color = colors[type] || colors.info;

  return (
    <div 
      role="alert" 
      className={`${color.bg} ${color.border} ${color.text} border-l-4 p-2 rounded-lg flex items-center shadow-lg transition transform hover:scale-105`}
    >
      <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" 
           className={`h-5 w-5 flex-shrink-0 mr-2 ${color.icon}`}
           xmlns="http://www.w3.org/2000/svg">
        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <p className="text-xs font-semibold flex-grow">{message}</p>
      <button onClick={onClose} className="ml-2 text-xs font-bold focus:outline-none">
        &times;
      </button>
    </div>
  );
};

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('records');
  const [alert, setAlert] = useState(null);

  // Updated filters state to include stage filter
  const [filters, setFilters] = useState({
    verifiedResponse: '',
    taskId: '',
    searchTerm: '',
    stage: '',
  });
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/fetchAllRecords');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);

        // Process data for the leaderboard (only Stage-4 candidates)
        const processedLeaderboard = processLeaderboardData(result);
        setLeaderboardData(processedLeaderboard);

        // Store the data in localStorage as a backup
        localStorage.setItem("adminData", JSON.stringify(result));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Process leaderboard data – only including candidates with Stage-4 status
  const processLeaderboardData = (records) => {
    const validRecords = records.filter(record => 
      record.fields.status &&
      record.fields.status.toLowerCase() === 'stage-4'
    );
    const processedRecords = validRecords.map(record => {
      let finalAnalysis = record.fields.finalAnalysis;
      if (typeof finalAnalysis === 'string') {
        try {
          finalAnalysis = JSON.parse(finalAnalysis);
        } catch (e) {
          finalAnalysis = { rating: 0, isRelevantTask: false };
        }
      }
      return {
        id: record.id,
        name: record.fields.name || 'Unknown',
        email: record.fields.email || 'No email',
        taskId: record.fields.taskId || 'N/A',
        rating: finalAnalysis.rating || 0,
        status: record.fields.status || 'N/A',
      };
    });
    return processedRecords.sort((a, b) => b.rating - a.rating);
  };

  useEffect(() => {
    // Apply filters whenever filters state changes
    let result = [...data];

    if (filters.verifiedResponse !== '') {
      result = result.filter(item => {
        let finalAnalysis;
        try {
          finalAnalysis = JSON.parse(item.fields.finalAnalysis);
        } catch (e) {
          finalAnalysis = { isRelevantTask: false };
        }
        return finalAnalysis.isRelevantTask === (filters.verifiedResponse === 'true');
      });
    }

    if (filters.taskId !== '') {
      result = result.filter(item => item.fields.taskId === filters.taskId);
    }

    if (filters.stage !== '') {
      result = result.filter(item => {
        const status = item.fields.status || '';
        return status.toLowerCase() === filters.stage.toLowerCase();
      });
    }

    if (filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.trim().toLowerCase();
      result = result.filter(item => {
        const name = item.fields.name || "";
        const email = item.fields.email || "";
        return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
      });
    }
    setFilteredData(result);
  }, [filters, data]);

  const uniqueTaskIds = [...new Set(data.map(item => item.fields.taskId))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      verifiedResponse: '',
      taskId: '',
      searchTerm: '',
      stage: '',
    });
  };

  // Updated handleViewDetails now uses the floating AlertCard
  const handleViewDetails = (recordId) => {
    const record = data.find(item => item.id === recordId);
    if (record) {
      const status = record.fields.status;
      if (status === 'Stage-1') {
        setAlert({
          type: 'warning',
          message: 'Submission Pending – Kindly complete your form.',
        });
        return;
      } else if (status === 'Stage-2') {
        setAlert({
          type: 'info',
          message: 'Quiz In Progress – Please wait for further instructions.',
        });
        return;
      } else if (status === 'Stage-3') {
        setAlert({
          type: 'amber',
          message: 'Analysis Underway – Your submission is being reviewed.',
        });
        return;
      } else if (status === 'Stage-4') {
        // Clear any alert and show details
        setAlert(null);
        setSelectedRecord(record);
        setShowDetails(true);
      }
    }
  };

  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedRecord(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Helper to style the status badge (unchanged)
  const getStatusStyles = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const lower = status.toLowerCase();
    if (lower === 'analyzed') {
      return 'bg-blue-100 text-blue-800';
    } else if (lower === 'submitted') {
      return 'bg-green-100 text-green-800';
    } else if (lower === 'not submitted') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loader message="Loading data..." />;

  if (showDetails) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <PersonDetails record={selectedRecord} onBack={handleBackFromDetails} />
      </div>
    );
  }

  // Enhanced Filters section with a new Stage filter
  const renderFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task Relevancy</label>
        <select
          value={filters.verifiedResponse}
          onChange={(e) => handleFilterChange('verifiedResponse', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
        >
          <option value="">All</option>
          <option value="true">Relevant task</option>
          <option value="false">Irrelevant task</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Task ID</label>
        <select
          value={filters.taskId}
          onChange={(e) => handleFilterChange('taskId', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
        >
          <option value="">All Tasks</option>
          {uniqueTaskIds.map(taskId => (
            <option key={taskId} value={taskId}>{taskId}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
        <select
          value={filters.stage}
          onChange={(e) => handleFilterChange('stage', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
        >
          <option value="">All Stages</option>
          <option value="Stage-1">Stage-1</option>
          <option value="Stage-2">Stage-2</option>
          <option value="Stage-3">Stage-3</option>
          <option value="Stage-4">Stage-4</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div className="relative">
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
            placeholder="Search by name or email"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Records table
  const renderRecordsTable = () => {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        {/* Record summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600 text-sm">
            Showing <span className="font-semibold text-gray-800">{filteredData.length}</span> of <span className="font-semibold text-gray-800">{data.length}</span> records
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>

        {/* Filters */}
        {renderFilters()}

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Task ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">GitHub URL</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Video URL</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map(record => {
                  const status = record.fields.status ? record.fields.status.toLowerCase() : '';
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.fields.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.fields.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                          {record.fields.taskId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {status === 'not sumbitted' ? (
                          <span className="text-sm text-gray-500">N/A</span>
                        ) : (
                          <a 
                            href={record.fields.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                          >
                            GitHub
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {status === 'not sumbitted' ? (
                          <span className="text-sm text-gray-500">N/A</span>
                        ) : (
                          <a 
                            href={record.fields.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                          >
                            Video
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(record.fields.status)}`}>
                          {record.fields.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetails(record.id)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-150"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg">No records found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Leaderboard (unchanged styling aside from enhanced UI)
  const renderLeaderboard = () => {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Performance Leaderboard</h2>
          <button 
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            onClick={() => {/* export functionality */}}
          >
            Export Data
          </button>
        </div>
        {leaderboardData.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No ratings available</h3>
            <p className="mt-1 text-gray-500">We couldn&apos;t find any finalAnalysis ratings in the records.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <span className={`flex items-center justify-center h-6 w-6 rounded-full text-white text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                          }`}>
                            {index + 1}
                          </span>
                        ) : (
                          <span className="text-gray-500">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                      <div className="text-sm text-gray-500">{entry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">{entry.taskId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(entry.status)}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${(entry.rating/5) * 100}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                          {entry.rating}/5
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(entry.id)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-150 inline-flex items-center gap-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {leaderboardData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-xl font-bold">Average Rating</h3>
              <p className="text-3xl font-bold mt-2">
                {(leaderboardData.reduce((acc, item) => acc + item.rating, 0) / leaderboardData.length).toFixed(1)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-xl font-bold">Top Rating</h3>
              <p className="text-3xl font-bold mt-2">
                {leaderboardData.length > 0 ? leaderboardData[0].rating : 'N/A'}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-xl font-bold">Analysed Entries</h3>
              <p className="text-3xl font-bold mt-2">
                {leaderboardData.filter(item => item.status.toLowerCase() === 'analysed').length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white shadow-md">
              <h3 className="text-xl font-bold">Total Rated</h3>
              <p className="text-3xl font-bold mt-2">
                {leaderboardData.length}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white p-6 relative">
      {/* Floating Alert (top-right corner) */}
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <AlertCard 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert(null)} 
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage and review records with ease</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total candidates</p>
              <p className="text-2xl font-bold text-gray-800">{data.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Relevant task</p>
              <p className="text-2xl font-bold text-gray-800">
                {data.filter(item => {
                  let finalAnalysis;
                  try {
                    finalAnalysis = JSON.parse(item.fields.finalAnalysis);
                  } catch (e) {
                    finalAnalysis = { isRelevantTask: false };
                  }
                  return finalAnalysis.isRelevantTask;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {data.filter(item => {
                  const status = item.fields.status;
                  return status === 'Stage-1' || status === 'Stage-2' || status === 'Stage-3';
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{uniqueTaskIds.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('records')}
              className={`${
                activeTab === 'records'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Records
            </button>
            <button
              onClick={() => handleTabChange('leaderboard')}
              className={`${
                activeTab === 'leaderboard'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Leaderboard
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-12">
        {activeTab === 'records' ? renderRecordsTable() : renderLeaderboard()}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
        <p className="mt-1">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Version 1.0.0</span>
        </p>
      </footer>
    </div>
  );
}
