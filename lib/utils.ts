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

export function formatCurrency(amount: number, currency: string = "GHS") {
  // Convert common currency symbols to valid ISO codes
  let validCurrency = currency;
  if (currency === "GH₵" || currency === "GHS") {
    validCurrency = "GHS";
  } else if (currency === "USD" || currency === "$") {
    validCurrency = "USD";
  } else if (currency === "EUR" || currency === "€") {
    validCurrency = "EUR";
  } else if (currency === "GBP" || currency === "£") {
    validCurrency = "GBP";
  }

  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: validCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}