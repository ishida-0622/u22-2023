import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { RootState } from "@/store";
import { updateGameStatus } from "@/store/user";
import {
  ScanPuzzleRequest,
  ScanPuzzleResponse,
} from "@/features/puzzle/types/scan";
import {
  PausePuzzleRequest,
  PausePuzzleResponse,
} from "@/features/puzzle/types/pause";
import { endpoint } from "@/features/api";

import { Piece } from "@/features/puzzle/play/Piece";
import { Board } from "@/features/puzzle/play/Board";
import { Puzzle, PuzzleWord } from "@/features/puzzle/types";

import styles from "./index.module.scss";
import styles2 from "@/features/puzzle/play/Piece/index.module.scss";
import backGroundImage from "@/features/puzzle/play/image/meadow.jpg";

export const PuzzlePlay = () => {
  const router = useRouter();
  // 問題id
  const { id } = router.query;

  const dispatch = useDispatch();
  const uid = useSelector((store: RootState) => store.uid);

  const [puzzleData, setPuzzleData] = useState<Puzzle>();
  const [shufflePiece, setShufflePiece] = useState<PuzzleWord[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetcher = async () => {
      if (typeof id !== "string") {
        throw new Error("p_id is not string");
      }
      if (!uid) {
        throw new Error("uid is null");
      }

      const statusReq = {
        u_id: uid,
      };
      const statusRes = await fetch(`${endpoint}/ScanStatus`, {
        method: "POST",
        body: JSON.stringify(statusReq),
      });
      const status = (await statusRes.json()).result;
      if (status.game_status !== "1") {
        router.push("/");
        return;
      }

      const req: ScanPuzzleRequest = {
        p_id: id,
      };
      const url = `${endpoint}/ScanPuzzle`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json = await (res.json() as Promise<ScanPuzzleResponse>);
      if (json.response_status === "fail") {
        setError(json.error);
      }
      setPuzzleData(json.result);
      setShufflePiece(
        json.result.words.slice().sort(() => Math.random() - Math.random())
      );
    };

    if (router.isReady) {
      fetcher();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

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
      setParents(new Map(puzzleData.words.map((val) => [val.word, null])));
      setChild(new Map(puzzleData.words.map((val) => [val.shadow, null])));
      setAudios(
        new Map(puzzleData.words.map((val) => [val.word, new Audio(val.voice)]))
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
      puzzleData.words.every(
        (value) =>
          value.is_dummy || newChildren.get(value.shadow) === value.word
      )
    ) {
      new Audio(
        "https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/success.mp3"
      ).play();

      setTimeout(() => {
        router.push(
          {
            pathname: "/puzzle/result",
            query: {
              imageUrl: puzzleData.icon,
            },
          },
          "/puzzle/result"
        );
      }, 1500);
    }
  };

  const pause = async () => {
    if (!uid) {
      throw new Error("uid is null");
    }
    const req: PausePuzzleRequest = {
      u_id: uid,
      p_id: id as string,
      saved_data: Array.from(children.keys()).map(
        (key) => children.get(key) ?? "N"
      ),
    };
    const url = `${endpoint}/PausePuzzle`;
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: PausePuzzleResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      dispatch(updateGameStatus(2));
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("ちゅうだんできませんでした");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!puzzleData) {
    return <p>loading</p>;
  }

  const pieces = shufflePiece.map((word) => (
    <Piece className={`${styles.piece}`} key={word.word} id={word.word}>
      <Image
        className={`${styles.piece_image}`}
        src={word.illustration}
        alt={word.word}
        width={200}
        height={200}
      />
      <span>{word.word}</span>
    </Piece>
  ));

  return (
    <main className={`${styles.container}`}>
      <div className={`${styles.board_piece}`}>
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          {puzzleData.words.map((word) => {
            const child = children.get(word.shadow);
            return word.is_dummy ? null : (
              <Board
                className={`${styles.board}`}
                key={word.shadow}
                id={word.shadow}
              >
                {child != null ? (
                  pieces[
                    puzzleData.words.indexOf(
                      puzzleData.words.filter((w) => child === w.word)
                        .length === 1
                        ? puzzleData.words.filter((w) => child === w.word)[0]
                        : puzzleData.words.filter(
                            (w) => child === w.word && word.shadow !== w.shadow
                          )[0]
                    )
                  ]
                ) : (
                  <div className={styles.piece}>
                    <Image
                      className={`${styles.board_image}`}
                      src={word.shadow}
                      alt={word.word}
                      width={200}
                      height={200}
                    />
                    <span>???</span>
                  </div>
                )}
              </Board>
            );
          })}
          <br />
          {puzzleData.words.map((word, i) =>
            parents.get(word.word) != null ? (
              <div
                key={word.voice}
                className={`${styles.piece} ${styles2.piece}`}
                style={{ zIndex: -100 }}
              >
                <Image
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQQAAAJMAQMAAACW/DlXAAAAA1BMVEX///+nxBvIAAAAf0lEQVR42uzBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOD24JAAAAAAQND/134wAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEt0JwABmDfT1AAAAABJRU5ErkJggg=="
                  alt="dummy"
                  width={200}
                  height={200}
                  className={styles.piece_image}
                ></Image>
                <span>A</span>
              </div>
            ) : (
              pieces[i]
            )
          )}
        </DndContext>
      </div>
      <button className={`${styles.reset_button}`} onClick={puzzleReset}>
        さいしょから
      </button>
      <button className={`${styles.a_button}`} onClick={pause}>
        やめる
      </button>
      <br />
      <div className={`${styles.preview_image_wrapper}`}>
        {puzzleData.words.map(
          (word) =>
            children.get(word.shadow) === word.word &&
            word.is_displayed && (
              <Image
                key={word.illustration}
                src={word.illustration}
                alt="puzzle peace"
                width={350}
                height={350}
                className={`${styles.image}`}
              />
            )
        )}
      </div>
      <Image
        className={`${styles.background}`}
        src={backGroundImage}
        alt="背景画像"
      />
    </main>
  );
};
