import { getLoginUser } from "@/features/auth/utils/getLoginUser";

export const getIdToken = (): Promise<string | null> => {
  return new Promise((resolve) => {
    getLoginUser().then((user) => {
      if (user) {
        user.getIdToken().then((token) => resolve(token));
      } else {
        resolve(null);
      }
    });
  });
};
