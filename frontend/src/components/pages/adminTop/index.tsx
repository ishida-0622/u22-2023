import { useRouter } from "next/router";

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
    <div>
      <div>
        <button onClick={logout}>ログアウト</button>
      </div>
      <div>
        <div>
          <button onClick={book}>本棚</button>
        </div>
        <div>
          <button onClick={puzzle}>問題</button>
        </div>
        <div>
          <button onClick={sticker}>シール</button>
        </div>
        <div>
          <button onClick={news}>お知らせ</button>
        </div>
      </div>
    </div>
  );
};
