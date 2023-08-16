import { useRouter } from "next/router";
import styles from "./index.module.scss";

export const Menubar = () => {
  const router = useRouter();

  return (
    <div className={`${styles.bar}`}>
      <button className={`${styles.top}`} onClick={() => router.push("/")}>
        トップ
      </button>
      <button
        className={`${styles.puzzle}`}
        onClick={() => router.push("/puzzle/select")}
      >
        パズル
      </button>
      <button
        className={`${styles.book}`}
        onClick={() => router.push("/book/select")}
      >
        えほん
      </button>
    </div>
  );
};
