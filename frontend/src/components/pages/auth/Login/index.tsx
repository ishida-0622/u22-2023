import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

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

  const [isHiddenPass, setIsHiddenPass] = useState({ pass: true, check: true });

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
      const reg = new RegExp(process.env.NEXT_PUBLIC_ADMIN_REGEXP ?? "^$");
      if (reg.test(email)) {
        router.push("/admin");
        return;
      }
      if (!response.user.emailVerified) {
        await sendEmailVerification(response.user);
        alert(
          "メールアドレス認証がされていません\n送信されたメールのURLをクリックしてください"
        );
        await signOut(auth);
        isActive.current = true;
        return;
      }
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
        <h2>ログイン</h2>
        <p>パパ、ママにそうさしてもらってね！</p>
        <hr />
      </div>
      <form method="post" onSubmit={handleSubmit} className={`${styles.form}`}>
        <div className="top">
          <br />
          <label>
            メールアドレス
            <br />
            <input
              type="text"
              name="email"
              id="email"
              placeholder="example@mail.com"
              value={email}
              onChange={changeEmail}
              required={true}
            />
          </label>
          <br />
          <label>
            パスワード
            <br />
            <input
              type={isHiddenPass.pass ? "password" : "text"}
              name="password"
              id="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={changePassword}
              required={true}
            />
          </label>
          <span
            onClick={() => setIsHiddenPass((v) => ({ ...v, pass: !v.pass }))}
            role="presentation"
          >
            <FontAwesomeIcon icon={isHiddenPass.pass ? faEyeSlash : faEye} />
          </span>
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
  );
};
