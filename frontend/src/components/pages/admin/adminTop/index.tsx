import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { logout } from "@/features/auth/utils/logout";

export const Top = () => {
  const router = useRouter();

  const book = () => {
    router.push("/admin/book");
  };

  const puzzle = () => {
    router.push("/admin/puzzle");
  };

  const sticker = () => {
    router.push("/admin/sticker");
  };

  const news = () => {
    router.push("/admin/notice");
  };

  return (
    <div className={`${styles.container}`}>
      <h1 className={`${styles.title}`}>admin Top</h1>
      <div className={`${styles.menu}`}>
        <div className={`${styles.first_line}`}>
          <div className={`${styles.book}`}>
            <button className={`${styles.submit_button}`} onClick={book}>
              本棚
            </button>
          </div>
          <div className={`${styles.question}`}>
            <button className={`${styles.submit_button}`} onClick={puzzle}>
              問題
            </button>
          </div>
        </div>
        <div className={`${styles.second_line}`}>
          {/* <div className={`${styles.seal}`}>
            <button className={`${styles.submit_button}`} onClick={sticker}>
              シール
            </button>
          </div> */}
          <div className={`${styles.announcement}`}>
            <button className={`${styles.submit_button}`} onClick={news}>
              お知らせ
            </button>
          </div>
          <div className={`${styles.logout}`}>
            <button className={`${styles.logout_button}`} onClick={logout}>
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
