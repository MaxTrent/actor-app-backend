import vine from "@vinejs/vine";

export const initiateEmailSignup = vine.object({
  body: vine.object({
    email: vine.string().email()
  })
});

export const validateEmailSignupOtp = vine.object({
  body: vine.object({
    otp: vine.string(),
    email: vine.string().email()
  })
});

export const finalizeEmailSignup = vine.object({
  body: vine.object({
    confirmationId: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
    fcmDeviceToken: vine.string().optional()
  })
});

export const initiatePhoneSignup = vine.object({
  body: vine.object({
    phone_number: vine.string().phoneNumber()
  })
});

export const validatePhoneSignupOtp = vine.object({
  body: vine.object({
    otp: vine.string(),
    phone_number: vine.string().phoneNumber()
  })
});

export const finalizePhoneSignup = vine.object({
  body: vine.object({
    confirmationId: vine.string(),
    phone_number: vine.string().phoneNumber(),
    password: vine.string().minLength(8).maxLength(32),
    fcmDeviceToken: vine.string().optional()
  })
});

export const loginUserEmail = vine.object({
  body: vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
    fcmDeviceToken: vine.string().optional()
  })
});

export const loginUserPhone = vine.object({
  body: vine.object({
    phone_number: vine.string().phoneNumber(),
    password: vine.string().minLength(8).maxLength(32),
    fcmDeviceToken: vine.string().optional()
  })
});
