import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toSentenceCase(str: string) {
  if (!str) {
    return "";
  }

  // Convert the entire string to lowercase
  let sentence = str.toLowerCase();

  // Capitalize the first letter of the string
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  // Capitalize the first letter after a period and a space
  sentence = sentence.replace(/\. ([a-z])/g, (match, char) => `. ${char.toUpperCase()}`);

  return sentence;
}