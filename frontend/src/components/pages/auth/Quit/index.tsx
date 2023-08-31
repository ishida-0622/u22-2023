import { useState } from "react";
import Router from "next/router";
import { auth } from "@/features/auth/firebase";
import { User, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { endpoint } from "@/features/api";
import { QuitRequest, QuitResponse } from "@/features/auth/types/quit";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import styles from "./index.module.scss";

export const Quit = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isHiddenPass, setIsHiddenPass] = useState({ pass: true, check: true });

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let user: User;
    let uid: string | null = null;
    try {
      user = (await signInWithEmailAndPassword(auth, email, password)).user;
      uid = user.uid;
    } catch {
      alert("メールアドレスかパスワードが間違っています");
      return;
    }

    if (!uid) {
      console.warn("uid is null");
      return;
    }

    try {
      const req: QuitRequest = {
        u_id: uid,
      };
      const res = await fetch(`${endpoint}/Quit`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: QuitResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      await deleteUser(user);
    } catch (e) {
      console.error(`quit error\n${e}`);
      alert("退会に失敗しました");
    }
    Router.push("/signup");
  };

  return (
    <main className={`${styles.container}`}>
      <div className={`${styles.header}`}>
        <h1 className={`${styles.main}`}>退会</h1>
        <hr />
      </div>
        <form onSubmit={handlerSubmit} className={`${styles.form}`}>
          <div>
            <div>
              <label>
                メールアドレス
                <br />
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                />
              </label>
              <label>
                パスワード
                <br />
                <input
                  type={isHiddenPass.pass ? "password" : "text"}
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
              </label>
              <span
                onClick={() => setIsHiddenPass((v) => ({ ...v, pass: !v.pass }))}
                role="presentation"
              >
                <FontAwesomeIcon icon={isHiddenPass.pass ? faEyeSlash : faEye} />
              </span>
              <div className={`${styles.submit_button_field}`}>
                <button
                  type="submit"
                  value="退会"
                  className={`${styles.submit_button}`}
                >
                  退会する
                </button>
              </div>
              <div className={`${styles.link}`}>
                <div>
                  <Link href="/account-info">
                    アカウント設定画面に戻る
                  </Link>
                </div>
                <div>
                  <Link href="/">トップ画面に戻る</Link>
                </div>
              </div>
            </div>
          </div>
        </form>
    </main>
  );
};
