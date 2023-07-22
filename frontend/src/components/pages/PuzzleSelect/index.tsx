import { useLayoutEffect, useState } from "react";
import { Seal } from "@/features/puzzle/select/Seal";
import { GetAllPuzzleResponse } from "@/features/puzzle/types/get";
import styles from "@/components/pages/PuzzleSelect/index.module.scss";
import { Menubar } from "@/components/elements/Menubar";
import BackgroundImage from "@/features/puzzle/select/images/puzzle-select-background.jpg";
import Image from "next/image";
import { Puzzle } from "@/features/puzzle/types";

export const PuzzleSelect = () => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  useLayoutEffect(() => {
    const fetchPuzzles = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
      if (baseUrl === undefined) {
        alert("内部的なエラーが発生しました");
        throw new Error('API endpoint is undefined. check ".env.local"');
      }
      try {
        // TODO:API完成時に書き換える
        // const response = await fetch(`${baseUrl}/puzzle/puzzles`);
        const response = await fetch(
          "http://localhost:3000/api/puzzle/puzzles"
        );
        const json: GetAllPuzzleResponse = await response.json();
        setPuzzles(json.result);
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
      <div>
        {puzzles.map((puzzle, i) => (
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
        {Array.from({ length: 12 }, (_, i) => (
          <div key={`star_key_${i}`} className={`star_${i}`}>
            <div className={`${styles.star_field}`}>
              <div className={`${styles.stars}`}></div>
            </div>
          </div>
        ))}
      </div>
      <Menubar />
      <Image
        className={`${styles.background}`}
        src={BackgroundImage}
        alt="Background Image"
      />
    </div>
  );
};
