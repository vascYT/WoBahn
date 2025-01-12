export const getRelativeSeconds = (date: Date) =>
  Math.max(Math.floor((date.getTime() - new Date().getTime()) / 1000), 0);
