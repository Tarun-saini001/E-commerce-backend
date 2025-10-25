import https from "https";

interface OneSignalSetup {
  apiKey: string;
}

interface OneSignalData {
  message: string;
  playerId: string[];
}

const notification = (data: Record<string, any>, setup: OneSignalSetup) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${setup.apiKey}`,
  };

  const options: https.RequestOptions = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers,
  };

  const req = https.request(options, (res) => {
    res.on("data", (chunk) => {
      try {
        const response = JSON.parse(chunk.toString());
        console.log("OneSignal response:", response);
      } catch (err) {
        console.error("Failed to parse OneSignal response:", err);
      }
    });
  });

  req.on("error", (error) => {
    console.error("OneSignal request error:", error);
  });

  req.write(JSON.stringify(data));
  req.end();
};

export const sendNotification = async (data: OneSignalData) => {
  const setup: OneSignalSetup = {
    apiKey: process.env.ONE_SIGNAL_API_KEY!,
  };

  const message = {
    app_id: process.env.ONE_SIGNAL_APP_ID!,
    contents: { en: data.message },
    include_player_ids: data.playerId,
  };

  notification(message, setup);
};
