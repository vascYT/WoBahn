export const getRelativeSeconds = (date: Date) =>
  Math.max((date.getTime() - new Date().getTime()) / 1000, 0);
