import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { endpoint } from "@/features/api";
import { LoginRequest } from "@/features/auth/types/login";

export const useLogin = () => {
  const uid = useSelector((store: RootState) => store.uid);

  useEffect(() => {
    if (uid) {
      const req: LoginRequest = {
        u_id: uid,
      };
      fetch(`${endpoint}/Login`, {
        method: "POST",
        body: JSON.stringify(req),
      }).catch((e) => {
        console.error(e);
      });
    }
  }, [uid]);
};
