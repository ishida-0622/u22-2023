import { useRouter } from "next/router";

export const Top = () => {
  const router = useRouter();

  const ScreenTransition = (path) => {
    router.push(path);
  };

  return (
    <div>
      <div>
        <button onClick={() => ScreenTransition("/admin/logout")}>
          ログアウト
        </button>
      </div>
      <div>
        <div>
          <button onClick={() => ScreenTransition("/admin/book")}>本棚</button>
        </div>
        <div>
          <button onClick={() => ScreenTransition("/admin/puzzle")}>
            問題
          </button>
        </div>
        <div>
          <button onClick={() => ScreenTransition("/admin/sticker")}>
            シール
          </button>
        </div>
        <div>
          <button onClick={() => ScreenTransition("/admin/news")}>
            お知らせ
          </button>
        </div>
      </div>
    </div>
  );
};
