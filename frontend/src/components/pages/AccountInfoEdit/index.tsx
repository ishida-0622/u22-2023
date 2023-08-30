import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateUser } from "@/store/user";
import { endpoint } from "@/features/api";
import { childLockCheck } from "@/features/auth/validation/childLockCheck";
import { romaNameCheck } from "@/features/auth/validation/romaNameCheck";
import {
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/features/auth/types/updateUser";
import { BackButton } from "@/components/elements/BackButton";

import styles from "./index.module.scss";

export const AccountInfoEdit = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((store: RootState) => store.user);
  const [formValues, setFormValues] = useState({ ...userData! });
  const isActive = useRef(true);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isActive.current) {
      console.warn("submit is deactive");
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

    isActive.current = false;

    const req: UpdateUserRequest = formValues;
    try {
      const res = await fetch(`${endpoint}/UpdateUser`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: UpdateUserResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      dispatch(updateUser(formValues));
      alert("更新しました");
    } catch (error) {
      console.error(error);
      isActive.current = true;
      alert("更新に失敗しました");
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={`${styles.back_ground}`}></div>
      <form onSubmit={onSubmitHandler}>
        <div>
          <label>
            <span>姓名</span>
            <input
              type="text"
              value={formValues.family_name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, family_name: e.target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            <span>名前</span>
            <input
              type="text"
              value={formValues.first_name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, first_name: e.target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            <span>姓名（ローマ字）</span>
            <input
              type="text"
              value={formValues.family_name_roma}
              onChange={(e) =>
                setFormValues((v) => ({
                  ...v,
                  family_name_roma: e.target.value,
                }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            <span>名前（ローマ字）</span>
            <input
              type="text"
              value={formValues.first_name_roma}
              onChange={(e) =>
                setFormValues((v) => ({
                  ...v,
                  first_name_roma: e.target.value,
                }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            <span>アカウント名</span>
            <input
              type="text"
              value={formValues.account_name}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, account_name: e.target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label>
            <span>チャイルドロック</span>
            <input
              type="text"
              value={formValues.child_lock}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, child_lock: e.target.value }))
              }
            />
          </label>
        </div>
        <div className={styles.button_field}>
          <div className={styles.back_button_field}>
            <BackButton />
          </div>
          <div className={styles.edit_button_field}>
            <button type="submit" className={styles.edit_button}>
              変更
            </button>
          </div>
        </div>
        <br />
        <div className={styles.link}>
          <Link href={"/password-change"} target={"_blank"}>
            パスワードの変更はこちら
          </Link>
        </div>
      </form>
    </main>
  );
};
