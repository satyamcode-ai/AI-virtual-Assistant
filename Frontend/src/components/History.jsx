import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { MdHistory } from "react-icons/md";

const History = () => {
  const { prevPrompts, setprevPrompts } = useContext(UserDataContext);

  const handleDelete = (indexToDelete) => {
    const updatedPrompts = prevPrompts.filter((_, index) => index !== indexToDelete);
    setprevPrompts(updatedPrompts);
    localStorage.setItem("userPromptHistory", JSON.stringify(updatedPrompts));
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // local date and time
  };

  const clearAllHistory = () => {
    localStorage.removeItem("userPromptHistory");
    setprevPrompts([]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-[#010105] to-[#07064b] p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-around lg:gap-190 sm:items-center mb-6">
        <h1 className="flex items-center gap-2 text-xl text-amber-50">
          <MdHistory size={30} /> History [ Text Model ]
        </h1>
        <button
          onClick={clearAllHistory}
          className="lg:px-4 lg:py-2 mt-5 lg:mt-0 py-2  bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition cursor-pointer"
        >
          Clear All History
        </button>
      </div>

      {prevPrompts.length === 0 ? (
        <p className="text-amber-50 text-center mt-20 text-lg sm:text-xl">
          No history available yet.
        </p>
      ) : (
        <ul className="space-y-3 max-h-[80vh] overflow-y-auto lg:w-[90%] lg:pr-2 lg:ml-20">
          {prevPrompts
            .slice()
            .reverse()
            .map((item, index) => (
              <li
                key={index}
                className="relative bg-[#0a0a2a] p-4 rounded text-amber-50 hover:bg-[#151546] transition"
              >
                <p className="break-words lg:text-[17px] sm:text-base">{item.text}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(item.timestamp)}</p>
                <button
                  onClick={() => handleDelete(prevPrompts.length - 1 - index)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-s px-3 py-1 rounded hover:bg-red-600 transition mt-3 cursor-pointer"
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default History;
