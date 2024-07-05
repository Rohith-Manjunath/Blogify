import { FaExclamationCircle } from "react-icons/fa";

const NoData = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <FaExclamationCircle className="text-6xl text-indigo-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h2>
        <p className="text-gray-600">There are currently no data available.</p>
      </div>
    </div>
  );
};

export default NoData;
