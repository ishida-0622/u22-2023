import { useRouter } from "next/router";
import styles from "./index.module.scss"

export const RegistrationSuccessful = () => {
  const router = useRouter();

  const PageTransition = () => {
    router.push("/login");
  };

  const handleSubmit = async () => {
    PageTransition();
  };

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.child}`}>
        <p>登録が完了しました</p>
      <div className={`${styles.submit_button_field}`}>
        <button type="submit" onClick={handleSubmit} className={`${styles.submit_button}`} >
          ログインする
        </button>
        </div>
      </div>
    </div>
  );
};
