export enum SOCKETIO_EVENTS {
  CONNECTION_SUCCESSFUL = "connection",
  CONNECTION_DISCONNECTED = "disconnect",
  CONNECTION_ERROR = "socketError"
}

export enum CHAT_EVENTS {
  JOIN_CONVERSATION = "join_conversation",
  LEAVE_CONVERSATION = "leave_conversation",
  NEW_CONVERSATION = "new_conversation",
  NEW_MESSAGE_INVITE = "new_message_invite",
  NEW_MESSAGE = "new_message"
}
