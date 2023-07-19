import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/features/auth/firebase";
import { RootState } from "@/store";
import { userSlice } from "@/store/user";
import {
  ScanUsersRequest,
  ScanUsersResponse,
} from "@/features/auth/types/scanUsers";

import styles from "./index.module.scss";

export const Login = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const firebaseUser = useSelector((store: RootState) => store.firebaseUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUserData = async () => {
    if (firebaseUser === null) {
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }

    try {
      const req: ScanUsersRequest = {
        u_id: [firebaseUser.uid],
      };

      // ユーザー情報を取得
      const res: ScanUsersResponse = await (
        await fetch(`${baseUrl}/ScanUsers`, {
          method: "POST",
          body: JSON.stringify(req),
        })
      ).json();

      // failだった場合はエラーを投げる
      if (res.response_status === "fail") {
        throw new Error(res.error);
      }
      // ユーザー情報が空の場合はエラーを投げる
      if (res.result.length === 0) {
        throw new Error("user data is not found");
      }
      const userData = res.result[0];
      // グローバルステートを更新
      dispatch(userSlice.actions.updateUser(userData));
    } catch (e) {
      console.error(e);
    }
  };

  // 既にログイン済みだった場合はTOPに飛ばす
  if (firebaseUser && user) {
    router.push("/");
    return null;
  }
  // ログイン済みだがユーザー情報が無い場合は取得してから飛ばす
  if (firebaseUser) {
    fetchUserData().then(() => {
      router.push("/");
      return null;
    });
  }

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }
    try {
      // ログイン処理
      const response = await signInWithEmailAndPassword(auth, email, password);
      // グローバルステートを更新
      dispatch(userSlice.actions.updateFirebaseUser(response.user));
      // ユーザー情報を取得
      await fetchUserData();
      ScreenTransition();
    } catch (e) {
      console.error(e);
      alert("ログインに失敗しました");
    }
  };

  const ScreenTransition = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.header}`}>
        <div className={`${styles.logintext}`}></div>
        <h2>ログイン</h2>
        <p>パパ、ママにそうさしてもらってね！</p>
        <hr />
        <form method="post" onSubmit={handleSubmit}>
          <div className="top">
            <br></br>
            <label>
              メールアドレス<br></br>
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={changeEmail}
                required={true}
              />
            </label>
            <br></br>
            <label>
              パスワード<br></br>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={changePassword}
                required={true}
              />
            </label>
          </div>
          <div>
            <div className={`${styles.submit_button_field}`}>
              <button className={`${styles.submit_button}`} type="submit">
                ログイン
              </button>
            </div>
          </div>
          <div className={`${styles.link}`}>
            <div>
              <Link href="/password-reset">
                IDやパスワードを忘れてしまった方はこちら
              </Link>
            </div>
            <div>
              <Link href="/signup">アカウント作成がまだの方はこちら</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
