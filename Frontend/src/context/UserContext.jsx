import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import main from "../config/gemini";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const timeouts = useRef([]);
  const stopGeneratingRef = useRef(false);
  const [input, setinput] = useState("");
  const [recentPrompt, setrecentPrompt] = useState("");
  const [prevPrompts, setprevPrompts] = useState([]);
  const [showResult, setshowResult] = useState(false);
  const [loading, setloading] = useState(false);
  const [resultData, setresultData] = useState("");
  const [voiceGender, setVoiceGender] = useState("Female");
  
  const resetChat = () => {
    setresultData([]);
    setloading(false);
  };

  useEffect(() => {
  // Load history on mount
  const savedPrompts = JSON.parse(localStorage.getItem("userPromptHistory"));
  if (savedPrompts) {
    setprevPrompts(savedPrompts);
  }
}, []);

useEffect(() => {
  // Save history whenever prevPrompts changes
  localStorage.setItem("userPromptHistory", JSON.stringify(prevPrompts));
}, [prevPrompts]);


  const setStopGenerating = (value) => {
  stopGeneratingRef.current = value;
  if (value) {
    // Clear all pending timeouts
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }
};



  const delayPara = (index, nextWord) => {
  const timeoutId = setTimeout(() => {
    if (stopGeneratingRef.current) return;
    setresultData((prev) => prev + nextWord);
  }, 75 * index);

  timeouts.current.push(timeoutId);
};



  const onSent = async (prompt) => {
    setStopGenerating(false);
    setresultData("");
    setloading(true);
    setshowResult(true);
    const response = await main(input);
    let responseArray = response.split("**");
    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse +=
          "<b style='font-weight: 600;'>" + responseArray[i] + "</b>";
      }
    }

    let newResponse2 = newResponse.split("*").join("</br>");
    setrecentPrompt(input);
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }

    setrecentPrompt(input);
    setloading(false);
    setinput("");
    setprevPrompts((prev) => [
  ...prev,
  { text: input, timestamp: new Date().toISOString() },
]);

  };

  const serverUrl = "http://localhost:3000";
  const [userData, setuserData] = useState(null);
  const [frontendImage, setfrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const [selectedImage, setselectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setuserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials : true})
      return result.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    // Gemini + Prompt-related
    input,
    setinput,
    recentPrompt,
    setrecentPrompt,
    prevPrompts,
    setprevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
    setStopGenerating,
  stopGenerating: stopGeneratingRef.current,
    setStopGenerating,
    resetChat,
    voiceGender, setVoiceGender,

    // User & Image data
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    setfrontendImage,
    backendImage,
    setbackendImage,
    selectedImage,
    setselectedImage,
    getGeminiResponse,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
