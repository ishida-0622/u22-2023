import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import { auth } from "@/features/auth/firebase";
import { updateUid, updateUser } from "@/store/user";
import { SignUpRequest } from "@/features/auth/types/signup";

import styles from "./index.module.scss";
import { isLogin } from "@/features/auth/utils/isLogin";

export const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await isLogin();
      if (res) {
        Router.push("/");
      }
    })();
  }, []);

  const [formValues, setFormValues] = useState<SignUpRequest>({
    family_name: "",
    first_name: "",
    family_name_roma: "",
    first_name_roma: "",
    account_name: "",
    email: "",
    password: "",
    child_lock: "",
  });

  const [confirm, setConfirm] = useState({
    passwordConfirm: "",
    childLockConfirm: "",
    consent: false,
  });

  const [isHiddenPass, setIsHiddenPass] = useState({ pass: true, check: true });
  const [isHiddenChildLock, setIsHiddenChildLock] = useState({
    pass: true,
    check: true,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formValues.password !== confirm.passwordConfirm) {
      alert("パスワードが一致しません。");
      return;
    }
    if (formValues.child_lock !== confirm.childLockConfirm) {
      alert("チャイルドロックが一致しません。");
      return;
    }
    if (!confirm.consent) {
      alert("規約に同意してください。");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("内部エラー");
    }
    try {
      Promise.all([
        (async (): Promise<void> => {
          return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(
              auth,
              formValues.email,
              formValues.password
            )
              .then((res) => {
                dispatch(
                  updateUser({
                    ...formValues,
                    u_id: res.user.uid,
                    limit_time: 2147483647,
                    delete_flg: false,
                    authed: false,
                  })
                );
                dispatch(updateUid(res.user.uid));
                const redirectUrl =
                  process.env.NEXT_PUBLIC_SEND_EMAIL_REDIRECT_URL;
                sendEmailVerification(
                  res.user,
                  redirectUrl ? { url: redirectUrl } : undefined
                ).then(() => resolve());
              })
              .catch((e) => reject(e));
          });
        })(),
        // TODO:バックエンドのサインアップ処理
        // fetch(`${baseUrl}/SignUp`, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     formValues,
        //   }),
        // }),
      ]).then(() => {
        screenTransition();
      });
    } catch (e) {
      alert("作成に失敗しました");
    }
  };

  const screenTransition = () => {
    router.push("/send-email");
  };

  return (
    <div className={`${styles.container}`}>
      <form method="post" onSubmit={handleSubmit} className={`${styles.form}`}>
        <h2 className={`${styles.header}`}>サインアップ</h2>
        <div className={`${styles.name}`}>
          <div className={`${styles.lastname}`}>
            <label>
              姓名
              <input
                type="text"
                name="familyname"
                id="familyname"
                value={formValues.family_name}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    family_name: e.target.value,
                  }))
                }
                required={true}
              />
            </label>
          </div>
          <div className={`${styles.firstname}`}>
            <label>
              名前
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={formValues.first_name}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    first_name: e.target.value,
                  }))
                }
                required={true}
              />
            </label>
          </div>
        </div>
        <div className={`${styles.english_name}`}>
          <div className={`${styles.lastname}`}>
            <label>
              姓名(ローマ字)
              <input
                type="text"
                name="familynameEng"
                id="familynameEng"
                value={formValues.family_name_roma}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    family_name_roma: e.target.value,
                  }))
                }
                required={true}
              />
            </label>
          </div>
          <div className={`${styles.firstname}`}>
            <label>
              名前(ローマ字)
              <input
                type="text"
                name="firstnameEng"
                id="firstnameEng"
                value={formValues.first_name_roma}
                onChange={(e) =>
                  setFormValues((val) => ({
                    ...val,
                    first_name_roma: e.target.value,
                  }))
                }
                required={true}
              />
            </label>
          </div>
        </div>
        <div className={`${styles.account}`}>
          <label>
            アカウント名
            <input
              type="text"
              name="username"
              id="username"
              value={formValues.account_name}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  account_name: e.target.value,
                }))
              }
              required={true}
            />
          </label>
        </div>
        <div className={`${styles.email}`}>
          <label>
            メールアドレス
            <input
              type="text"
              name="email"
              id="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  email: e.target.value,
                }))
              }
              required={true}
            />
          </label>
        </div>
        <div className={`${styles.password}`}>
          <label>
            パスワード
            <input
              type={isHiddenPass.pass ? "password" : "text"}
              name="password"
              id="password"
              value={formValues.password}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  password: e.target.value,
                }))
              }
              required={true}
            />
            <span
              onClick={() => setIsHiddenPass((v) => ({ ...v, pass: !v.pass }))}
              role="presentation"
            >
              <FontAwesomeIcon icon={isHiddenPass.pass ? faEyeSlash : faEye} />
            </span>
          </label>
        </div>
        <div className={`${styles.password}`}>
          <label>
            確認用
            <input
              type={isHiddenPass.check ? "password" : "text"}
              name="passwordConfirmation"
              id="passwordConfirmation"
              value={confirm.passwordConfirm}
              onChange={(e) =>
                setConfirm((val) => ({
                  ...val,
                  passwordConfirm: e.target.value,
                }))
              }
              required={true}
            />
            <span
              onClick={() =>
                setIsHiddenPass((v) => ({ ...v, check: !v.check }))
              }
              role="presentation"
            >
              <FontAwesomeIcon icon={isHiddenPass.check ? faEyeSlash : faEye} />
            </span>
          </label>
        </div>
        <div className={`${styles.password}`}>
          <label>
            チャイルドロック
            <input
              type={isHiddenChildLock.pass ? "password" : "text"}
              name="child_lock"
              id="child_lock"
              value={formValues.child_lock}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  child_lock: e.target.value,
                }))
              }
              required={true}
            />
            <span
              onClick={() =>
                setIsHiddenChildLock((v) => ({ ...v, pass: !v.pass }))
              }
              role="presentation"
            >
              <FontAwesomeIcon
                icon={isHiddenChildLock.pass ? faEyeSlash : faEye}
              />
            </span>
          </label>
          <p>設定画面を開く際に必要になります。</p>
          <p>設定画面よりプレイ時間等が確認できます。</p>
        </div>
        <div className={`${styles.password}`}>
          <label>
            チャイルドロック確認用
            <input
              type={isHiddenChildLock.check ? "password" : "text"}
              name="child_lockConfirmation"
              id="child_lockConfirmation"
              value={confirm.childLockConfirm}
              onChange={(e) =>
                setConfirm((val) => ({
                  ...val,
                  childLockConfirm: e.target.value,
                }))
              }
              required={true}
            />
            <span
              onClick={() =>
                setIsHiddenChildLock((v) => ({ ...v, check: !v.check }))
              }
              role="presentation"
            >
              <FontAwesomeIcon
                icon={isHiddenChildLock.check ? faEyeSlash : faEye}
              />
            </span>
          </label>
        </div>
        <div className={`${styles.checkbox}`}>
          <label>
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={confirm.consent}
              onChange={(e) =>
                setConfirm((val) => ({
                  ...val,
                  consent: !val.consent,
                }))
              }
            />
          </label>
          <p>規約に同意する</p>
        </div>
        <div className={`${styles.submit_button_field}`}>
          <button className={`${styles.submit_button}`} type="submit">
            新規会員登録
          </button>
        </div>
      </form>
    </div>
  );
};
