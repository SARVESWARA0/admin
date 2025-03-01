'use client';
import { useState, useEffect } from 'react';
import Loader from './loader';
import PersonDetails from '../components/personalDetails';

export default function AdminPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    verifiedResponse: '',
    taskId: '',
    searchTerm: '',
  });

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

  useEffect(() => {
    // Apply filters whenever filters state changes
    let result = [...data];

    // Filter by verification status
    if (filters.verifiedResponse !== '') {
      result = result.filter(item => 
        String(item.fields.verifiedResponse) === filters.verifiedResponse
      );
    }

    // Filter by taskId
    if (filters.taskId !== '') {
      result = result.filter(item => 
        item.fields.taskId === filters.taskId
      );
    }

    // Filter by search term (across name, mail_id and github url)
    if (filters.searchTerm !== '') {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.fields.name && item.fields.name.toLowerCase().includes(term)) ||
        (item.fields.mail_id && item.fields.mail_id.toLowerCase().includes(term)) ||
        (item.fields['github url'] && item.fields['github url'].toLowerCase().includes(term))
      );
    }

    setFilteredData(result);
  }, [filters, data]);

  // Get unique taskIds for filter dropdown
  const uniqueTaskIds = [...new Set(data.map(item => item.fields.taskId))];

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle reset filters
  const resetFilters = () => {
    setFilters({
      verifiedResponse: '',
      taskId: '',
      searchTerm: '',
    });
  };

  // Handle view details
  const handleViewDetails = (recordId) => {
    const record = data.find(item => item.id === recordId);
    setSelectedRecord(record);
    setShowDetails(true);
  };

  // Handle back from details view
  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedRecord(null);
  };

  if (loading) return <Loader message="Loading data..." />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-2xl text-center">
        <div className="text-red-500 text-xl mb-6">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // If showing details, render the PersonDetails component
  if (showDetails) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <PersonDetails 
          record={selectedRecord} 
          onBack={handleBackFromDetails} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Manage and review records with ease
        </p>
      </header>
      
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-7xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Status
            </label>
            <select
              value={filters.verifiedResponse}
              onChange={(e) => handleFilterChange('verifiedResponse', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
            >
              <option value="">All Statuses</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task ID
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                placeholder="Search by name, email or GitHub URL..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-500">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Task ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  GitHub URL
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Video URL
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.fields.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.fields.mail_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded inline-block">{record.fields.taskId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={record.fields['github url']} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-indigo-600 hover:text-indigo-900 truncate max-w-xs inline-block hover:underline flex items-center gap-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        GitHub
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={record.fields.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-indigo-600 hover:text-indigo-900 truncate max-w-xs inline-block hover:underline flex items-center gap-1"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Video
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.fields.verifiedResponse === 'true' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.fields.verifiedResponse === 'true' ? 'Verified' : 'Not Verified'}
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
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
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
    </div>
  );
}
