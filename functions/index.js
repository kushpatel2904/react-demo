// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Environment variables
// set via: firebase functions:config:set whatsapp.token="YOUR_TOKEN" whatsapp.phone_id="PHONE_NUMBER_ID"
const WHATSAPP_TOKEN = functions.config().whatsapp.token;
const PHONE_NUMBER_ID = functions.config().whatsapp.phone_id;

// API route: send WhatsApp messages
exports.sendWhatsAppMessage = functions.https.onRequest(async (req, res) => {
  try {
    const { customers, message } = req.body; 
    // customers = [{ name, mobile }]

    if (!customers || !message) {
      return res.status(400).json({ error: "Missing customers or message" });
    }

    // Loop through customers and send message
    const results = [];

    for (const c of customers) {
      const phone = c.mobile.replace(/\D/g, ""); // remove any non-digit chars
      const body = {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      };

      try {
        const response = await axios.post(
          `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
          body,
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        results.push({ customer: c.name, status: "sent", response: response.data });
      } catch (err) {
        results.push({ customer: c.name, status: "error", error: err.response?.data || err.message });
      }
    }

    return res.json({ success: true, results });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
