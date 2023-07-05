import { useRouter } from "next/router";
import styles from "./index.module.scss";

export const Menubar = () => {
  const router = useRouter();

  return (
    <div className={``}>
      <button className={``} onClick={() => router.push("/")}>
        トップ
      </button>
      <button className={``} onClick={() => router.push("/puzzle/select")}>
        パズル
      </button>
      <button className={``} onClick={() => router.push("/book/select")}>
        えほん
      </button>
    </div>
  );
};
