import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/features/auth/firebase";

export const getLoginUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};
