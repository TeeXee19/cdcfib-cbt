// src/utils/sweetAlert.js
import Swal, {SweetAlertIcon} from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
// Alert with confirm/cancel buttons
export const showConfirmAlert = (
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  icon:SweetAlertIcon = 'warning',
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
) => {
  return MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
  });
};

// Simple alert
export const showAlert = (
  title = "Alert",
  text = "",
  icon:SweetAlertIcon = "info",
  timer = 30000,
) => {
  return MySwal.fire({
    title,
    text,
    icon,
    timer,
    showConfirmButton: !timer,
  });
};

// Toast notification
export const showToast = (
  icon:SweetAlertIcon = "success",
  title = "Action completed",
  timer = 3000,
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
  });

  return Toast.fire({ icon, title });
};
