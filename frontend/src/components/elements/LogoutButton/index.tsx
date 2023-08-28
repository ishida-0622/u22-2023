import { logout } from "@/features/auth/utils/logout";
import styles from "./index.module.scss";

export const BackButton = () => {
  return <button onClick={logout}></button>;
};
