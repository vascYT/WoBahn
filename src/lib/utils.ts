import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const getRelativeSeconds = (date: Date) =>
  Math.max(Math.floor((date.getTime() - new Date().getTime()) / 1000), 0);

export const hasElapsedSeconds = (date: Date, seconds: number) =>
  new Date().getTime() - date.getTime() > seconds;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
