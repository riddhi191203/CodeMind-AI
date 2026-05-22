import axios from "axios";

export const runCode = async (
  req,
  res
) => {
  try {

    const {
      code,
      language,
    } = req.body;

    const languageMap = {
      javascript: "nodejs",
      python: "python3",
      java: "java",
      cpp: "cpp17",
      c: "c",
      go: "go",
      rust: "rust",
      php: "php",
    };

    const jdoodleLanguage =
      languageMap[
        language
      ] || "nodejs";

    const response =
      await axios.post(
        "https://api.jdoodle.com/v1/execute",
        {
          clientId:
            process.env
              .JDOODLE_CLIENT_ID,

          clientSecret:
            process.env
              .JDOODLE_CLIENT_SECRET,

          script: code,

          language:
            jdoodleLanguage,

          versionIndex: "0",
        }
      );

    return res.status(200).json({
      success: true,
      output:
        response.data.output,
      memory:
        response.data.memory,
      cpuTime:
        response.data.cpuTime,
    });

  } catch (error) {

    console.log(error.response?.data);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data ||
        error.message,
    });
  }
};