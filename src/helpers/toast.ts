import toast from "react-hot-toast";

export const customToast = {
  success: (message: string, id?: string) =>
    toast.success(message, {
      id: id ?? encodeURI(message),
      position: 'top-right'
    }),
  error: (message: string, id?: string) =>
    toast.error(message, {
      id: id ?? encodeURI(message),
      position: 'top-left'
    }),
  info: (message: string, id?: string) =>
    toast(message, {
      icon: "ℹ️",
      id: id ?? encodeURI(message),
    }),
  warning: (message: string, id?: string) =>
    toast(message, {
      icon: "❗️",
      id: id ?? encodeURI(message),
    }),
// 
};
