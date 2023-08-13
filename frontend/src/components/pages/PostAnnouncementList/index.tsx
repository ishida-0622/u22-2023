import { useLayoutEffect, useState } from "react";
import styles from "./index.module.scss";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Notice } from "@/features/notice/types";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { GetAllNoticeResponse } from "@/features/notice/types/get";

Modal.setAppElement("#__next");

export const PostAnnouncementList = () => {
  const [posts, setPosts] = useState<Notice[]>([]);

  //モーダルウィンドウの表示/非表示を表すbool値を宣言
  const [modalIsOpen, setModalIsOpen] = useState(false);
  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => setModalIsOpen(false);

  const detail = (event: React.MouseEvent<HTMLButtonElement>, post: Notice) => {
    event.preventDefault();
    setNews(post);
    openModal();
  };

  const router = useRouter();
  const postAnnouncement = () => {
    router.push("/admin/post-announcement");
  };

  const [news, setNews] = useState<Notice>();

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
      <h1>お知らせ確認</h1>
      <hr></hr>
      <h2>お知らせ投稿一覧</h2>
      {posts.map((post) => (
        <div key={post.n_id} className={`${styles.posts}`}>
          <h3>
            {post.title}
            <button onClick={(e) => detail(e, post)}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </h3>
          <hr></hr>
        </div>
      ))}
      <div className={`${styles.submit_button_field}`}>
        <button className={`${styles.submit_button}`} onClick={postAnnouncement}>
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
