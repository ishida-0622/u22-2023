import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/features/auth/firebase";

export const isLogin = (): Promise<boolean> =>
  new Promise((resolve) =>
    onAuthStateChanged(auth, (user) => resolve(user != null)),
  );
