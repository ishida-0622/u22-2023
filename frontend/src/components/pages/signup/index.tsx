import { useState } from "react";
import { useRouter } from "next/router";

export const Signup = () => {
  const [formValues, setFormValues] = useState({
    familyname: "",
    firstname: "",
    familynameEng: "",
    firstnameEng: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    child: "",
    childConfirm: "",
    consent: false,
  });

  const [isHidden, setIsHidden] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      formValues.password !== formValues.passwordConfirm &&
      formValues.child !== formValues.childConfirm
    ) {
      alert("パスワードとチャイルドロック暗証番号が一致しません。");
    } else if (formValues.child !== formValues.childConfirm) {
      alert("チャイルドロックが一致しません。");
    } else if (formValues.password !== formValues.passwordConfirm) {
      alert("パスワードが一致しません。");
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (baseUrl === undefined) {
        throw new Error("内部エラー");
      }
      try {
        if (formValues.consent === true) {
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
    router.push("/login");
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
              name="familyname"
              id="familyname"
              value={formValues.familyname}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  familyname: e.target.value,
                }))
              }
              required={true}
            />
          </label>
          <label>
            名前
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={formValues.firstname}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  firstname: e.target.value,
                }))
              }
              required={true}
            />
          </label>

          <label>
            姓名(ローマ字)
            <input
              type="text"
              name="familynameEng"
              id="familynameEng"
              value={formValues.familynameEng}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  familynameEng: e.target.value,
                }))
              }
              required={true}
            />
          </label>

          <label>
            名前(ローマ字)
            <input
              type="text"
              name="firstnameEng"
              id="firstnameEng"
              value={formValues.firstnameEng}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  firstnameEng: e.target.value,
                }))
              }
              required={true}
            />
          </label>

          <label>
            アカウント名
            <input
              type="text"
              name="username"
              id="username"
              value={formValues.username}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  username: e.target.value,
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
            <select name="emailtype">
              <option value="icloud">@icloud.com</option>
            </select>
          </label>

          <label>
            パスワード
            <input
              type={isHidden ? "password" : "text"}
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
            <span onClick={() => setIsHidden((v) => !v)} role="presentation">
              {isHidden ? (
                <i className="fas fa-eye-slash" />
              ) : (
                <i className="fas fa-eye" />
              )}
            </span>
          </label>

          <label>
            確認用
            <input
              type={isHidden ? "password" : "text"}
              name="passwordConfirmation"
              id="passwordConfirmation"
              value={formValues.passwordConfirm}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  passwordConfirm: e.target.value,
                }))
              }
              required={true}
            />
            <span onClick={() => setIsHidden((v) => !v)} role="presentation">
              {isHidden ? (
                <i className="fas fa-eye-slash" />
              ) : (
                <i className="fas fa-eye" />
              )}
            </span>
          </label>
        </div>
        <div>
          <label>
            チャイルドロック
            <input
              type={isHidden ? "password" : "text"}
              name="child"
              id="child"
              value={formValues.child}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  child: e.target.value,
                }))
              }
              required={true}
            />
            <span onClick={() => setIsHidden((v) => !v)} role="presentation">
              {isHidden ? (
                <i className="fas fa-eye-slash" />
              ) : (
                <i className="fas fa-eye" />
              )}
            </span>
            <p>設定画面を開く際に必要になります。</p>
            <p>設定画面よりプレイ時間等が確認できます。</p>
          </label>

          <label>
            チャイルドロック確認用
            <input
              type={isHidden ? "password" : "text"}
              name="childConfirmation"
              id="childConfirmation"
              value={formValues.childConfirm}
              onChange={(e) =>
                setFormValues((val) => ({
                  ...val,
                  childConfirm: e.target.value,
                }))
              }
              required={true}
            />
            <span onClick={() => setIsHidden((v) => !v)} role="presentation">
              {isHidden ? (
                <i className="fas fa-eye-slash" />
              ) : (
                <i className="fas fa-eye" />
              )}
            </span>
          </label>

          <label>
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formValues.consent}
              onChange={(e) =>
                setFormValues((val) => ({
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
