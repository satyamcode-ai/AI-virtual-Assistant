import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/userContext";
import CornerSidebar from "../components/CollapsibleNav";
import { FaLightbulb, FaComments, FaCode, FaCompass } from "react-icons/fa";
import { IoSendSharp, IoStopCircleSharp } from "react-icons/io5"; // Send & Stop Icons

const prompts = [
  {
    text: "Suggest some beautiful places to see on an upcoming road trip",
    icon: <FaCompass />,
  },
  {
    text: "Briefly summarize this concept : urban planning",
    icon: <FaLightbulb />,
  },
  {
    text: "Brainstorm team bonding activities for our work retreat",
    icon: <FaComments />,
  },
  { text: "Improve readability of the following code", icon: <FaCode /> },
];

const Home = () => {
  const {
    userData,
    setinput,
    onSent,
    input,
    showResult,
    loading,
    resultData,
    setStopGenerating,
  } = useContext(UserDataContext);

  const [isOpen, setIsOpen] = useState(true);


  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#050542] flex">
      {/* Sidebar */}
      <CornerSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <main
  className={`transition-all duration-300 px-4 py-10 flex-1 ${
    isOpen ? "ml-0 sm:ml-[13.5rem]" : "lg:ml-10 ml-16"
  }`}
>

        <div className="text-[21px] lg:ml-14 ml-2 font-semibold text-transparent bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text">
          Text Model 4.0
        </div>

        <div className="max-w-6xl mx-auto flex flex-col justify-between min-h-[calc(100vh-7rem)]">
          {/* Top Section */}
          <div className="flex-1">
            {!showResult ? (
              <>
                {/* Greeting Section */}
                <section className="mb-12 mt-20">
                  <h1 className="text-4xl lg:text-6xl font-bold mb-5 ml-2 lg:ml-19">
                    <span className="bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
                      Hello, {userData?.name || "Satyam"}.
                    </span>
                  </h1>
                  <p className="text-3xl lg:text-5xl tracking-wide text-gray-300 font-medium ml-2 lg:ml-19">
                    How can I help you Today?
                  </p>
                </section>

                {/* Prompt Cards */}
                <section className="flex flex-wrap justify-center gap-6 mb-10">
                  {prompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between bg-white/10 backdrop-blur-md text-white p-6 rounded-xl shadow-lg 
                      min-h-[180px] w-full sm:w-[48%] lg:w-[20%] hover:scale-[1.02] transition-all duration-300"
                    >
                      <p className="text-left text-md">{prompt.text}</p>
                      <span className="text-xl bg-white/20 text-white p-2 rounded-full self-end mt-4">
                        {prompt.icon}
                      </span>
                    </div>
                  ))}
                </section>
              </>
            ) : (
              // Response output
              <div className="mt-10 text-white">
                {loading ? (
                  <p className="text-blue-400 animate-pulse text-lg">
                    Generating response...
                  </p>
                ) : (
                  <div
                    className="bg-white/5 p-6 rounded-xl whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: resultData }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Input Section at Bottom */}
          <div className="mt-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center bg-white/10 rounded-xl p-3 backdrop-blur-md text-white lg:ml-4">
                <input
                  onChange={(e) => setinput(e.target.value)}
                  value={input}
                  type="text"
                  placeholder="Enter a prompt here..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      onSent();
                    }
                  }}
                  className="flex-1 bg-transparent outline-none px-3 text-white placeholder-gray-400"
                />

                {loading ? (
                  <button
                    onClick={() => setStopGenerating(true)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Stop generating"
                  >
                    <IoStopCircleSharp size={26} />
                  </button>
                ) : (
                  <button
                    onClick={onSent}
                    className="text-white hover:text-blue-400 transition-colors"
                    title="Send prompt"
                  >
                    <IoSendSharp size={24} />
                  </button>
                )}
              </div>
              <p className="text-xs lg:text-sm text-gray-300 mt-2 text-center">
                Try asking anything about tech, travel, or code.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
