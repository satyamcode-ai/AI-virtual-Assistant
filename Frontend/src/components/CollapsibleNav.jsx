import React, { useContext } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { RiMicAiLine, RiChatNewLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

const CornerSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { userData, serverUrl, setuserData,resetChat } = useContext(UserDataContext);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setuserData(null);
      navigate("/signin");
    } catch (error) {
      setuserData(null);
      console.log(error);
    }
  };

  // Reusable classes
  const menuItemClass = "flex items-center gap-2 text-amber-50 text-sm hover:text-amber-100 cursor-pointer transition text-[15px] mb-1";
  const sectionSpacing = "mb-10";
  const labelClass = "text-amber-50 text-sm hover:text-amber-100 cursor-pointer transition text-[16px] ";

  return (
    <div
      className={`fixed top-0 left-0 h-full z-40 flex flex-col justify-between p-4 shadow-lg transition-all duration-300 ease-in-out
        bg-gradient-to-t from-[#010105] to-[#07064b]
        ${isOpen ? "w-54" : "w-16"}`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-blue-950 transition"
        >
          {isOpen ? (
            <IoMdClose size={22} className="text-white" />
          ) : (
            <FiMenu size={22} className="text-white" />
          )}
        </button>
        
      </div>

      {/* Assistant Image */}
      {isOpen && (
        <div className={`flex flex-col items-center ${sectionSpacing}`}>
          <div className="h-20 w-20 rounded-full overflow-hidden">
            <img
              src={userData.assistantImage}
              alt="Assistant"
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className={labelClass}>Assistant Image</h1>
        </div>
      )}

      {/* Assistant Name */}
      {isOpen && (
        <div className={`flex flex-col items-center ${sectionSpacing}`}>
          <h1 className="text-transparent bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-md hover:text-pink-400 cursor-pointer transition">
            {userData.assistantName}
          </h1>
          <h1 className={labelClass}>Assistant Name</h1>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex flex-col gap-4 mt-2 flex-1">

        <div
          className={`${menuItemClass} justify-center gap-3 mr-2`}
          onClick={() => navigate("/voicemodel")}
        >
          <RiMicAiLine size={20} />
          {isOpen && <span>Switch to Speech Model</span>}
        </div>
        <div className={`${menuItemClass} ml-1`} onClick={() => navigate("/customize")}>
          <MdArrowBackIos size={20} />
          {isOpen && <span>Customize Again</span>}
        </div>

        <div className={`${menuItemClass} ml-0.5`} onClick={resetChat }>
          <RiChatNewLine size={20} />
          {isOpen && <span>New Chat</span>}
        </div>

        
      </div>

      {/* Logout */}
      <div className={`${menuItemClass} ml-2 mb-15`} onClick={handleLogOut}>
        <BiLogOut size={20} />
        {isOpen && <span>Logout</span>}
      </div>
    </div>
  );
};

export default CornerSidebar;
