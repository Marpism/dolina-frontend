import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const YandexMetrika = () => {
  const location = useLocation();
  const id = 97575657;

  useEffect(() => {
    if (window.ym) {
      window.ym(id, "hit", location.pathname + location.search);
    }
  }, [location]);

  return null;
};

export default YandexMetrika;
