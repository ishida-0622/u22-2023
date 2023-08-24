import { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { updatePassword } from "firebase/auth";
import { auth } from "@/features/auth/firebase";
import { logout } from "@/features/auth/utils/logout";

import styles from "./index.module.scss";

export const PasswordChange = () => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isHidden, setIsHidden] = useState({ pass: true, passConfirm: true });

  const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const changePasswordConfirm = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(event.target.value);
  };

  const toLoginPage = () => {
    router.push("/login");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      alert("パスワードが一致しません");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      toLoginPage();
      return;
    }
    updatePassword(user, password)
      .then(() => {
        alert("再設定が完了しました\nもう一度ログインしてください");
        logout();
      })
      .catch((e) => {
        alert("再設定に失敗しました");
        console.error(e);
      });
  };

  return (
  <div className={`${styles.container}`}>
    <h2 className={`${styles.title}`}>パスワード再設定</h2>
    <hr />
    <form method="post" onSubmit={handleSubmit}>
      <div className={`${styles.password_field}`}>
        <label>
          <p className={`${styles.password_text}`}>新しいパスワード</p>
          <input
            className={`${styles.password_form}`}
            type={isHidden.pass ? "password" : "text"}
            name="password"
            id="password"
            value={password}
            onChange={changePassword}
            required={true}
          />
          <FontAwesomeIcon
            icon={isHidden.pass ? faEye : faEyeSlash}
            onClick={() => setIsHidden((v) => ({ ...v, pass: !v.pass }))}
          />
        </label>
        <br></br>
        <label>
          <p className={`${styles.password_retype_field}`}>再入力</p>
          <input
            className={`${styles.password_retype_form}`}
            type={isHidden.passConfirm ? "password" : "text"}
            name="passwordConfirm"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={changePasswordConfirm}
            required={true}
          />
          <FontAwesomeIcon
            icon={isHidden.passConfirm ? faEye : faEyeSlash}
            onClick={() =>
              setIsHidden((v) => ({ ...v, passConfirm: !v.passConfirm }))
            }
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
