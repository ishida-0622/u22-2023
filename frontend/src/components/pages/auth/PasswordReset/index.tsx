import { useState } from "react";
import {
  sendPasswordResetEmail,
  AuthError,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "@/features/auth/firebase";
import Link from "next/link";

import styles from "./index.module.scss";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const redirectUrl = process.env.NEXT_PUBLIC_SEND_EMAIL_REDIRECT_URL;
    sendPasswordResetEmail(
      auth,
      email,
      redirectUrl
        ? {
            url: redirectUrl,
          }
        : undefined
    )
      .then(() => {
        alert("入力されたメールアドレスに再設定メールを送信しました");
      })
      .catch((e: AuthError) => {
        console.error(e.message);
        switch (e.code) {
          case AuthErrorCodes.USER_DELETED:
            alert("メールアドレスが存在しません");
            break;
          default:
            alert("エラーが発生しました");
        }
      });
  };

  return (
    <div className={`${styles.main}`}>
      <div className={`${styles.title_field}`}>
        <h1 className={`${styles.title}`}>パスワード再発行</h1>
      </div>
      <hr />
      <form method="post" onSubmit={handleSubmit}>
        <div className={`${styles.email_field}`}>
          <label>
            <p className={`${styles.email_text}`}>メールアドレスを入力</p>
            <input
              className={`${styles.email_form}`}
              type="text"
              name="email"
              id="email"
              placeholder="example@mail.com"
              value={email}
              onChange={changeEmail}
              required={true}
            />
          </label>
        </div>
        <div className={`${styles.submit_button_field}`}>
          <button className={`${styles.submit_button}`} type="submit">
            送信する
          </button>
        </div>
        <div className={`${styles.link}`}>
          <Link href="/login">ログイン画面に戻る</Link>
        </div>
      </form>
    </div>
  );
};
