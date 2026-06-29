import { useEffect, useState } from "react";

export function useFontScale() {
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem("font-scale");
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    const handleScaleChange = () => {
      const saved = localStorage.getItem("font-scale");
      if (saved) {
        setScale(parseFloat(saved));
      }
    };

    window.addEventListener("font-scale-change", handleScaleChange);
    return () => {
      window.removeEventListener("font-scale-change", handleScaleChange);
    };
  }, []);

  return scale;
}
