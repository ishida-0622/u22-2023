import { useLayoutEffect, useState } from "react";
import styles from "./index.module.scss";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Puzzle } from "@/features/puzzle/types";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import Image from "next/image";

Modal.setAppElement("#__next");

export const PuzzleList = () => {
  const [posts, setPosts] = useState<Omit<Puzzle, "p_id">[]>([]);
  const [puzzle, setPazzle] = useState<Omit<Puzzle, "p_id">>();
  //モーダルウィンドウの表示/非表示を表すbool値を宣言
  const [modalIsOpen, setModalIsOpen] = useState(false);
  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => setModalIsOpen(false);

  const detail = (
    event: React.MouseEvent<HTMLButtonElement>,
    post: Omit<Puzzle, "p_id">
  ) => {
    event.preventDefault();
    setPazzle(post);
    openModal();
  };

  const router = useRouter();
  const postpuzzle = () => {
    router.push("/admin/register-puzzle");
  };

  useLayoutEffect(() => {
    const pullpuzzle = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (baseUrl === undefined) {
        throw new Error("内部エラー");
      }
      try {
        const response = await fetch(`${baseUrl}/GetPuzzles`, {
          method: "POST",
          body: JSON.stringify({}),
        });
        const data: GetAllPuzzleResponse = await response.json();
        setPosts(data.result);
        console.log(data.result);
      } catch (e) {
        alert("データの取得に失敗しました");
        console.error(e);
      }
    };
    pullpuzzle();
  }, []);

  return (
    <main>
      <div>
        <input type="text" placeholder="検索" />
      </div>
      {posts.map((post) => (
        <div key={post.title} className={`${styles.posts}`}>
          <h3>
            {post.title}
            <button onClick={(e) => detail(e, post)}>
              <FontAwesomeIcon icon={faPen} />
            </button>
          </h3>
        </div>
      ))}
      <div>
        <button onClick={postpuzzle}>
          新規作成
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className={`${styles.posts}`}>
          {puzzle && (
            <main>
              <div>
                <b>題名:</b>「{puzzle.title}」
              </div>
              <div>
                <b>概要：</b>「{puzzle.description}」
              </div>
              <div>
                <b>アイコン写真のURI：</b>「{puzzle.icon}」
              </div>
              <div>
                <b>アイコン写真：</b>「
                <Image src={puzzle.icon} alt="" width={150} height={100} />」
              </div>
              <div>
                <b>問題：</b>「
                {puzzle.words.map((word) => (
                  <div>
                    <p>単語：{word.word}</p>
                    <p>シルエットのURI：{word.shadow}</p>
                    <Image src={word.shadow} alt="" width={150} height={100} />
                    <p>イラストのURI：{word.illustration}</p>
                    <Image
                      src={word.illustration}
                      alt=""
                      width={150}
                      height={100}
                    />
                    <p>{word.voice}</p>
                    <audio controls src={word.voice} />

                    {/* <p>{word.is_displayed}</p>
                    <p>{word.is_dummy}</p> */}

                    <hr />
                  </div>
                ))}
                」
              </div>
              <div>
                <b>作成日：</b>「{puzzle.create_date}」
              </div>
              <div>
                <b>更新日：</b>「{puzzle.update_date}」
              </div>
            </main>
          )}
        </div>
        <div>
          <button onClick={closeModal}>CLOSE</button>
        </div>
      </Modal>
    </main>
  );
};
