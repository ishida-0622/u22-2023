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
  const [allPosts, setAllPosts] = useState<Puzzle[]>([]);
  const [posts, setPosts] = useState<Puzzle[]>([]);
  const [puzzle, setPuzzle] = useState<Puzzle>();
  //モーダルウィンドウの表示/非表示を表すbool値を宣言
  const [modalIsOpen, setModalIsOpen] = useState(false);
  /** モーダルウィンドウを表示にする関数 */
  const openModal = () => setModalIsOpen(true);
  /** モーダルウィンドウを非表示にする関数 */
  const closeModal = () => setModalIsOpen(false);
  // 検索
  const [input, setInput] = useState("");

  const detail = (event: React.MouseEvent<HTMLButtonElement>, post: Puzzle) => {
    event.preventDefault();
    setPuzzle(post);
    openModal();
  };

  const router = useRouter();
  const postPuzzle = () => {
    router.push("/admin/register-puzzle");
  };

  //検索欄への入力値をハンドリング
  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    search(event.target.value);
  };

  //検索欄への入力値での絞り込み
  const search = (value = input) => {
    if (value === "") {
      setPosts(allPosts);
      return;
    }

    const reg = new RegExp(value.toUpperCase(), "i");

    const searchedPosts = allPosts.filter((post) => reg.test(post.title));

    setPosts(searchedPosts);
  };

  useLayoutEffect(() => {
    const pullPuzzle = async () => {
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
        setAllPosts(data.result);
        setPosts(data.result);
        console.log(data.result);
      } catch (e) {
        alert("データの取得に失敗しました");
        console.error(e);
      }
    };
    pullPuzzle();
  }, []);

  const edit = () => {
    router.push({
      pathname: "/admin/puzzle/edit",
      query: { id: puzzle === undefined ? undefined : puzzle.p_id },
    });
  };

  return (
    <main>
      <div>
        <input
          type="text"
          placeholder="検索"
          value={input}
          onChange={changeSearch}
        />
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
        <button onClick={postPuzzle}>
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
              <button onClick={edit}>編集</button>
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
