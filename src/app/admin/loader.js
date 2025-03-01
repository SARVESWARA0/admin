export default function Loader({ message = 'Loading...' }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="mt-6 text-center text-gray-700 font-medium">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  