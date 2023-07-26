import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { userSlice } from "@/store/user";
import {
  ScanUsersRequest,
  ScanUsersResponse,
} from "@/features/auth/types/scanUsers";

export const useUser = async () => {
  const dispatch = useDispatch();
  const uid = useSelector((store: RootState) => store.uid);

  if (uid === null) {
    return;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (baseUrl === undefined) {
    throw new Error("内部エラー");
  }

  try {
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
    dispatch(userSlice.actions.updateUser(userData));
  } catch (e) {
    console.error(e);
  }
};
