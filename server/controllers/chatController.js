import dotenv from "dotenv";

import { streamChatCompletion } from "../services/geminiService.js";

dotenv.config();

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const completion = await streamChatCompletion({ message });

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of completion) {
      const content = chunk.choices?.[0]?.delta?.content || "";
      res.write(content);
    }

    res.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
