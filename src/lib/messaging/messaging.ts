import moment from "moment";
import ApiError from "common/api-error";
import httpStatus from "http-status";
import { UserNamespace } from "lib/users/user";
import MessageInvite, { MessageInviteStatus } from "./models/messageInvite";
import { UserProfileNamespace } from "lib/profile/userProfile";
import Conversation from "./models/conversation";
import { TPaginationResult } from "models/plugins/paginate";
import UserProfileModel from "lib/profile/models/userProfileModel";
import ChatMessage from "./models/chatMessage";

export class MessagingNamespace {
  public static async sendMessageInvite(userId: string, invitedUserId: string, message?: string) {
    if (userId === invitedUserId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You can't send a message invite to yourself");
    }

    const invitedUser = await UserNamespace.getUserById(invitedUserId, false);

    if (!invitedUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "The invited user does not exist");
    }

    const existingMessageInvite = await MessageInvite.findOne({
      sent_by: userId,
      invited_user: invitedUserId
    });

    if (existingMessageInvite) {
      if (existingMessageInvite.status === MessageInviteStatus.Rejected) {
        const oneWeekFromRejectionTime = moment(existingMessageInvite.rejected_at).add(1, "week");
        const now = moment();
        if (now.isBefore(oneWeekFromRejectionTime)) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            "The invited user rejected your previous message invite"
          );
        }
        existingMessageInvite.status = MessageInviteStatus.Pending;
        existingMessageInvite.rejected_at = null;
        await existingMessageInvite.save();
      }

      if (existingMessageInvite.status === MessageInviteStatus.Pending) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can't send another message invite");
      }

      if (existingMessageInvite.status === MessageInviteStatus.Accepted) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "The invited user has already accepted your message invite"
        );
      }
    } else {
      await MessageInvite.create({
        sent_by: userId,
        invited_user: invitedUserId,
        message,
        sent_at: new Date()
      });

      // TODO: Notify user of a new message invite
    }
  }

  public static async queryMessageInvites({ filter, options }: { filter: any; options: any }) {
    try {
      const sortBy = options.sortBy || "sent_at:desc";

      const messageInvites = await MessageInvite.paginate(filter, { ...options, sortBy });

      const results: any[] = await UserProfileNamespace.addUserProfile(messageInvites, "sent_by");

      messageInvites.results = results;

      return messageInvites;
    } catch (error) {
      throw error;
    }
  }

  public static async rejectMessageInvite(userId: string, invitingUserId: string) {
    try {
      const messageInvite = await MessageInvite.findOne({
        sent_by: invitingUserId,
        invited_user: userId
      });

      if (!messageInvite) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This message invite does not exist");
      }

      if (messageInvite.status === MessageInviteStatus.Accepted) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can't reject an accepted message invite");
      }

      if (messageInvite.status === MessageInviteStatus.Rejected) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You've already rejected this message invite");
      }

      messageInvite.status = MessageInviteStatus.Rejected;
      messageInvite.rejected_at = new Date();
      await messageInvite.save();
    } catch (error) {
      throw error;
    }
  }

  public static async acceptMessageInvite(userId: string, invitingUserId: string) {
    try {
      if (userId === invitingUserId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can't accept a message invite you sent");
      }

      const messageInvite = await MessageInvite.findOne({
        sent_by: invitingUserId,
        invited_user: userId
      });

      if (!messageInvite) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This message invite does not exist");
      }

      if (messageInvite.status === MessageInviteStatus.Accepted) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You've already accepted this message invite");
      }

      if (messageInvite.status === MessageInviteStatus.Rejected) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "You can't accept a message invite you've rejected"
        );
      }

      messageInvite.status = MessageInviteStatus.Accepted;
      messageInvite.accepted_at = new Date();
      await messageInvite.save();

      const newConversation = await Conversation.create({
        participants: [invitingUserId, userId]
      });

      if (messageInvite.message) {
        const chatMessage = await ChatMessage.create({
          message: messageInvite.message,
          sent_by: invitingUserId,
          conversation_id: newConversation._id,
          sent_at: messageInvite.sent_at,
          read_by: [invitingUserId, userId]
        });

        const userProfile = await UserProfileNamespace.getUserProfile({
          userId: String(chatMessage.sent_by)
        });

        newConversation.last_message = chatMessage.message;
        newConversation.last_message_by = `${userProfile.last_name} ${userProfile.first_name}`;
        newConversation.last_message_sent_at = chatMessage.sent_at;

        await newConversation.save();
      }

      return newConversation;
    } catch (error) {
      throw error;
    }
  }

  public static async addParticipantProfileToConversations(
    docs: TPaginationResult,
    currentUserId: string
  ) {
    return await Promise.all(
      docs.results.map(async (doc) => {
        const userIds = doc.participants;

        const userId = userIds.find((id: string) => String(id) !== currentUserId);

        const userProfile = await UserProfileModel.findOne({ user_id: userId });

        const updatedDoc = {
          ...doc.toObject(),
          user_profile: userProfile
            ? {
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                profile_picture: userProfile.profile_picture
              }
            : null
        };

        return updatedDoc;
      })
    );
  }

  public static async queryConversations({
    filter,
    options,
    userId
  }: {
    filter: any;
    options: any;
    userId: string;
  }) {
    try {
      const sortBy = options.sortBy || "last_message_sent_at:desc";

      const conversations = await Conversation.paginate(filter, { ...options, sortBy });

      const results: any[] = await this.addParticipantProfileToConversations(conversations, userId);

      conversations.results = results;

      return conversations;
    } catch (error) {
      throw error;
    }
  }

  public static async sendMessage(
    userId: string,
    messageDetails: { message: string; conversationId: string }
  ) {
    try {
      const { message, conversationId } = messageDetails;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
      });

      if (!conversation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This conversation does not exist");
      }

      const chatMessage = await ChatMessage.create({
        message,
        sent_by: userId,
        conversation_id: conversationId,
        sent_at: new Date(),
        read_by: [userId]
      });

      const userProfile = await UserProfileNamespace.getUserProfile({
        userId: String(chatMessage.sent_by)
      });

      conversation.last_message = chatMessage.message;
      conversation.last_message_by = `${userProfile.last_name} ${userProfile.first_name}`;
      conversation.last_message_sent_at = chatMessage.sent_at;

      await conversation.save();

      return { chatMessage, conversation };
    } catch (error) {
      throw error;
    }
  }

  public static async queryConversationMessages({
    filter,
    options,
    userId,
    conversationId
  }: {
    filter: any;
    options: any;
    userId: string;
    conversationId: string;
  }) {
    try {
      const sortBy = options.sortBy || "sent_at:desc";

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
      });

      if (!conversation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This conversation does not exist");
      }

      const chatMessages = await ChatMessage.paginate(
        { ...filter, conversation_id: conversationId },
        { ...options, sortBy }
      );

      const receiverId = conversation.participants.find((id) => String(id) !== userId).toString();

      const receiverProfile = await UserProfileNamespace.getUserProfile({ userId: receiverId });
      const senderProfile = await UserProfileNamespace.getUserProfile({ userId });

      const results = chatMessages.results.map((doc) => ({
        ...doc.toObject(),
        user_profile:
          String(doc.sent_by) === userId
            ? {
                first_name: senderProfile.first_name,
                last_name: senderProfile.last_name,
                profile_picture: senderProfile.profile_picture
              }
            : {
                first_name: receiverProfile.first_name,
                last_name: receiverProfile.last_name,
                profile_picture: receiverProfile.profile_picture
              }
      }));

      chatMessages.results = results;

      return chatMessages;
    } catch (error) {
      throw error;
    }
  }
}
