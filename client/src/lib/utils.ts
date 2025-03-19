import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

dayjs.extend(localizedFormat);

export const moment = dayjs;

export const formatAgentName = (name: string) => {
    return name.substring(0, 2);
};

export function shortener(str: string, maxLength: number): string {
    if (str?.length > maxLength) {
        const maxSizeOfPart = (maxLength - 2) / 2;
        const start = str.substring(0, maxSizeOfPart);
        const end = str.substring(str.length - maxSizeOfPart);
        return start + ".." + end;
    }
    return str;
}

export function shortenAddress(address: `0x${string}`): string {
    return shortener(address, 15);
}
