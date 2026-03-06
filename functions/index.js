const functions = require("firebase-functions");
const axios = require("axios");

exports.fabricAI = functions.https.onRequest(async (req, res) => {

  const userMessage = req.body.message;

  const systemPrompt = `
You are a professional fabric advisor.

Suggest best fabrics for:
• summer
• winter
• wedding
• office wear

Answer in short bullet points.
`;

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-120b:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: "Bearer YOUR_OPENROUTER_API_KEY",
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }

});