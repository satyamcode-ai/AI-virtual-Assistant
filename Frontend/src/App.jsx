import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Customize from "./Pages/Customize.jsx";
import Customize2 from "./Pages/Customize2.jsx";
import Home from "./Pages/Home.jsx";
import History from "./components/History.jsx";
import { useContext } from "react";
import { UserDataContext } from "./context/UserContext.jsx";
import Voicemodel from "./Pages/Voicemodel.jsx";
import HistoryVoiceModel from "./components/HistoryVoiceModel.jsx";

const App = () => {
  const {userData,setuserData} = useContext(UserDataContext)
  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage && userData.assistantName)? <Home />:<Navigate to={"/customize"}/>} />
      <Route path="/voicemodel" element={(userData?.assistantImage && userData.assistantName)? <Voicemodel/>:<Navigate to={"/signin"}/>} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/signin" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/customize" element={userData ?<Customize />:<Navigate to="/signin" />} />
      <Route path="/customize2" element={userData ?<Customize2 />:<Navigate to="/signin" />} />
      <Route path="/history" element={<History/>} />
      <Route path="/history-voice-model" element={<HistoryVoiceModel/>} />
    </Routes>
  );
};

export default App;
