import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { endpoint } from "@/features/api";
import { Seal } from "@/features/puzzle/select/Seal";
import { Menubar } from "@/components/elements/Menubar";

import { Puzzle } from "@/features/puzzle/types";
import {
  GetAllPuzzleRequest,
  GetAllPuzzleResponse,
} from "@/features/puzzle/types/get";

import styles from "@/components/pages/PuzzleSelect/index.module.scss";
import BackgroundImage from "@/features/puzzle/select/images/puzzle-select-background.jpg";

export const PuzzleSelect = () => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [showPuzzles, setShowPuzzles] = useState<Puzzle[]>([]);
  const [pageNum, setPageNum] = useState(1);

  const pageIncrement = () => {
    if (pageNum >= puzzles.length / 5) {
      return;
    }
    const newPageNum = pageNum + 1;
    const startIdx = (newPageNum - 1) * 5;
    const endIdx = newPageNum * 5;
    setPageNum(newPageNum);
    setShowPuzzles(puzzles.slice(startIdx, endIdx));
  };

  const pageDecrement = () => {
    if (pageNum <= 1) {
      return;
    }
    const newPageNum = pageNum - 1;
    const startIdx = (newPageNum - 1) * 5;
    const endIdx = newPageNum * 5;
    setPageNum(newPageNum);
    setShowPuzzles(puzzles.slice(startIdx, endIdx));
  };

  useLayoutEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const req: GetAllPuzzleRequest = {};
        const response = await fetch(`${endpoint}/GetPuzzles`, {
          method: "POST",
          body: JSON.stringify(req),
        });
        const json: GetAllPuzzleResponse = await response.json();
        if (json.response_status === "fail") {
          throw new Error(json.error);
        }
        setPuzzles(json.result);
        setShowPuzzles(json.result.slice(0, 5));
      } catch (error) {
        if (error instanceof Error) {
          alert("パズル取得中にエラーが発生しました");
          console.error(error.message);
        } else {
          alert("不明なエラー");
          console.error(error);
        }
      }
    };
    fetchPuzzles();
  }, []);

  return (
    <div className={`${styles.container}`}>
      <button
        onClick={pageDecrement}
        className={pageNum <= 1 ? "decrement_invalid" : "decrement"}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className={`${styles.seal_star}`}>
        {showPuzzles.map((puzzle, i) => (
          <div
            key={`${puzzle.title}${puzzle.create_date}`}
            className={`item_${i}`}
          >
            <div className={`${styles.items}`}>
              <div className={`seal_${i}`}>
                <Seal
                  key={`${puzzle.title}${i}`}
                  className={`${styles.seal}`}
                  {...puzzle}
                />
              </div>
              <div className={`shadow_${i}`}>
                <div className={`${styles.shadow}`}></div>
              </div>
            </div>
          </div>
        ))}
        {Array.from({ length: 3 * (showPuzzles.length - 1) }, (_, i) => (
          <div key={`star_key_${i}`} className={`star_${i}`}>
            <div className={`${styles.star_field}`}>
              <div className={`${styles.stars}`}></div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={pageIncrement}
        className={
          pageNum >= puzzles.length / 5 ? "increment_invalid" : "increment"
        }
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <Menubar />
      <Image
        className={`${styles.background}`}
        src={BackgroundImage}
        alt="Background Image"
      />
    </div>
  );
};
