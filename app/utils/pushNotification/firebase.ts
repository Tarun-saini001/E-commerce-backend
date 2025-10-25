import admin from "firebase-admin";

const secondApp =
  admin.apps.find((app) => app?.name === "secondApp") ||
  admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
      }),
    },
    "secondApp",
  );

interface NotificationPayload {
  title?: string;
  message?: string;
  pushType?: number | string;
  customData?: Record<string, any>;
}

export const sendNotification = async (
  payload: NotificationPayload,
  token: string,
) => {
  try {
    const messagePayload: admin.messaging.Message = {
      token,
      notification: {
        title: payload.title || "",
        body: payload.message || "",
      },
      data: {
        title: payload.title || "",
        body: payload.message || "",
        pushType: payload.pushType?.toString() || "1",
      },
    };

    const response = await secondApp.messaging().send(messagePayload);
    console.log(`Message sent successfully to ${token}:`, response);
  } catch (error) {
    console.error(`Failed to send message to ${token}:`, error);
  }
};

export const sendEach = async (
  payload: NotificationPayload,
  tokens: string[],
) => {
  try {
    const messages: admin.messaging.Message[] = tokens.map((token) => ({
      token,
      notification: {
        title: payload.title || "",
        body: payload.message || "",
      },
      data: {
        pushType: payload.pushType?.toString() || "1",
        customData: JSON.stringify(payload.customData || {}),
        timestamp: Date.now().toString(),
      },
      android: {
        priority: "high",
      },
      apns: {
        headers: {
          "apns-priority": "10",
        },
      },
    }));

    const response = await secondApp.messaging().sendEach(messages);

    response.responses.forEach((resp, index) => {
      if (resp.success) {
        console.log(`Message sent to ${tokens[index]}: ${resp.messageId}`);
      } else {
        console.error(
          `Failed to send message to ${tokens[index]}:`,
          resp.error,
        );
      }
    });
  } catch (error) {
    console.error("Error sending batch notifications:", error);
  }
};

export const sendEachToTopic = async (
  payload: NotificationPayload,
  tokens: string[],
  topic: string,
) => {
  try {
    await secondApp.messaging().subscribeToTopic(tokens, topic);

    const messagePayload: admin.messaging.Message = {
      topic,
      notification: {
        title: payload.title || "",
        body: payload.message || "",
      },
      data: {
        title: payload.title || "",
        body: payload.message || "",
        pushType: payload.pushType?.toString() || "1",
      },
    };

    const response = await secondApp.messaging().send(messagePayload);
    console.log(`Message sent successfully to topic '${topic}':`, response);
  } catch (error) {
    console.error(`Error sending notification to topic '${topic}':`, error);
  }
};
