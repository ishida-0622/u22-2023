import { useLayoutEffect, useState } from "react";
// import styles from "./index.module.scss";
import Modal from "react-modal";
import { useRouter } from "next/router";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Puzzle } from "@/features/puzzle/types";
// import { faPen } from "@fortawesome/free-solid-svg-icons";
import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import Image from "next/image";

Modal.setAppElement("#__next");

export const PuzzleEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  // const [allPosts, setAllPosts] = useState<Puzzle[]>([]);
  // const [posts, setPosts] = useState<Puzzle[]>([]);
  // const [puzzle, setPuzzle] = useState<Puzzle>();

  const [puzzle, setPuzzle] = useState<Puzzle | undefined>(undefined);

  // //モーダルウィンドウの表示/非表示を表すbool値を宣言
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  // /** モーダルウィンドウを表示にする関数 */
  // const openModal = () => setModalIsOpen(true);
  // /** モーダルウィンドウを非表示にする関数 */
  // const closeModal = () => setModalIsOpen(false);
  // // 検索
  // const [input, setInput] = useState("");

  // const detail = (event: React.MouseEvent<HTMLButtonElement>, post: Puzzle) => {
  //   event.preventDefault();
  //   setPuzzle(post);
  //   openModal();
  // };

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

        const matchingPuzzle = data.result.find((puzzle) => puzzle.p_id === id);
        if (matchingPuzzle) {
          // setAllPosts(data.result);
          setPuzzle(matchingPuzzle);
          console.log(data.result);
        } else {
          console.log("Puzzle not found");
        }
      } catch (e) {
        alert("データの取得に失敗しました");
        console.error(e);
      }
    };
    if (id) {
      pullPuzzle();
    }
  }, [id]);

  return (
    <main>
      {puzzle && (
        <div>
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
            <b>アイコン写真：</b>
            <Image src={puzzle.icon} alt="" width={150} height={100} />
          </div>
          <div>
            <b>問題：</b>
            {puzzle.words.map((word) => (
              <div key={word.word}>
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
          </div>
          <div>
            <b>作成日：</b>「{puzzle.create_date}」
          </div>
          <div>
            <b>更新日：</b>「{puzzle.update_date}」
          </div>
        </div>
      )}
    </main>
  );
};
