const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

app.post("/send-whatsapp", async (req, res) => {
  const { mobiles, message } = req.body;

  if (!mobiles || mobiles.length === 0) {
    return res.status(400).json({ error: "No customers selected" });
  }

  try {
    for (const mobile of mobiles) {
      await client.messages.create({
        from: "whatsapp:+14155238886", // Twilio WhatsApp number
        to: `whatsapp:+91${mobile}`,
        body: message,
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () =>
  console.log("WhatsApp API running on port 5000")
);
