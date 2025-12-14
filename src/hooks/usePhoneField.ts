import { useState, useRef, useEffect } from "react";

export function usePhoneField(maxLength: number = 11) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onChange = (raw: string) => {
    if (!mountedRef.current) return;

    let v = raw.replace(/\D/g, "");
    if (v.length > maxLength) v = v.slice(0, maxLength);

    if (v !== raw) {
      setError(`Chỉ được nhập số (tối đa ${maxLength} ký tự)`);
    } else {
      setError("");
    }

    setValue(v);
  };

  return { value, error, onChange, setValue };
}
