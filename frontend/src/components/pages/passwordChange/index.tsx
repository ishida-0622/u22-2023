import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";

export const PasswordChange = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const changePasswordConfirm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(event.target.value);
  };

  const router = useRouter();

  const PageTransition = () => {
    router.push("/login");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }
    try {
      const response = await fetch(`${baseUrl}/auth/password-change`, {
        method: "POST",
        body: JSON.stringify({
          password: password,
          passwordConfirm: passwordConfirm,
        }),
      });
      // responseの処理
      // responseがtrueの時、画面遷移をする
      // responseがfalseの時、アラートを出す。
      PageTransition();
    } catch (e) {
      alert("データの送信に失敗しました");
    }
  };

  return (
    <div>
      <h2 className={`${styles.title}`}>パスワード再設定</h2>
      <hr />
      <form method="post" onSubmit={handleSubmit}>
        <div className={`${styles.password_field}`}>
          <label>
            <p className={`${styles.password_text}`}>新しいパスワード</p>
            <input
              className={`${styles.password_form}`}
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={changePassword}
              required={true}
            />
          </label>
          <br></br>
          <label>
            <p className={`${styles.password_retype_field}`}>確認用</p>
            <input
              className={`${styles.password_retype_form}`}
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={changePasswordConfirm}
              required={true}
            />
          </label>
        </div>
        <div className={`${styles.submit_button_field}`}>
          <button className={`${styles.submit_button}`} type="submit">
            変更する
          </button>
        </div>
      </form>
    </div>
  );
};
