import { Server, Socket } from "socket.io";
import { CHAT_EVENTS, SOCKETIO_EVENTS } from "lib/services/socket/events";
import ApiError from "common/api-error";
import httpStatus from "http-status";
import { UserNamespace } from "lib/users/user";
import { validateAccessToken } from "lib/utils/jwt";

const verifyAuth = async (socket: Socket) => {
  const authToken = String(socket.handshake.headers.token);
  const decoded = await validateAccessToken(authToken);
  const user = await UserNamespace.getUserById(decoded?.id);

  if (user) {
    return user;
  } else {
    const error = new ApiError(
      httpStatus.UNAUTHORIZED,
      "You're not authorized to perform this action"
    );
    throw error;
  }
};

const joinConversationEvent = (socket: Socket) => {
  socket.on(CHAT_EVENTS.JOIN_CONVERSATION, (conversationId) => {
    console.log(`[socket.io] User joined conversation with id: ${conversationId}`);
    socket.join(conversationId);
  });
};

const leaveConversationEvent = (socket: Socket) => {
  socket.on(CHAT_EVENTS.LEAVE_CONVERSATION, (conversationId) => {
    console.log(`[socket.io] User left conversation with id: ${conversationId}`);
    socket.leave(conversationId);
  });
};

const registerSocketEventListeners = (socket: Socket) => {
  joinConversationEvent(socket);
  leaveConversationEvent(socket);
};

export const initializeSocketIO = (io: Server) => {
  return io.on(SOCKETIO_EVENTS.CONNECTION_SUCCESSFUL, async (socket) => {
    try {
      console.log("[socket.io] Socket connection established");

      const user = await verifyAuth(socket);
      const userId = String(user._id);

      // Add current user to its own room to receive events
      socket.join(userId);

      // Send connection successful event to user to confirm everything is okay
      socket.emit(SOCKETIO_EVENTS.CONNECTION_SUCCESSFUL);

      // Send this event for connected clients to be aware of a successful connection
      console.log(`[socket.io] User with id: ${userId} is now connected`);

      registerSocketEventListeners(socket);

      socket.on(SOCKETIO_EVENTS.CONNECTION_DISCONNECTED, () => {
        console.log("[socket.io] Socket connection ended");
      });
    } catch (error) {
      console.log(error);
      socket.emit(
        SOCKETIO_EVENTS.CONNECTION_ERROR,
        "[socket.io] An error occurred while connecting to the socket"
      );
    }
  });
};
