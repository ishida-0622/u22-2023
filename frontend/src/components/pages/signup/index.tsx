import { useState } from "react";
import { useRouter } from "next/router";
import  styles  from "./index.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

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
    <div className={`${styles.content}`}>
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
          </div>
          <div className={`${styles.firstname}`}>
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
            </div>
            <div className={`${styles.firstname}`}>
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
            </div>
          </div>
          <div>
            <label className={`${styles.account}`}>
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
          </div>
          <div>
            <label className={`${styles.email}`}>
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
          <div>
            <label className={`${styles.password}`}>
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
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </label>
          </div>
          <div>
            <label className={`${styles.password}`}>
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
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </label>
          </div>
        <div>
          <label className={`${styles.password}`}>
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
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </span>
            <p>設定画面を開く際に必要になります。</p>
            <p>設定画面よりプレイ時間等が確認できます。</p>
          </label>
        </div>
        <div>
          <label className={`${styles.password}`}>
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
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </span>
          </label>
        </div>
        <div>
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
        </div>
        <div>
          <button type="submit">新規会員登録</button>
        </div>
      </form>
    </div>
  );
};
