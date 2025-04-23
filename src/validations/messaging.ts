import vine from "@vinejs/vine";

export const sendMessageInvite = vine.object({
  body: vine.object({
    invitedUserId: vine.string(),
    message: vine.string().optional()
  })
});

export const acceptMessageInvite = vine.object({
  body: vine.object({
    invitingUserId: vine.string()
  })
});

export const rejectMessageInvite = vine.object({
  body: vine.object({
    invitingUserId: vine.string()
  })
});

export const sendMessage = vine.object({
  body: vine.object({
    message: vine.string(),
    conversationId: vine.string()
  })
});
