import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const WatiCallback = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      fetch("http://localhost:5000/api/wati/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("WATI Access Token:", data);
          // You can store token in localStorage or global state
        });
    }
  }, [params]);

  return <div>Authorizing with WATI...</div>;
};

export default WatiCallback;
