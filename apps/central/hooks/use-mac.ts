import { useEffect, useState } from "react";

export default function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().startsWith("MAC"));
  }, []);

  return isMac;
}
