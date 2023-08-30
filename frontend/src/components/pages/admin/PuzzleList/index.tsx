import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Puzzle } from "@/features/puzzle/types";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import { endpoint } from "@/features/api";
import { AdminMenubar } from "@/components/elements/AdminMenubar";
import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import { DeletePuzzleRequest } from "@/features/puzzle/types/delete";
import { DeletePuzzleResponse } from "@/features/puzzle/types/delete";

import styles from "./index.module.scss";

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
    const req: DeletePuzzleRequest = {
      p_id: id,
    };
    try {
      const res = await fetch(`${endpoint}/DeletePuzzle`, {
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
    router.push("/admin/puzzle/register");
  };

  useLayoutEffect(() => {
    const pullPuzzle = async () => {
      try {
        const response = await fetch(`${endpoint}/GetPuzzles`, {
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
      <h1>パズル問題管理</h1>
      <div className={`${styles.adminmenubar}`}>
        <AdminMenubar />
      </div>
      <div className={`${styles.search}`}>
        <input
          type="text"
          placeholder="検索"
          value={input}
          onChange={changeSearch}
        />
      </div>

      <div className={`${styles.posts}`}>
        {posts.map((post) => (
          <div key={post.title + post.create_date}>
            <h3>
              {post.title}
              <div className={`${styles.puzzle_button}`}>
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
              </div>
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
        <div className={`${styles.modal}`}>
          <div className={`${styles.close_button_field}`}>
            <button className={`${styles.close_button}`} onClick={closeModal}>
              ×
            </button>
          </div>
          <div>
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
                  <Image
                    src={puzzle.icon}
                    alt="icon"
                    width={150}
                    height={100}
                  />
                </div>
                <div>
                  <b>作成日：</b>「{puzzle.create_date}」
                </div>
                <div>
                  <b>更新日：</b>「{puzzle.update_date}」
                </div>
                <div className={`${styles.edit_button_field}`}>
                  <button className={`${styles.edit_button}`} onClick={edit}>
                    編集する
                  </button>
                </div>
              </main>
            )}
          </div>
        </div>
      </Modal>
    </main>
  );
};
