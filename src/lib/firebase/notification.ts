import firebase from "config/firebase";
import logger from "config/logger";
import { TokenMessage } from "firebase-admin/lib/messaging/messaging-api";

export const sendNotification = async (
  token: string,
  notification: { title: string; body: string; image?: string }
) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid FCM token provided");
    }
    const message: TokenMessage = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      android: {
        notification: {
          sound: "default"
        },
        data: {
          title: notification.title,
          body: notification.body
        }
      },
      token: token
    };
    const response = await firebase.messaging().send(message);
    logger.info("Successfully sent notification: " + response);
  } catch (error) {
    logger.error("Error sending message: " + error.message);
    throw error;
  }
};
