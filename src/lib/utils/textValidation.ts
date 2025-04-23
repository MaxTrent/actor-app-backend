export const isEmailValid = (email: any): boolean => {
  const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  if (email.length > 254) return false;

  let valid = emailRegex.test(email);
  if (!valid) return false;

  let parts = email.split("@");
  if (parts[0].length > 64) return false;

  let domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part: string | any[]) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

export const isPhoneNumberValid = (phone_number: any): boolean => {
  if (phone_number.charAt(0) !== "0") return false;
  if (phone_number.length !== 11) return false;
  return true;
};
