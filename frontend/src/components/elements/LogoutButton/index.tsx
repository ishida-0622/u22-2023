import { logout } from "@/features/auth/utils/logout";
import styles from "./index.module.scss";

export const LogoutButton = () => {
  return <button onClick={logout} className={`${styles.logout_button}`}>ログアウト</button>;
};
