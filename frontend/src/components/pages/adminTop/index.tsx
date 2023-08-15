import { useRouter } from "next/router";
import styles from "./index.module.scss";

export const Top = () => {
  const router = useRouter();

  const logout = () => {
    router.push("/login");
  };

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
    router.push("/admin/news");
  };

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.top_line}`}>
        <p className={`${styles.title}`}>admin Top</p>
        <div className={`${styles.logout}`}>
          <button className={`${styles.submit_button}`} onClick={logout}>ログアウト</button>
        </div>
      </div>
      <div className={`${styles.menu}`}>
        <div className={`${styles.first_line}`}>
          <div className={`${styles.book}`}>
            <button className={`${styles.submit_button}`} onClick={book}>本棚</button>
          </div>
          <div className={`${styles.question}`}>
            <button className={`${styles.submit_button}`} onClick={puzzle}>問題</button>
          </div>
        </div>
        <div className={`${styles.second_line}`}>
          <div className={`${styles.seal}`}>
            <button className={`${styles.submit_button}`} onClick={sticker}>シール</button>
          </div>
          <div className={`${styles.announcement}`}>
            <button className={`${styles.submit_button}`} onClick={news}>お知らせ</button>
          </div>
        </div>
      </div>
    </div>
  );
};
