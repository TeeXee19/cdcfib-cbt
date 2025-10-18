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

export const formatDate = (dateString:string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short', // "Jan", "Feb"
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
