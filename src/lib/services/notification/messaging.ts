import logger from "config/logger";
import { sendNotification } from "lib/firebase/notification";
import { UserProfileNamespace } from "lib/profile/userProfile";
import User from "lib/users/models/user";
import { truncateMessage } from "lib/utils/messaging";

export class NotificationService {
  public static async sendNewMessageNotification({
    senderId,
    receiverId,
    message
  }: {
    senderId: string;
    receiverId: string;
    message: string;
  }) {
    try {
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!(receiver && sender)) {
        logger.error("Failed to send notification: Invalid sender and receiver");
        return;
      }

      const senderProfile = await UserProfileNamespace.getUserProfile({ userId: receiver.id });

      const receiverFcmToken = receiver.fcm_device_token;
      const messageTitle = `${senderProfile.first_name} ${senderProfile.last_name}`;
      const messageBody = truncateMessage(message);
      const senderProfilePicture = senderProfile.profile_picture;

      await sendNotification(receiverFcmToken, {
        title: messageTitle,
        body: messageBody,
        image: senderProfilePicture
      });
    } catch (error) {
      logger.error("Failed to send new message notification: " + error);
    }
  }

  public static async sendNewMessageInviteNotification({
    senderId,
    receiverId
  }: {
    senderId: string;
    receiverId: string;
  }) {
    try {
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!(receiver && sender)) {
        logger.error("Failed to send notification: Invalid sender and receiver");
        return;
      }

      const senderProfile = await UserProfileNamespace.getUserProfile({ userId: receiver.id });

      const receiverFcmToken = receiver.fcm_device_token;
      const messageTitle = `${senderProfile.first_name} ${senderProfile.last_name}`;
      const messageBody = `${senderProfile.first_name} ${senderProfile.last_name} sent you a message invite!`;
      const senderProfilePicture = senderProfile.profile_picture;

      await sendNotification(receiverFcmToken, {
        title: messageTitle,
        body: messageBody,
        image: senderProfilePicture
      });
    } catch (error) {
      logger.error("Failed to send new message notification: " + error);
    }
  }

  public static async sendMessageInviteAcceptedNotification({
    senderId,
    receiverId
  }: {
    senderId: string;
    receiverId: string;
  }) {
    try {
      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!(receiver && sender)) {
        logger.error("Failed to send notification: Invalid sender and receiver");
        return;
      }

      const senderProfile = await UserProfileNamespace.getUserProfile({ userId: receiver.id });

      const receiverFcmToken = receiver.fcm_device_token;
      const messageTitle = `${senderProfile.first_name} ${senderProfile.last_name}`;
      const messageBody = `${senderProfile.first_name} ${senderProfile.last_name} has accepted your message invite!`;
      const senderProfilePicture = senderProfile.profile_picture;

      await sendNotification(receiverFcmToken, {
        title: messageTitle,
        body: messageBody,
        image: senderProfilePicture
      });
    } catch (error) {
      logger.error("Failed to send new message notification: " + error);
    }
  }
}
