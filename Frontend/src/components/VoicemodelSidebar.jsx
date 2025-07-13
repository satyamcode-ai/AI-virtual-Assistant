import React, { useContext } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { TbSwitchHorizontal } from "react-icons/tb";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const VoicemodelSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { userData, serverUrl, setuserData,voiceGender,setVoiceGender} = useContext(UserDataContext);

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
  const menuItemClass =
    "flex items-center gap-2 text-amber-50 hover:text-amber-100 cursor-pointer transition text-[15px] mb-1";
  const labelClass =
    "text-amber-50 text-sm hover:text-amber-100 cursor-pointer transition text-[15px]";

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

      {/* Assistant Info */}
      {isOpen && (
        <div className="flex flex-col items-center mb-10">
          <h1 className={labelClass}>Assistant Name</h1>
          <h1 className="text-transparent bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-md hover:text-pink-400 cursor-pointer transition">
            {userData.assistantName}
          </h1>
        </div>
      )}

      {/* Voice Activation Info */}
      {isOpen && (
        <div className="flex flex-col text-center items-center mb-20">
          <h1 className={labelClass}>Say Assistant's Name to Activate..!</h1>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex flex-col gap-4 mt-2 flex-1">
        <div className={menuItemClass} onClick={() => navigate("/customize")}>
          <MdArrowBackIos size={20} />
          {isOpen && <span>Customize Again</span>}
        </div>

        <div className={menuItemClass} onClick={() => navigate("/")}>
          <IoDocumentTextOutline size={20} />
          {isOpen && <span>Switch to Text Model</span>}
        </div>

        <button
          className={menuItemClass}
          onClick={() =>
            setVoiceGender((prev) => (prev === "Female" ? "Male" : "Female"))
          }
        >
          <TbSwitchHorizontal size={20} />
          {isOpen && (
            <span>
               {voiceGender === "Female" ? "Male" : "Female"} Voice
            </span>
          )}
        </button>
      </div>

      <div className={`${menuItemClass} lg:mb-15 mb-18 ml-2`} onClick={handleLogOut}>
        <BiLogOut size={20} />
        {isOpen && <span>Logout</span>}
      </div>
    </div>
  );
};

export default VoicemodelSidebar;
