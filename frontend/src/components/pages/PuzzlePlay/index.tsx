import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useSWR from "swr";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Piece } from "@/features/puzzle/play/Piece";
import { Board } from "@/features/puzzle/play/Board";
import { Puzzle } from "@/features/puzzle/types";
import styles from "./index.module.scss";
import { StartPuzzleRequest } from "@/features/puzzle/types/start";
import backGroundImage from "@/features/puzzle/play/image/meadow.jpg"

export const PuzzlePlay = () => {
  const router = useRouter();
  // 問題id
  const { id } = router.query;
  // if (typeof id !== "string") {
  //   throw new Error("TODO:");
  // }

  const fetcher = async (key: string) => {
    const req: StartPuzzleRequest = {
      // TODO:Reduxからuidを取得
      u_id: "",
      p_id: id as string,
    };
    return fetch(key, {
      method: "POST",
      body: JSON.stringify({ id: id }),
    }).then((res) => res.json() as Promise<Puzzle>);
  };

  const { data: puzzleData, error } = useSWR(
    `${
    // process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api"
    "http://localhost:3000/api"
    }/puzzle`,
    // `${process.env.NEXT_PUBLIC_API_ENDPOINT}/StartPuzzle`,
    fetcher
  );

  // 子要素のidがkey, 子要素が所属している親要素のidがvalueのHash Map
  const [parents, setParents] = useState<Map<string, string | null>>(new Map());
  // 親要素のidがkey, 親要素に所属している子要素のidがvalueのHash Map
  const [children, setChild] = useState<Map<string, string | null>>(new Map());

  const [audios, setAudios] = useState<Map<string, HTMLAudioElement>>(
    new Map()
  );

  const puzzleReset = useCallback(() => {
    if (puzzleData) {
      // データ取得後にnullで初期化
      setParents(new Map(puzzleData.words.map((val) => [val[0], null])));
      setChild(new Map(puzzleData.words.map((val) => [val[1], null])));
      setAudios(
        new Map(puzzleData.words.map((val) => [val[0], new Audio(val[3])]))
      );
    }
  }, [puzzleData]);

  useEffect(() => {
    puzzleReset();
  }, [puzzleReset]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const id = active.id.toString();
    audios
      .get(id)
      ?.play()
      .catch((e) => console.warn(e));
  };

  /** ドロップ時に発火する関数 */
  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    // ボードにすでにピースが置かれていたら何もしない
    if (over && children.get(over.id.toString()) != null) {
      return;
    }

    const newParents = new Map<string, string | null>();
    parents.forEach((val, key) => {
      newParents.set(key, val);
    });
    // ドロップ先が親要素であれば親に所属, 何もなければ無所属にする
    newParents.set(active.id.toString(), over ? over.id.toString() : null);
    setParents(newParents);

    const newChildren = new Map<string, string | null>();
    children.forEach((val, key) => {
      if (children.get(key) === active.id.toString()) {
        newChildren.set(key, null);
      } else {
        newChildren.set(key, val);
      }
    });
    if (over) {
      newChildren.set(over.id.toString(), active.id.toString());
    }
    setChild(newChildren);

    // 正解判定
    if (
      puzzleData &&
      puzzleData.words.every((value) => newChildren.get(value[1]) === value[0])
    ) {
      console.log("OK!");
      new Audio(
        "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/success.mp3"
      ).play();
      // TODO:画面遷移
      // setTimeout(() => {
      //   router.push(`/puzzle/result?imageUrl={}`, "/puzzle/result");
      // }, 500);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!puzzleData) {
    return <p>loading</p>;
  }

  const pieces = puzzleData.words.map((word) => (
    <Piece className={`${styles.piece}`} key={word[0]} id={word[0]}>
      <Image className={`${styles.piece_image}`} src={word[2]} alt={word[0]} width={200} height={200} />
      <span>{word[0]}</span>
    </Piece>
  ));

  return (
    <main className={`${styles.container}`}>
      <div className={`${styles.board_piece}`}>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          {puzzleData.words.map((word) => {
            const child = children.get(word[1]);
            return (

              <Board className={`${styles.board}`} key={word[1]} id={word[1]}>
                {child != null ? (
                  pieces[
                  puzzleData.words.indexOf(
                    puzzleData.words.filter((w) => child === w[0]).length === 1
                      ? puzzleData.words.filter((w) => child === w[0])[0]
                      : puzzleData.words.filter(
                        (w) => child === w[0] && word[1] !== w[1]
                      )[0]
                  )
                  ]
                ) : (
                  <Image className={`${styles.board_image}`} src={word[1]} alt={word[0]} width={200} height={200} />
                )}
              </Board>

            );
          })}
          <br />
          {puzzleData.words.map((word, i) =>
            parents.get(word[0]) != null ? null : pieces[i]
          )}
        </DndContext>
      </div>
      <button className={`${styles.reset_button}`} onClick={puzzleReset}>さいしょから</button>
      <br/>
      <div className={`${styles.preview_image_wrapper}`}>
        {puzzleData.words.map(
          (word) =>
            children.get(word[1]) === word[0] && (
              <Image
                key={word[2]}
                src={word[2]}
                alt="puzzle peace"
                width={400}
                height={400}
                className={`${styles.image}`}
              />
            )
        )}
      </div>
      <Image className={`${styles.background}`} src={backGroundImage} alt="背景画像"/>
    </main>
  );
};
