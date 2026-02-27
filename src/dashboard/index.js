import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const twilio = require("twilio");

exports.sendWhatsApp = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { mobiles, message } = req.body;

    if (!mobiles || mobiles.length === 0) {
      return res.status(400).json({ error: "No customers selected" });
    }

    const client = twilio(
      functions.config().twilio.sid,
      functions.config().twilio.auth
    );

    try {
      for (const mobile of mobiles) {
        await client.messages.create({
          from: "whatsapp:+14155238886", // Twilio sandbox
          to: `whatsapp:+91${mobile}`,
          body: message,
        });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  });
});

