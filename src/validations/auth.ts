import vine from "@vinejs/vine";

export const refresh = vine.object({
  body: vine.object({
    refreshToken: vine.string().jwt()
  })
});

export const logout = vine.object({
  body: vine.object({
    refreshToken: vine.string().jwt()
  })
});

export const requestPasswordResetEmail = vine.object({
  body: vine.object({
    email: vine.string().email()
  })
});

export const requestPasswordResetPhone = vine.object({
  body: vine.object({
    phone_number: vine.string().phoneNumber()
  })
});

export const validatePasswordResetPhoneOtp = vine.object({
  body: vine.object({
    otp: vine.string(),
    phone_number: vine.string().phoneNumber()
  })
});

export const validatePasswordResetEmailOtp = vine.object({
  body: vine.object({
    otp: vine.string(),
    email: vine.string().email()
  })
});

export const resetPasswordEmail = vine.object({
  body: vine.object({
    confirmationId: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32)
  })
});

export const resetPasswordPhone = vine.object({
  body: vine.object({
    confirmationId: vine.string(),
    phone_number: vine.string().phoneNumber(),
    password: vine.string().minLength(8).maxLength(32)
  })
});
