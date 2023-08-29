import { useEffect } from "react";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateEmail, updateUid, updateUser } from "@/store/user";

import { isLogin } from "@/features/auth/utils/isLogin";
import { getLoginUser } from "@/features/auth/utils/getLoginUser";
import { endpoint } from "@/features/api";

import {
  ScanUserRequest,
  ScanUserResponse,
} from "@/features/auth/types/scanUser";

export const LoginStatusWatch = () => {
  const router = useRouter();
  const { route } = router;

  const dispatch = useDispatch();
  const uid = useSelector((store: RootState) => store.uid);
  const email = useSelector((store: RootState) => store.email);
  const user = useSelector((store: RootState) => store.user);

  const NO_LOGIN_REQUIRED = [
    "/login",
    "/signup",
    "/password-reset",
    "/send-email",
    "/registration-success",
  ] as const;

  const isAdminPage = /^\/admin/.test(route);

  const isNoLoginRequired = NO_LOGIN_REQUIRED.some((r) => r === route);

  const dataFetch = async () => {
    const firebaseUser = (await getLoginUser())!;
    dispatch(updateUid(firebaseUser.uid));
    dispatch(updateEmail(firebaseUser.email));

    const userDataFetcher = async (): Promise<void> =>
      new Promise((resolve, reject) => {
        const req: ScanUserRequest = { u_id: firebaseUser.uid };
        fetch(`${endpoint}/ScanUser`, {
          method: "POST",
          body: JSON.stringify(req),
        }).then((res) => {
          res.json().then((json: ScanUserResponse) => {
            if (json.response_status === "fail") {
              reject(json.error);
            }
            dispatch(updateUser(json.result));
            resolve();
          });
        });
      });

    await userDataFetcher();
  };

  const toLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    isLogin().then((res) => {
      if (res) {
        if (isAdminPage) {
          const reg = new RegExp(process.env.NEXT_PUBLIC_ADMIN_REGEXP ?? "^$");
          getLoginUser().then((u) => {
            if (!(u?.email && reg.test(u.email))) {
              router.push("/");
            }
          });
        } else if (!(uid && email && user)) {
          dataFetch();
        }
      } else {
        if (!isNoLoginRequired) {
          toLogin();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return <></>;
};
