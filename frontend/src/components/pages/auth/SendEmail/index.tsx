import { useEffect } from "react";
import { isLogin } from "@/features/auth/utils/isLogin";
import Router from "next/router";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/features/auth/firebase";
import styles from "./index.module.scss";

export const SendEmail = () => {
  const sendEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
      Router.push("/signup");
      return;
    }
    // 環境変数からURLを取得
    const redirectUrl = process.env.NEXT_PUBLIC_SEND_EMAIL_REDIRECT_URL;
    // メールを送信
    sendEmailVerification(user, redirectUrl ? { url: redirectUrl } : undefined);
  };

  return (
    <div className={`${styles.container}`}>
      <div>
        <p>メールを送信しました</p>
        <p>メールボックスを確認してください。</p>
      </div>
      <div className={`${styles.submit_button_field}`}>
        <button className={`${styles.submit_button}`} onClick={sendEmail}>メールを再送信する</button>
      </div>
    </div>
  );
};
