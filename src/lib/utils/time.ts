export const getNextMinute = (minute: number = 1) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minute);
  return date;
};

export const getMinuteAgo = (minute: number = 1) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minute);
  return date;
};
