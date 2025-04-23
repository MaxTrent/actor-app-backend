const generateAnOtp = (length: number = 6) => {
  // Generate random digits to form the OTP
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

export default generateAnOtp;
