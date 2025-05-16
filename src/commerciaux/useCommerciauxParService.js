import { useState, useEffect } from "react";
import { fetchCommerciauxParService } from "../hooks/components/utils/useFetchCommerciaux"

const useCommerciauxParService = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommerciauxParService().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
};

export default useCommerciauxParService;