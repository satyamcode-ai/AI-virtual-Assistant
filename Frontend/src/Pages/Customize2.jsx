import React, { useContext } from "react";
import { useState } from "react";
import { UserDataContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {

  const navigate = useNavigate()
  const { userData, backendImage, selectedImage, serverUrl, setuserData } =
    useContext(UserDataContext);

  const [assistantName, setassistantName] = useState(
    userData?.assistantName || ""
  );
  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("backendImage", backendImage);
      console.log("selectedImage", selectedImage);
      console.log(result.data);
      setuserData(result.data);
    } catch (error) {
      console.log("Update Assistant Error:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#080864] flex flex-col justify-center items-center px-4 py-10">
      <h1 className="text-white text-2xl sm:text-3xl text-center mb-6 font-semibold">
        Assign a Name to Your <br className="block sm:hidden" />
        <span className="text-blue-200">Digital Buddy</span>
      </h1>

      <input
        type="text"
        placeholder="Example: ZARA"
        className="w-full max-w-[400px] h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-400 px-5 py-3 rounded-full text-lg transition-all focus:ring-2 focus:ring-blue-500"
        required
        onChange={(e) => setassistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className="w-full max-w-[400px] h-[50px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg sm:text-xl rounded-full shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 mt-6 cursor-pointer"
          onClick={() => {handleUpdateAssistant(), navigate("/")}}
          
        >
          🚀 Launch Assistant
        </button>
      )}
      <br />
      <br />
      <br />
    </div>
  );
};

export default Customize2;
