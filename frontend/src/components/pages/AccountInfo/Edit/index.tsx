import { useState } from "react";

export const Edit = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    password_check: "",
    child_lock: "",
    child_lock_check: "",
  });

  return (
    <main>
      <form>
        <label>
          メールアドレス
          <br />
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={(e) => {
              setFormValues((val) => ({ ...val, email: e.target.value }));
            }}
          />
        </label>
        <br />
        <label>
          パスワード
          <br />
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={(e) => {
              setFormValues((val) => ({ ...val, password: e.target.value }));
            }}
          />
        </label>
        <br />
        <label>
          確認用
          <br />
          <input
            type="password"
            name="password_check"
            value={formValues.password_check}
            onChange={(e) => {
              setFormValues((val) => ({
                ...val,
                password_check: e.target.value,
              }));
            }}
          />
        </label>
        <br />
        <label>
          チャイルドロック
          <br />
          <input
            type="password"
            name="child_lock"
            value={formValues.child_lock}
            onChange={(e) => {
              setFormValues((val) => ({ ...val, child_lock: e.target.value }));
            }}
          />
        </label>
        <br />
        <label>
          確認用
          <br />
          <input
            type="password"
            name="child_lock_check"
            value={formValues.child_lock_check}
            onChange={(e) => {
              setFormValues((val) => ({
                ...val,
                child_lock_check: e.target.value,
              }));
            }}
          />
        </label>
        <br />
        <button type="button">変更しない</button>
        <button type="submit">変更を確定する</button>
      </form>
    </main>
  );
};
