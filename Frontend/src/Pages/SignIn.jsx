import React, { useState, useContext } from "react";
import axios from "axios";
import authBg from "../assets/authBg.png"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/userContext";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl,userData, setuserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("")
  const [loading, setloading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault();
    seterror("")
    setloading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setloading(false)
      setuserData(result.data)
      navigate("/")
    } catch (error) {
      console.log(error);
      setuserData(null)
      setloading(false)
      seterror(error.response.data.message)
    }
  };

  return (
  <div
    className="w-full min-h-screen bg-cover flex justify-center items-center px-4"
    style={{ backgroundImage: `url(${authBg})` }}
  >
    <form
      className="w-full max-w-[500px] lg:h-[580px] h-[440px] bg-[#00000045] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center lg:gap-5 gap-4 p-6"
      onSubmit={handleSignIn}
    >
      <h1 className="text-white text-2xl md:text-3xl font-semibold mb-6 text-center">
        <span className="text-blue-400">Sign In to </span>Virtual Assistant
      </h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full h-[50px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-4 rounded-full text-base md:text-lg"
        required
        onChange={(e) => setemail(e.target.value)}
        value={email}
      />

      <div className="w-full h-[50px] border-2 border-white bg-transparent text-white rounded-full relative text-base md:text-lg">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-4"
          required
          onChange={(e) => setpassword(e.target.value)}
          value={password}
        />
        {showPassword ? (
          <FaEyeSlash
            className="absolute top-3.5 right-5 w-6 h-6 cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <FaEye
            className="absolute top-3.5 right-5 w-6 h-6 cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>

      {error.length > 0 && (
        <p className="text-red-500 text-sm md:text-base">*{error}</p>
      )}

      <button
        className="w-full lg:max-w-[200px] lg:h-[45px]  h-[40px] max-w-[150px] bg-white rounded-full text-blue-600 font-semibold text-base md:text-lg mt-4  hover:text-blue-800 transition cursor-pointer"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign In"}
      </button>

      <p
        className="text-white text-sm md:text-base lg:mt-3 mt-1 text-center cursor-pointer"
        onClick={() => navigate("/signup")}
      >
        Want to create a new account?{" "}
        <span className="text-blue-400 font-semibold hover:text-blue-500">
          Sign Up
        </span>
      </p>
    </form>
  </div>
);

};

export default SignIn;
