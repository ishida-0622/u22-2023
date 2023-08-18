import { useLayoutEffect, useState } from "react";
import styles from "./index.module.scss";
import { AdminMenubar } from "@/components/elements/AdminMenubar";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Puzzle } from "@/features/puzzle/types";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import { DeletePuzzleRequest } from "@/features/puzzle/types/delete";
import { DeletePuzzleResponse } from "@/features/puzzle/types/delete";
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

  const router = useRouter();

  // 詳細画面を表示する関数
  const detail = (event: React.MouseEvent<HTMLButtonElement>, post: Puzzle) => {
    event.preventDefault();
    setPuzzle(post);
    openModal();
  };

  //検索欄への入力値をハンドリング
  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    search(event.target.value);
  };

  //検索欄への入力値での絞り込み
  const search = (value: string) => {
    if (value === "") {
      setPosts(allPosts);
      return;
    }
    value = input;
    const reg = new RegExp(value.toUpperCase(), "i");
    const searchedPosts = allPosts.filter((post) => reg.test(post.title));
    setPosts(searchedPosts);
  };

  // 削除メソッド
  const deletePuzzle = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (baseUrl === undefined) {
      throw new Error("api endpoint is undefined");
    }
    const req: DeletePuzzleRequest = {
      p_id: id,
    };
    try {
      const res = await fetch(`${baseUrl}/DeletePuzzle`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: DeletePuzzleResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      router.reload();
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  // 編集画面へのrouter
  const edit = () => {
    router.push({
      pathname: "/admin/puzzle/edit/[id]",
      query: { id: puzzle === undefined ? undefined : puzzle.p_id },
    });
  };

  // 新規作成画面へのrouter
  const postPuzzle = () => {
    router.push("/admin/register-puzzle");
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
      } catch (e) {
        alert("データの取得に失敗しました");
        console.error(e);
      }
    };
    pullPuzzle();
  }, []);

  return (
    <main className={`${styles.container}`}>
      <h2>パズル問題管理</h2>
      <div className={`${styles.adminmenubar}`}>
        <AdminMenubar />
      </div>
      <hr />
      <div className={`${styles.search}`}>
        <input
          type="text"
          placeholder="検索"
          value={input}
          onChange={changeSearch}
        />
      </div>

      <div className={`${styles.posts_container}`}>
        {posts.map((post) => (
          <div
            key={post.title + post.create_date}
            className={`${styles.posts}`}
          >
            <h3>
              {post.title}
              <button onClick={(e) => detail(e, post)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                onClick={() => {
                  if (confirm("削除しますか?")) {
                    deletePuzzle(post.p_id);
                  }
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </h3>
            <hr />
          </div>
        ))}
      </div>
      <div className={`${styles.submit_button_field}`}>
        <button className={`${styles.submit_button}`} onClick={postPuzzle}>
          新規作成
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className={`${styles.posts_open}`}>
          {puzzle && (
            <main>
              <div>
                <b>題名:</b>「{puzzle.title}」
              </div>
              <div>
                <b>概要：</b>「{puzzle.description}」
              </div>
              <div>
                <b>アイコン：</b>
                <Image src={puzzle.icon} alt="icon" width={150} height={100} />
              </div>
              <div>
                <b>問題：</b>
                {puzzle.words.map((word) => (
                  <div key={word.word}>
                    <p>単語：{word.word}</p>
                    <p>シルエット：</p>
                    <Image
                      src={word.shadow}
                      alt={`${word.word} shadow`}
                      width={150}
                      height={100}
                    />
                    <p>イラスト：</p>
                    <Image
                      src={word.illustration}
                      alt={`${word.word} illust`}
                      width={150}
                      height={100}
                    />
                    <p>音声：</p>
                    <audio controls src={word.voice} />
                    <hr />
                  </div>
                ))}
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
