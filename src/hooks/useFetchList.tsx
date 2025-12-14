import { useEffect, useState } from "react";

export function useFetchList(fetchFn: Function, deps: any[] = []) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchFn();
        if (mounted) setList(res);
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, deps);

  return { list, loading, setList };
}
