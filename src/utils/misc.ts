export const getRelativeSeconds = (date: Date) =>
  Math.max(Math.floor((date.getTime() - new Date().getTime()) / 1000), 0);

export const hasElapsedSeconds = (date: Date, seconds: number) =>
  new Date().getTime() - date.getTime() > seconds;
