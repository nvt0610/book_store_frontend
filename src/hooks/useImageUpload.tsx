import { useState, useRef, useEffect } from "react";
import { alertError } from "@/utils/alert";
import uploadApi from "@/api/upload";

export function useImageUpload() {
  const [preview, setPreview] = useState<string>("");
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];

  const uploadSingle = async (file: File) => {
    if (!allowed.includes(file.type)) {
      alertError("Chỉ chấp nhận PNG, JPG, JPEG, WEBP, GIF");
      return null;
    }

    const localPreview = URL.createObjectURL(file);

    if (mountedRef.current) {
      setPreview(localPreview);
    }

    try {
      const uploaded = await uploadApi.single(file);

      if (!mountedRef.current) return null;

      return {
        url: uploaded.original,
        thumbnail: uploaded.thumbnail || localPreview,
      };
    } catch {
      if (mountedRef.current) {
        alertError("Upload ảnh thất bại");
      }
      return null;
    }
  };

  const uploadMultiple = async (files: File[]) => {
    try {
      const { urls } = await uploadApi.multiple(files);
      return urls;
    } catch {
      if (mountedRef.current) {
        alertError("Upload ảnh thất bại");
      }
      return [];
    }
  };

  return { preview, setPreview, uploadSingle, uploadMultiple };
}
