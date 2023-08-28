import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/features/auth/firebase";
import { updateEmail, updateUid, updateUser } from "@/store/user";
import { endpoint } from "@/features/api";
import {
  ScanUserRequest,
  ScanUserResponse,
} from "@/features/auth/types/scanUser";

import styles from "./index.module.scss";

export const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isActive = useRef(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUserData = async (uid: string) => {
    const req: ScanUserRequest = {
      u_id: uid,
    };

    // ユーザー情報を取得
    const res: ScanUserResponse = await (
      await fetch(`${endpoint}/ScanUser`, {
        method: "POST",
        body: JSON.stringify(req),
      })
    ).json();

    // failだった場合はエラーを投げる
    if (res.response_status === "fail") {
      throw new Error(res.error);
    }
    const userData = res.result;
    // グローバルステートを更新
    dispatch(updateUser(userData));
  };

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isActive.current) {
      console.warn("submit is deactive");
      return;
    }
    isActive.current = false;
    try {
      // ログイン処理
      const response = await signInWithEmailAndPassword(auth, email, password);
      // グローバルステートを更新
      dispatch(updateUid(response.user.uid));
      dispatch(updateEmail(response.user.email));
      // ユーザー情報を取得
      await fetchUserData(response.user.uid);
      ScreenTransition();
    } catch (e) {
      isActive.current = true;
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
