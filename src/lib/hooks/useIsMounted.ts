import { useEffect, useState } from "react";

// PATCH: weird wagmi + ethers.js + viem + rainbowkit combo bug
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
