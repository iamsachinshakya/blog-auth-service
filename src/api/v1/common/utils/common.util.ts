import { v4 as uuidv4 } from "uuid";


export const generateShortId = (prefix = "cat"): string => {
    const now = Date.now().toString(36); // compact time
    const rand = Math.random().toString(36).substring(2, 6); // 4 random chars
    return `${prefix}_${now}${rand}`;
};


export const getUID = (): string => {
    return uuidv4()
}
