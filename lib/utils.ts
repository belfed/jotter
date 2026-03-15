import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function to<T>(promise: Promise<T>): Promise<[null, T] | [Error, null]> {
  return promise
    .then<[null, T]>((data) => [null, data])
    .catch<[Error, null]>((err) => [err, null]);
}
