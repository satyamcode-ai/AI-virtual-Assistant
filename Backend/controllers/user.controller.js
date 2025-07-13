import { json } from "express";
import uploadOnCloudinary from "../config/cloudinary.js";
import { geminiResponse } from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment/moment.js";

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get Current User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE ASSISTANT
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      if (!uploadedImage || !uploadedImage.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      assistantImage = uploadedImage.secure_url;
    } else {
      assistantImage = imageUrl;
    }
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Update the user
    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.error("Update Assistant Error:", error);
    return res.status(500).json({ message: "Failed to update assistant" });
  }
};

function removeSymbols(str) {
  if (!str) return "";
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
}

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Fetch user details
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    // Get Gemini response
    const response = await geminiResponse(command, assistantName, userName);

    // Extract JSON safely
    const jsonMatch = response.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry I cannot understand" });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(400).json({ response: "Sorry I cannot understand" });
    }

    const type = gemResult.type;
    const userInput = gemResult.userinput;

    // Switch for structured commands with cleaned response
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: removeSymbols(userInput),
          response: removeSymbols(`Current date is ${moment().format("YYYY MM DD")}`),
        });
      case "get_time":
        return res.json({
          type,
          userInput: removeSymbols(userInput),
          response: removeSymbols(`Current time is ${moment().format("hh mm A")}`),
        });
      case "get_day":
        return res.json({
          type,
          userInput: removeSymbols(userInput),
          response: removeSymbols(`Today is ${moment().format("dddd")}`),
        });
      case "get_month":
        return res.json({
          type,
          userInput: removeSymbols(userInput),
          response: removeSymbols(`The current month is ${moment().format("MMMM")}`),
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather-show":
      case "amazon_open":
      case "flipkart_open":
        return res.json({
          type,
          userInput: removeSymbols(userInput),
          response: removeSymbols(gemResult.response),
        });

      default:
        return res.status(400).json({ response: "Sorry I did not understand that command" });
    }
  } catch (error) {
    console.error("Ask assistant error:", error);
    return res.status(500).json({ response: "Ask assistant error" });
  }
};
