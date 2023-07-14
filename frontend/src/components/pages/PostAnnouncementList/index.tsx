import { useState } from "react";
import styles from "./index.module.scss";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

export const PostAnnouncementList = () => {
  const [posts, setPosts] = useState([
    {
      n_id: "n_id1",
      title: "title1",
      content: "content1",
      create_date: "2023-07-13T16:20:59Z",
    },
    {
      n_id: "n_id2",
      title: "title2",
      content: "content2",
      create_date: "2023-07-30T16:21:59Z",
    },
  ]);

  //モーダルウィンドウの表示/非表示を表すbool値を宣言
  const [modalIsOpen, setModalIsOpen] = useState(false);
  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => setModalIsOpen(false);

  const detail = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openModal();
  };

  const router = useRouter();
  const postannouncement = () => {
    router.push("/admin/post-announcement");
  };

  return (
    <main>
      {posts.map((post) => (
        <div key={post.n_id} className={`${styles.posts}`}>
          <h3>
            {post.title}
            <button onClick={detail}>
              <FontAwesomeIcon icon={faBell} />
            </button>
          </h3>
        </div>
      ))}
      <div>
        <button onClick={postannouncement}>新規作成</button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        {posts.map((post) => (
          <div key={post.n_id} className={`${styles.posts}`}>
            <div>題名:「{post.title}」</div>
            <div>投稿内容：「{post.content}」</div>
          </div>
        ))}
      </Modal>
    </main>
  );
};
