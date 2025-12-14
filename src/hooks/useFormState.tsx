import { useState, useEffect, useRef } from "react";

export function useFormState<T extends object>(
  initialData: Partial<T> | null,
  shape: T
) {
  const mountedRef = useRef(true);

  const buildInit = () => {
    const init: any = {};
    for (const key in shape) {
      init[key] = initialData?.[key] ?? (shape as any)[key];
    }
    return init as T;
  };

  const [form, setForm] = useState<T>(buildInit);

  // 🔥 SYNC LẠI KHI initialData THAY ĐỔI – NHƯNG AN TOÀN
  useEffect(() => {
    if (!mountedRef.current) return;
    setForm(buildInit());
  }, [initialData]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return { form, setForm, handleChange };
}
