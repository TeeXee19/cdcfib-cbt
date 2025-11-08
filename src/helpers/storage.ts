export function setItem(key:string, value:any):void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key: string): any  {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

export function removeItem(key: string): void {
    localStorage.removeItem(key);
}