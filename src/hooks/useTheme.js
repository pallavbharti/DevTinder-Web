import { useEffect, useState } from "react";

// Light = "beige", Dark = "beigedark" (index.css mein bane hain)
// localStorage mein save hota hai, taaki refresh pe theme yaad rahe
const useTheme = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "beige"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // private mode mein localStorage fail ho sakta hai — ignore
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "beigedark" ? "beige" : "beigedark"));

  return { isDark: theme === "beigedark", toggleTheme };
};

export default useTheme;
