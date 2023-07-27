import { useEffect } from "react";
import { isLogin } from "@/features/auth/utils/isLogin";
import Router from "next/router";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/features/auth/firebase";

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

  useEffect(() => {
    isLogin().then((res) => {
      if (!res) {
        Router.push("/signup");
      } else {
        const user = auth.currentUser;
        if (user?.emailVerified) {
          Router.push("/");
        }
      }
    });
  }, []);

  return (
    <div>
      <div>
        <p>メールを送信しました</p>
        <p>メールボックスを確認してください。</p>
      </div>
      <div>
        <button onClick={sendEmail}>メールを再送信する</button>
      </div>
    </div>
  );
};
