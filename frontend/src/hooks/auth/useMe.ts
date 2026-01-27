import { useEffect, useState } from "react";
import { getMeApi } from "../../lib/api/user";

type MeUser = {
  userId: string;
  email: string;
  username: string;
  exp: number;
};

export function useMe() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "authorized" | "unauthorized">("idle");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setStatus("loading");
      const data = await getMeApi();

      if (!mounted) return;

      if ("user" in data) {
        setUser(data.user);
        setStatus("authorized");
      } else {
        setUser(null);
        setStatus("unauthorized");
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, status };
}
