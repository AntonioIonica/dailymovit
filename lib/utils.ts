import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseTimerToMinutes(sec: number) {
  let timer;
  let seconds = 0;
  let minutes = 0;

  if (sec < 60) {
    timer = `${sec.toString().padStart(2, "0")}''`;

    return timer;
  }

  minutes = Math.floor(sec / 60);
  seconds = sec - minutes * 60;

  timer = `${minutes.toString().padStart(2, "0")}'${seconds.toString().padStart(2, "0")}''`;
  return timer;
}
