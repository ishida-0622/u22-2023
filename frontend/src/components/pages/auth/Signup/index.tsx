import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import { auth } from "@/features/auth/firebase";
import { updateUid, updateUser, updateEmail } from "@/store/user";
import { endpoint } from "@/features/api";
import { childLockCheck } from "@/features/auth/validation/childLockCheck";
import { romaNameCheck } from "@/features/auth/validation/romaNameCheck";
import { SignUpRequest, SignUpResponse } from "@/features/auth/types/signup";

import styles from "./index.module.scss";

export const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formValues, setFormValues] = useState<SignUpRequest>({
    u_id: "",
    family_name: "",
    first_name: "",
    family_name_roma: "",
    first_name_roma: "",
    account_name: "",
    child_lock: "",
  });

  const [confirm, setConfirm] = useState({
    passwordConfirm: "",
    consent: false,
  });

  const [isHiddenPass, setIsHiddenPass] = useState({ pass: true, check: true });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirm.passwordConfirm) {
      alert("パスワードが一致しません。");
      return;
    }
    if (!confirm.consent) {
      alert("規約に同意してください。");
      return;
    }

    if (
      !(
        romaNameCheck(formValues.family_name_roma) &&
        romaNameCheck(formValues.first_name_roma)
      )
    ) {
      alert("ローマ字の入力欄が不正です");
      return;
    }

    if (!childLockCheck(formValues.child_lock)) {
      alert("チャイルドロックは数字4桁にしてください");
      return;
    }

    try {
      const user = (await createUserWithEmailAndPassword(auth, email, password))
        .user;
      dispatch(
        updateUser({
          ...formValues,
          u_id: user.uid,
          limit_time: 1440,
          delete_flg: false,
        })
      );
      dispatch(updateUid(user.uid));
      dispatch(updateEmail(user.email));
      const req: SignUpRequest = {
        ...formValues,
        u_id: user.uid,
      };

      const res = await fetch(`${endpoint}/SignUp`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: SignUpResponse = await res.json();
      if (json.response_status === "fail") {
        dispatch(updateUid(null));
        dispatch(updateUser(null));
        dispatch(updateEmail(null));
        await deleteUser(user);
        throw new Error(json.error);
      }

      const redirectUrl = process.env.NEXT_PUBLIC_SEND_EMAIL_REDIRECT_URL;
      sendEmailVerification(
        user,
        redirectUrl ? { url: redirectUrl } : undefined
      );

      screenTransition();
    } catch (e) {
      console.error(e);
      alert("作成に失敗しました");
    }
  };

  const screenTransition = () => {
    router.push("/send-email");
  };

  return (
    <div className={`${styles.container}`}>
      <h2 className={`${styles.header}`}>サインアップ</h2>
      <hr />
      <form method="post" onSubmit={handleSubmit} className={`${styles.form}`}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              type="text"
              name="child_lock"
              inputMode="numeric"
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
          </label>
          <p>設定画面を開く際に必要になります。</p>
          <p>設定画面よりプレイ時間等が確認できます。</p>
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
