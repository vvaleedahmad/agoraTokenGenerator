const express = require('express');
const bodyParser = require('body-parser');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

if (!appId || !appCertificate) {
  console.error("Environment variables AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set");
  process.exit(1);
}

app.post('/generate-token', (req, res) => {
  const { channelName, uid, role } = req.body;

  if (!channelName || uid == null || !role) {
    return res.status(400).json({ error: "channelName, uid, and role are required" });
  }
  const mappedRole = role.toLowerCase() === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
  const tokenExpirationInSeconds = 3600;
  const privilegeExpirationInSeconds = 3600;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      mappedRole,
      tokenExpirationInSeconds,
      privilegeExpirationInSeconds
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});