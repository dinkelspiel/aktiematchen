import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/SAVE/AZA");
  }, []);

  return <div>Redirecting</div>;
};

export default index;
