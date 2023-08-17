import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateUser } from "@/store/user";
import { endpoint } from "@/features/api";
import {
  UpdateUserRequest,
  UpdateUserResponse,
} from "@/features/auth/types/updateUser";

import styles from "./index.module.scss";

export const AccountInfoEdit = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((store: RootState) => store.user);
  const [formValues, setFormValues] = useState({ ...userData! });

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      alert("更新に失敗しました");
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <main>
      <form onSubmit={onSubmitHandler}>
        <div>
          <label>
            姓名
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
            名前
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
            姓名（ローマ字）
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
            名前（ローマ字）
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
            アカウント名
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
            チャイルドロック
            <input
              type="text"
              value={formValues.child_lock}
              onChange={(e) =>
                setFormValues((v) => ({ ...v, child_lock: e.target.value }))
              }
            />
          </label>
        </div>
        <button type="button" onClick={() => router.back()}>
          戻る
        </button>
        <button type="submit">変更</button>
        <Link href={"/password-change"} target={"_blank"}>
          パスワードの変更はこちら
        </Link>
      </form>
    </main>
  );
};
