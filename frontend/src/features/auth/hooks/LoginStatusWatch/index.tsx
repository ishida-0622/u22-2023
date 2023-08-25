import { useEffect } from "react";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  updateEmail,
  updateGameStatus,
  updateUid,
  updateUser,
} from "@/store/user";

import { isLogin } from "@/features/auth/utils/isLogin";
import { getLoginUser } from "@/features/auth/utils/getLoginUser";
import { endpoint } from "@/features/api";

import {
  ScanUserRequest,
  ScanUserResponse,
} from "@/features/auth/types/scanUser";
import {
  GetStatusRequest,
  GetStatusResponse,
} from "@/features/auth/types/getStatus";

export const LoginStatusWatch = () => {
  const router = useRouter();
  const { route } = router;

  const dispatch = useDispatch();
  const uid = useSelector((store: RootState) => store.uid);
  const email = useSelector((store: RootState) => store.email);
  const user = useSelector((store: RootState) => store.user);
  const status = useSelector((store: RootState) => store.gameStatus);

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

    const userStatusFetcher = async (): Promise<void> =>
      new Promise((resolve, reject) => {
        const req: GetStatusRequest = { u_id: firebaseUser.uid };
        fetch(`${endpoint}/ScanStatus`, {
          method: "POST",
          body: JSON.stringify(req),
        }).then((res) => {
          res.json().then((json: GetStatusResponse) => {
            if (json.response_status === "fail") {
              reject(json.error);
            }
            dispatch(updateGameStatus(json.result.game_status));
            resolve();
          });
        });
      });

    await Promise.all([userDataFetcher(), userStatusFetcher()]);
  };

  const toLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    isLogin().then((res) => {
      if (res) {
        if (isNoLoginRequired) {
          if (!(uid && email && user && status)) {
            dataFetch();
          }
        } else {
          if (!(uid && email && user && status)) {
            dataFetch();
          }
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
