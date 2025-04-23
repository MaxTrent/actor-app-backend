import { Request } from "express";
import { UserProfileNamespace } from "lib/profile/userProfile";
import { CHAT_EVENTS } from "./events";

export class SocketService {
  static emitSocketEvent(req: Request, roomId: string, event: string, payload: any) {
    req.app.get("io").in(roomId).emit(event, payload);
  }

  static async sendMessageInviteNotification(req: Request, userId: string, invitedUser: string) {
    const { first_name, last_name } = await UserProfileNamespace.getUserProfile({ userId });
    const notificationMessage = `New message invite from ${last_name} ${first_name}`;
    SocketService.emitSocketEvent(req, invitedUser, CHAT_EVENTS.NEW_MESSAGE_INVITE, {
      userId: invitedUser,
      message: notificationMessage
    });
  }

  static async sendNewMessage(req: Request, receiverId: string, payload: { message: any }) {
    const { message } = payload;
    SocketService.emitSocketEvent(req, receiverId, CHAT_EVENTS.NEW_MESSAGE, {
      message
    });
  }
}
