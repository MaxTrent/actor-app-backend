import { Request, Response, NextFunction, Router } from "express";
import { MessagingNamespace } from "lib/messaging/messaging";
import { MessageInviteStatus } from "lib/messaging/models/messageInvite";
import { NotificationService } from "lib/services/notification/messaging";
import { SocketService } from "lib/services/socket";
import { handleControllerError } from "lib/utils/error";
import { pick } from "lib/utils/pick";
import ResponseNamespace from "lib/utils/responses_namespace";
import { auth } from "middlewares/auth";
import { validate } from "middlewares/validate";
import { messagingValidation } from "validations";

class MessagingController {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  public async sendMessageInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { invitedUserId, message } = req.body;

      await MessagingNamespace.sendMessageInvite(userId, invitedUserId, message);
      SocketService.sendMessageInviteNotification(req, userId, invitedUserId);
      await NotificationService.sendNewMessageInviteNotification({
        senderId: userId,
        receiverId: invitedUserId
      });
      return ResponseNamespace.sendSuccessMessage(res, null, 201, "Message invite sent!");
    } catch (error) {
      console.log("Error sending message invite: ", error);
      handleControllerError(error, "Error sending messaging invite", next);
    }
  }

  public async acceptMessageInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { invitingUserId } = req.body;

      await MessagingNamespace.acceptMessageInvite(userId, invitingUserId);
      await NotificationService.sendMessageInviteAcceptedNotification({
        senderId: userId,
        receiverId: invitingUserId
      });
      return ResponseNamespace.sendSuccessMessage(res, null, 200, "Message invite accepted!");
    } catch (error) {
      console.log("Error accepting message invite: ", error);
      handleControllerError(error, "Error accepting messaging invite", next);
    }
  }

  public async rejectMessageInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { invitingUserId } = req.body;

      await MessagingNamespace.rejectMessageInvite(userId, invitingUserId);

      return ResponseNamespace.sendSuccessMessage(res, null, 200, "Message invite rejected");
    } catch (error) {
      console.log("Error rejecting message invite: ", error);
      handleControllerError(error, "Error rejecting messaging invite", next);
    }
  }

  public async getMessageInvites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const filter = { invited_user: userId, status: MessageInviteStatus.Pending };
      const options = pick(req.query, ["sortBy", "limit", "page"]);
      const result = await MessagingNamespace.queryMessageInvites({ filter, options });

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Message invites retrieved"
      );
    } catch (error) {
      console.log("Error getting message invites: ", error);
      handleControllerError(error, "Error getting message invites", next);
    }
  }

  public async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const filter = { participants: userId };
      const options = pick(req.query, ["sortBy", "limit", "page"]);
      const result = await MessagingNamespace.queryConversations({ filter, options, userId });

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Conversation retrieved"
      );
    } catch (error) {
      console.log("Error getting conversations: ", error);
      handleControllerError(error, "Error getting conversations", next);
    }
  }

  public async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { conversationId, message } = req.body;

      const messageDetails = {
        message,
        conversationId
      };

      const { chatMessage, conversation } = await MessagingNamespace.sendMessage(
        userId,
        messageDetails
      );

      const receiverId = conversation.participants.find((id) => String(id) !== userId).toString();
      await SocketService.sendNewMessage(req, receiverId, { message: chatMessage });
      await NotificationService.sendNewMessageNotification({
        senderId: userId,
        receiverId,
        message: chatMessage.message
      });

      return ResponseNamespace.sendSuccessMessage(res, null, 200, "Message sent!");
    } catch (error) {
      console.log("Error sending message: ", error);
      handleControllerError(error, "Error sending message", next);
    }
  }

  public async getConversationMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;
      const filter = {};
      const options = pick(req.query, ["sortBy", "limit", "page"]);
      const result = await MessagingNamespace.queryConversationMessages({
        filter,
        options,
        userId,
        conversationId
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Conversation messages retrieved"
      );
    } catch (error) {
      console.log("Error getting conversation messages: ", error);
      handleControllerError(error, "Error getting conversation messages", next);
    }
  }

  init() {
    this.router.post(
      "/send-invite",
      auth,
      validate(messagingValidation.sendMessageInvite),
      this.sendMessageInvite
    );
    this.router.put(
      "/accept-invite",
      auth,
      validate(messagingValidation.acceptMessageInvite),
      this.acceptMessageInvite
    );
    this.router.put(
      "/reject-invite",
      auth,
      validate(messagingValidation.rejectMessageInvite),
      this.rejectMessageInvite
    );
    this.router.get("/invites", auth, this.getMessageInvites);
    this.router.get("/conversations", auth, this.getConversations);
    this.router.post(
      "/send-message",
      auth,
      validate(messagingValidation.sendMessage),
      this.sendMessage
    );
    this.router.get("/conversations/:conversationId/messages", auth, this.getConversationMessages);
  }
}

export default new MessagingController().router;
