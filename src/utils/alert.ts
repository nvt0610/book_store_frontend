// src/utils/alert.ts
import Swal from "sweetalert2";
import "animate.css";

export const alertSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Thành công",
    text: message,
    timer: 1500,
    showConfirmButton: false,
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
  });
};

export const alertError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Lỗi",
    text: message,
    showClass: { popup: "animate__animated animate__shakeX" },
    hideClass: { popup: "animate__animated animate__fadeOut" },
  });
};

export const alertConfirm = async (title = "Bạn có chắc muốn xóa?", text = "Hành động này không thể hoàn tác.") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
  });
};

export const alertToast = (message: string) => {
  return Swal.fire({
    toast: true,
    position: "center-end",
    icon: "warning",
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};