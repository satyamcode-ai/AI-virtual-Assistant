import React, { useContext, useRef, useState } from "react";
import Card from "../components/card";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.gif";
import image3 from "../assets/image6.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image3.png";
import image7 from "../assets/image7.gif";
import { RiImageAddFill } from "react-icons/ri";
import { UserDataContext } from "../context/userContext";
import { Navigate, useNavigate } from "react-router-dom";

const Customize = () => {
  
  const navigate = useNavigate()
  const {
    serverUrl,
    userData,
    setuserData,
    frontendImage,
    setfrontendImage,
    backendImage,
    setbackendImage,
    selectedImage,
    setselectedImage,
  } = useContext(UserDataContext);
  const inputImage = useRef();
  const handleImage = (e) => {
    const file = e.target.files[0];
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-[100%] h-[100vh] bg-gradient-to-t from-[black] to-[#080864] flex flex-col justify-center items-center">
      <h1 className="text-white text-[30px] text-center mb-[30px]">
        Select your <span className="text-blue-200">Assistant Image</span>
      </h1>
      <div className="w-[full] max-w-[900px] gap-[15px] flex justify-center items-center flex-wrap">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-blue-950 border-2 border-[#08086afb] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer flex flex-col items-center justify-center ${
            selectedImage == "input"
              ? "border-2 border-amber-100 shadow-2xl shadow-blue-900"
              : null
          }`}
          onClick={() => {
            inputImage.current.click();
            setselectedImage("input");
          }}
        >
          {!frontendImage && (
            <RiImageAddFill className="text-white h-[25px] w-[25px]" />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
          name="assistantImage"
        />
      </div>
      {selectedImage && <button className="w-full max-w-[150px] h-[50px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg sm:text-xl rounded-full shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 mt-6 cursor-pointer" onClick={()=>navigate("/customize2")}>
        Next
      </button>}
      
    </div>
  );
};

export default Customize;
