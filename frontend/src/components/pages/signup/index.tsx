import { useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

export const Signup = () => {
  const [formValues, setFormValues] = useState({
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
    child_lockConfirm: "",
    consent: false,
  });

  const [isHiddenPass, setIsHiddenPass] = useState(true);
  const [isHiddenchild_lock, setIsHiddenchild_lock] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formValues.password !== confirm.passwordConfirm &&
      formValues.child_lock !== confirm.child_lockConfirm
    ) {
      alert("パスワードとチャイルドロック暗証番号が一致しません。");
    } else if (formValues.child_lock !== confirm.child_lockConfirm) {
      alert("チャイルドロックが一致しません。");
    } else if (formValues.password !== confirm.passwordConfirm) {
      alert("パスワードが一致しません。");
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (baseUrl === undefined) {
        throw new Error("内部エラー");
      }
      try {
        if (confirm.consent === true) {
          const response = await fetch(`${baseUrl}/auth/signup`, {
            method: "POST",
            body: JSON.stringify({
              formValues,
            }),
          });
          ScreenTransition();
        } else {
          alert("規約に同意してください。");
        }
      } catch (e) {
        alert("作成に失敗しました");
      }
    }
  };

  const router = useRouter();

  const ScreenTransition = () => {
    router.push("/MessagesentSuccessfully");
  };

  return (
    <div>
      <h2>サインアップ</h2>
      <hr />
      <form method="post" onSubmit={handleSubmit}>
        <div>
          <label>
            姓名
            <input
              type="text"
              name="family_name"
              id="family_name"
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
          <label>
            名前
            <input
              type="text"
              name="first_name"
              id="first_name"
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

          <label>
            姓名(ローマ字)
            <input
              type="text"
              name="family_name_roma"
              id="family_name_roma"
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

          <label>
            名前(ローマ字)
            <input
              type="text"
              name="first_name_roma"
              id="first_name_roma"
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

          <label>
            アカウント名
            <input
              type="text"
              name=" account_name"
              id=" account_name"
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

          <label>
            パスワード
            <input
              type={isHiddenPass ? "password" : "text"}
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
              onClick={() => setIsHiddenPass((v) => !v)}
              role="presentation"
            >
              {isHiddenPass ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </span>
          </label>

          <label>
            確認用
            <input
              type={"password"}
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
          </label>
        </div>
        <div>
          <label>
            チャイルドロック
            <input
              type={isHiddenchild_lock ? "password" : "text"}
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
              onClick={() => setIsHiddenchild_lock((v) => !v)}
              role="presentation"
            >
              {isHiddenchild_lock ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </span>
            <p>設定画面を開く際に必要になります。</p>
            <p>設定画面よりプレイ時間等が確認できます。</p>
          </label>

          <label>
            チャイルドロック確認用
            <input
              type={"password"}
              name="child_lockConfirmation"
              id="child_lockConfirmation"
              value={confirm.child_lockConfirm}
              onChange={(e) =>
                setConfirm((val) => ({
                  ...val,
                  child_lockConfirm: e.target.value,
                }))
              }
              required={true}
            />
          </label>

          <label>
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={confirm.consent}
              onChange={(e) =>
                setConfirm((val) => ({
                  ...val,
                  consent: true,
                }))
              }
            />
            規約に同意する
          </label>

          <button type="submit">新規会員登録</button>
        </div>
      </form>
    </div>
  );
};
