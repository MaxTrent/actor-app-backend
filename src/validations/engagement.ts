import vine from "@vinejs/vine";

export const createEndorsement = vine.object({
  body: vine.object({
    comment: vine.string(),
    rating: vine.number().min(1).max(5),
    endorsedUser: vine.string()
  })
});

export const followUser = vine.object({
  body: vine.object({
    userId: vine.string()
  })
});

export const unFollowUser = vine.object({
  body: vine.object({
    userId: vine.string()
  })
});

export const createPost = vine.object({
  body: vine.object({
    description: vine.string(),
    mediaUpload: vine.string(),
    visibility: vine.enum(["public", "private"]).optional()
  })
});

export const getEndorsements = vine.object({
  params: vine.object({
    userId: vine.string()
  })
});
