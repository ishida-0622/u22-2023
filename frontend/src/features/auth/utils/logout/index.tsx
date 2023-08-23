import { signOut } from "firebase/auth";
import { auth } from "@/features/auth/firebase";
import Router from "next/router";
import { reset } from "@/store/user";
import { store } from "@/store";

/**
 * Firebaseからサインアウトした後にstoreをリセットし、ログインページに飛ばす
 */
export const logout = () => {
  signOut(auth)
    .then(() => {
      store.dispatch(reset());
      Router.push("/login");
    })
    .catch((e) => {
      console.error(e);
    });
};
