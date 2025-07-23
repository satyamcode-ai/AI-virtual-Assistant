import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import VoicemodelSidebar from "../components/VoicemodelSidebar";
import loader from "../assets/user.gif";
import responseLoader from "../assets/ai.gif";

const Voicemodel = () => {
  const { userData, getGeminiResponse, voiceGender, setVoiceGender } =
    useContext(UserDataContext);
  const [isOpen, setIsOpen] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const recognitionRef = useRef(null);
  const location = useLocation();
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition API is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      console.log("Recognition already initialized.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const speak = (text) => {
      if (!text) return;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      const selectedVoice = voices.find((v) =>
        voiceGender === "male"
          ? v.name.toLowerCase().includes("female")
          : v.name.toLowerCase().includes("male")
      );
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onend = () => {
        console.log("Speech synthesis ended, restarting recognition...");
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        setIsCooldown(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    const handleCommand = (data) => {
      if (isCooldown) return;
      setIsCooldown(true);
      const { type, userInput, response } = data;
      speak(response);

      const query = encodeURIComponent(userInput || "");
      switch (type) {
        case "google_search":
          window.open(`https://www.google.com/search?q=${query}`, "_blank");
          break;
        case "youtube_search":
        case "youtube_play":
          window.open(
            `https://www.youtube.com/results?search_query=${query}`,
            "_blank"
          );
          break;
        case "calculator_open":
          window.open("https://www.google.com/search?q=calculator", "_blank");
          break;
        case "instagram_open":
          window.open("https://www.instagram.com/", "_blank");
          break;
        case "facebook_open":
          window.open("https://www.facebook.com/", "_blank");
          break;
        case "amazon_open":
          window.open(`https://www.amazon.com/s?k=${query}`, "_blank");
          break;
        case "flipkart_open":
          window.open(`https://www.flipkart.com/search?q=${query}`, "_blank");
          break;
        case "weather-show":
          window.open(
            `https://www.google.com/search?q=${query || "weather"}`,
            "_blank"
          );
          break;
        default:
          console.log("Unknown command type:", type);
      }
    };

    const callGeminiWithRetry = async (
      transcript,
      retries = 3,
      delay = 1000
    ) => {
      for (let i = 0; i < retries; i++) {
        try {
          setIsResponding(true);
          const result = await getGeminiResponse(transcript);
          setIsResponding(false);
          setAssistantResponse(result.response || "");
          return result;
        } catch (error) {
          if (
            i < retries - 1 &&
            error.message.includes("model is overloaded")
          ) {
            console.log(`Retrying Gemini call (${i + 1}/${retries})...`);
            await new Promise((res) => setTimeout(res, delay));
            delay *= 2;
          } else {
            setIsResponding(false);
            throw error;
          }
        }
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript;
      console.log("Transcript:", transcript);

      const existingHistory =
        JSON.parse(localStorage.getItem("voicePromptHistory")) || [];
      const newEntry = {
        text: transcript,
        timestamp: new Date().toISOString(),
      };
      existingHistory.push(newEntry);
      localStorage.setItem(
        "voicePromptHistory",
        JSON.stringify(existingHistory)
      );

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase()) &&
        !isCooldown
      ) {
        try {
          const data = await callGeminiWithRetry(transcript);
          if (data?.response) {
            handleCommand(data);
          }
        } catch (error) {
          console.error("Error getting Gemini response:", error);
          speak("Sorry, I could not process your request. Please try again.");
        }
      }
    };

    recognition.onstart = () => console.log("Recognition started.");
    recognition.onend = () => console.log("Recognition ended.");

    recognition.start();
  };

  useEffect(() => {
    if (location.pathname === "/voicemodel") {
      startRecognition();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020239] flex">
      <VoicemodelSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="transition-all duration-300 px-4 py-10 flex-1">
        <div className="text-xl lg:ml-320 ml-17 font-semibold text-transparent bg-gradient-to-r from-blue-500 to-pink-200 bg-clip-text cursor-pointer">
          Speech Model 4.0
        </div>
        <div className="flex justify-center items-center w-full lg:min-h-[calc(100vh-166px)] min-h-[calc(100vh-181px)] p-4 ">
          <div className="flex flex-col justify-center items-center lg:w-[20%] w-[73%]">
            <img
              src={userData.assistantImage}
              alt="Assistant"
              className="w-full lg:h-[290px] h-[240px] object-cover bg-blue-950 rounded-full overflow-hidden hover:shadow-xl hover:shadow-blue-900 cursor-pointer hover:border-2 hover:border-amber-100 ml-15 lg:ml-0"
            />

            <h1 className="mt-4 text-center text-xl font-semibold text-transparent bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text lg:ml-0 ml-15">
              {userData.assistantName}
            </h1>

            <div className="w-24 h-24 sm:w-28 sm:h-28 mt-4 ml-15 lg:ml-1">
              <img
                src={isResponding ? responseLoader : loader}
                alt={isResponding ? "Processing..." : "Listening..."}
                className="w-full h-full object-cover"
              />
            </div>
            {assistantResponse && (
              <p className="text-amber-50 text-center ml-15 lg:ml-0">
                {assistantResponse}
              </p>
            )}
          </div>
        </div>
        <br />
        <footer className="w-full text-center border-t border-gray-700 mt-4">
          <div className="lg:text-[13px] text-xs text-transparent bg-gradient-to-r from-blue-800 to-pink-400 bg-clip-text lg:ml-290 ml-13">
            © 2025 Speech Model 4.0 | All rights reserved
            <p className="block lg:hidden">
              Built with <span>❤️</span> by Satyam Singh
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Voicemodel;
