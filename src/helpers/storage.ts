export function setItem(key:string, value:string):void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key: string): string | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

export function removeItem(key: string): void {
    localStorage.removeItem(key);
}