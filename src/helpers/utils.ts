/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleInputChange = (
  e: any,
  // e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  setState: React.Dispatch<React.SetStateAction<any>>, // Replace `any` with your state type
  formData: any // Replace `any` with your form state type
) => {
  const { name, value } = e.target;
  setState({
    ...formData,
    [name]: value,
  });
};

export function handleSubmitForm<T>(submitFn: (data: T) => void) {
  return (e: React.FormEvent, data: T) => {
    e.preventDefault();
    submitFn(data);
  };
}

export function getFirstLetters(str: string) {
  return str
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US").format(num);


export const formatDate = (date: Date) => {
  if (!date) return "";
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};


export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};