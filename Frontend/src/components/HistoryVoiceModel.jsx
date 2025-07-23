import React, { useEffect, useState } from "react";
import { MdHistory } from "react-icons/md";

const HistoryVoiceModel = () => {
  const [voiceHistory, setVoiceHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("voicePromptHistory")) || [];
    setVoiceHistory(savedHistory);
  }, []);

  const handleDelete = (indexToDelete) => {
    const updated = voiceHistory.filter((_, index) => index !== indexToDelete);
    setVoiceHistory(updated);
    localStorage.setItem("voicePromptHistory", JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    localStorage.removeItem("voicePromptHistory");
    setVoiceHistory([]);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-[#010105] to-[#07064b] p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-around lg:gap-190 sm:items-center mb-6 gap-4">
        <h1 className="flex items-center gap-2 text-xl text-amber-50">
          <MdHistory size={30} /> History [ Speech Model ]
        </h1>
        <button
          onClick={clearAllHistory}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition cursor-pointer"
        >
          Clear All History
        </button>
      </div>

      {voiceHistory.length === 0 ? (
        <p className="text-amber-50 text-center mt-20 text-lg sm:text-xl">
          No voice history available yet.
        </p>
      ) : (
        <ul className="space-y-3 max-h-[80vh] overflow-y-auto lg:w-[90%] lg:pr-2 lg:ml-20 overflow-hidden">
          {voiceHistory
            .slice()
            .reverse()
            .map((item, index) => (
              <li
                key={index}
                className="relative bg-[#0a0a2a] p-4 rounded text-amber-50 hover:bg-[#151546] transition"
              >
                <p className="break-words text-sm sm:text-base">{item.text}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(item.timestamp)}</p>
                <button
                  onClick={() => handleDelete(voiceHistory.length - 1 - index)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-s px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer mt-3"
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

export default HistoryVoiceModel;
