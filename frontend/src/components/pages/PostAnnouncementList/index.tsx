import { useLayoutEffect, useState } from "react";
import styles from "./index.module.scss";
import { AdminMenubar } from "@/components/elements/AdminMenubar";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notice } from "@/features/notice/types";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { GetAllNoticeResponse } from "@/features/notice/types/get";
import { DeleteBookRequest } from "@/features/book/types/delete";
import {
  DeleteNoticeRequest,
  DeleteNoticeResponse,
} from "@/features/notice/types/delete";

Modal.setAppElement("#__next");

export const PostAnnouncementList = () => {
  const [posts, setPosts] = useState<Notice[]>([]);
  const [news, setNews] = useState<Notice>();

  //モーダルウィンドウの表示/非表示を表すbool値を宣言
  const [modalIsOpen, setModalIsOpen] = useState(false);
  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => setModalIsOpen(false);

  // 詳細画面を表示する関数
  const detail = (event: React.MouseEvent<HTMLButtonElement>, post: Notice) => {
    event.preventDefault();
    setNews(post);
    openModal();
  };

  // 新規作成ページへのrouter
  const router = useRouter();
  const postAnnouncement = () => {
    router.push("/admin/post-announcement");
  };

  // 削除メソッド
  const deleteNotice = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("api endpoint is undefined");
    }
    const req: DeleteNoticeRequest = {
      n_id: id,
    };
    try {
      const res = await fetch(`${baseUrl}/DeleteNotice`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: DeleteNoticeResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      router.reload();
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  useLayoutEffect(() => {
    const pullAnnouncement = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (baseUrl === undefined) {
        throw new Error("内部エラー");
      }
      try {
        const response = await fetch(`${baseUrl}/GetNotices`, {
          method: "POST",
          body: JSON.stringify({}),
        });
        const data: GetAllNoticeResponse = await response.json();
        setPosts(data.result);
      } catch (e) {
        alert("データの取得に失敗しました");
        console.error(e);
      }
    };
    pullAnnouncement();
  }, []);

  return (
    <main className={`${styles.container}`}>
      <h1>お知らせ管理</h1>
      <div className={`${styles.adminmenubar}`}>
        <AdminMenubar />
      </div>
      <h2>お知らせ投稿一覧</h2>
      <div className={`${styles.posts}`}>
        {posts.map((post) => (
          <div key={post.n_id}>
            <h3>
              {post.title}
              <div className={`${styles.posts_button}`}>
                <button onClick={(e) => detail(e, post)}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("削除しますか?")) {
                      deleteNotice(post.n_id);
                    }
                  }}
                >
                <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </h3>
            <hr />
          </div>
        ))}
      </div>
      <div className={`${styles.submit_button_field}`}>
        <button
          className={`${styles.submit_button}`}
          onClick={postAnnouncement}
        >
          新規作成
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className={`${styles.posts_open}`}>
          {news && (
            <div>
              <b>題名:</b>「{news.title}」
            </div>
          )}
          {news && (
            <div>
              <b>投稿内容：</b>「{news.content}」
            </div>
          )}
        </div>
        <div className={`${styles.submit_button_field_open}`}>
          <button onClick={closeModal}>CLOSE</button>
        </div>
      </Modal>
    </main>
  );
};
