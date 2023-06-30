import { useState } from "react";
import styles from "./index.module.scss";

export const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const changeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }
    try {
      const response = await fetch(`${baseUrl}/auth/password-reset`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
        }),
      });

      // responseの処理
      // responseがtrueの時、画面遷移をする
      // responseがfalseの時、アラートを出す。
    } catch (e) {
      alert("データの送信に失敗しました");
    }
  };

  return (
    <div className={`${styles.main}`}>
      <div className={`${styles.title_field}`}>
        <h2 className={`${styles.title}`}>パスワード再発行</h2>
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
      </form>
    </div>
  );
};
