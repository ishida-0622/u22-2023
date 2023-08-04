import { useLayoutEffect, useState } from "react";
// import styles from "./index.module.scss";
import Modal from "react-modal";
import { useRouter } from "next/router";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Puzzle } from "@/features/puzzle/types";
// import { faPen } from "@fortawesome/free-solid-svg-icons";
// import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import Image from "next/image";

Modal.setAppElement("#__next");

export const PuzzleEdit = () => {
  const router = useRouter();
  const [detailId, setDetailId] = useState(router.query.id);

  const [allPosts, setAllPosts] = useState<Puzzle[]>([]);
  const [posts, setPosts] = useState<Puzzle[]>([]);
  const [puzzle, setPuzzle] = useState<Puzzle>();
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

  // useLayoutEffect(() => {
  //   const pullPuzzle = async () => {
  //     const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
  //     if (baseUrl === undefined) {
  //       throw new Error("内部エラー");
  //     }
  //     try {
  //       const response = await fetch(`${baseUrl}/GetPuzzles`, {
  //         method: "POST",
  //         body: JSON.stringify({}),
  //       });
  //       const data: GetAllPuzzleResponse = await response.json();
  //       // setAllPosts(data.result);
  //       setPosts(data.result);
  //       console.log(data.result);
  //     } catch (e) {
  //       alert("データの取得に失敗しました");
  //       console.error(e);
  //     }
  //   };
  //   pullPuzzle();
  // }, []);

  return <main></main>;
};
