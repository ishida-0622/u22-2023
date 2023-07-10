import styles from "./index.module.scss";
import Link from "next/link";

export const AdminMenubar = () => {
  return (
    <div className={`${styles.dropdown}`}>
      <div className={`${styles.menu}`}>
        <div className={`${styles.menu_title}`}>menu</div>
        <div className={`${styles.sub_menu}`}>
          <ul>
            <li>
              <Link href={`/admin/top`}>トップ</Link>
            </li>
            <li>
              <Link href={`/admin/announcement-page`}>お知らせ</Link>
            </li>
            <li>
              <Link href={`/admin/puzzle`}>問題</Link>
            </li>
            <li>
              <Link href={`/admin/book`}>本棚</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
