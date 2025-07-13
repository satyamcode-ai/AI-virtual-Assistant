import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const Card = ({ image }) => {
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
  return (
    <div
      className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-blue-950 border-2 border-[#08086afb] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-2 hover:border-amber-100 ${
        selectedImage == image? "border-2 border-amber-100 shadow-2xl shadow-blue-900 "
        : null
      }`}
      onClick={() =>{setselectedImage(image)
        setbackendImage(null)
        setfrontendImage(null)
      } }
    >
      <img src={image} className="h-full object-cover" />
    </div>
  );
};

export default Card;
