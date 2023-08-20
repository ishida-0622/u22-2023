import Link from "next/link";
import styles from "./index.module.scss";

export const AdminMenubar = () => {
  return (
    <div className={`${styles.dropdown}`}>
      <div className={`${styles.menu}`}>
        <div className={`${styles.menu_title}`}>menu</div>
        <div className={`${styles.sub_menu}`}>
          <ul>
            <li>
              <Link href={`/admin`}>トップ</Link>
            </li>
            <li>
              <Link href={`/admin/notice`}>お知らせ</Link>
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
