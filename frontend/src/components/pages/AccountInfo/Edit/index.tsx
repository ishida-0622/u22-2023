import { useState } from "react";
import styles from "@/components/pages/AccountInfo/Edit/index.module.scss"

export const Edit = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    password_check: "",
    child_lock: "",
    child_lock_check: "",
  });

  return (
    <main className={`${styles.container}`}>
      <div className={`${styles.back_ground}`}></div>
      <form>
        <label htmlFor="email"><p className={`${styles.navigation_mail}`}>メールアドレス</p></label>

        <input

          type="email"
          name="email"
          value={formValues.email}
          onChange={(e) => {
            setFormValues((val) => ({ ...val, email: e.target.value }));
          }}
        />

        <br/>

        <table>
          <tr>
            <td>
              <label htmlFor="password"><p className={`${styles.navigation}`}>パスワード</p></label>
              <input
                className={`${styles.check}`}
                type="password"
                name="password"
                value={formValues.password}
                onChange={(e) => {
                  setFormValues((val) => ({ ...val, password: e.target.value }));
                }}
              />
            </td>
            <td>
              <label htmlFor="password_check"><p className={`${styles.navigation}`}>確認用</p></label>
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
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="child_lock"><p className={`${styles.navigation}`}>チャイルドロック</p></label>
              <input
                className={`${styles.check}`}
                type="password"
                name="child_lock"
                value={formValues.child_lock}
                onChange={(e) => {
                  setFormValues((val) => ({ ...val, child_lock: e.target.value }));
                }}
              />
            </td>
            <td>
              <label htmlFor="child_lock_check"><p className={`${styles.navigation}`}>確認用</p></label>
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
            </td>
          </tr>
        </table>

        <br />

        <button className={`${styles.not_change}`} type="button">変更しない</button>
        <button className={`${styles.change}`} type="submit">変更を確定する</button>
      </form>
    </main>
  );
};
