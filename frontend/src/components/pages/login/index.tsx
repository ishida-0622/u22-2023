import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/features/auth/firebase";
import { RootState } from "@/store";
import { updateUid, updateUser } from "@/store/user";
import {
  ScanUsersRequest,
  ScanUsersResponse,
} from "@/features/auth/types/scanUsers";
import { isLogin } from "@/features/auth/utils/isLogin";

import styles from "./index.module.scss";
import { getLoginUser } from "@/features/auth/utils/getLoginUser";
import image from "./images/A.jpg";
import { Image } from "./images/B.jpg";

export const Login = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const uid = useSelector((store: RootState) => store.uid);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUserData = async (uid: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }

    const req: ScanUsersRequest = {
      u_id: [uid],
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
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }
    try {
      // ログイン処理
      const response = await signInWithEmailAndPassword(auth, email, password);
      // グローバルステートを更新
      dispatch(updateUid(response.user.uid));
      // ユーザー情報を取得
      await fetchUserData(response.user.uid);
      ScreenTransition();
    } catch (e) {
      console.error(e);
      alert("ログインに失敗しました");
    }
  };

  useEffect(() => {
    isLogin().then((res) => {
      if (res) {
        if (user && uid) {
          router.push("/");
        } else if (uid) {
          fetchUserData(uid).then(() => {
            router.push("/");
          });
        } else {
          getLoginUser().then((res) => {
            if (res) {
              dispatch(updateUid(res.uid));
              fetchUserData(res.uid).then(() => {
                router.push("/");
              });
            }
          });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ScreenTransition = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.header}`}>
        <div className={`${styles.logintext}`}></div>
        <Image  src={imageA}/>
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
