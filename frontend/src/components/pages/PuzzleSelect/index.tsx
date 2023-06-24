import { useLayoutEffect, useState } from "react";
import { Seal } from "@/features/puzzle/select/Seal";
import {
  GetPuzzlesResponse,
  PuzzleSealType,
} from "@/features/puzzle/types/puzzleSeal";

export const PuzzleSelect = () => {
  const [puzzles, setPuzzles] = useState<PuzzleSealType[]>([]);

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
          `${baseUrl || "http://localhost:3000/api"}/puzzle/puzzles`
        );
        const json: GetPuzzlesResponse = await response.json();
        setPuzzles(json.items);
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
    <div>
      <div>{/* TODO:スタートの画像 */}</div>
      {puzzles.map((puzzle) => (
        <Seal key={puzzle.puzzleId} {...puzzle} />
      ))}
      <div>{/* TODO:ゴールの画像 */}</div>
    </div>
  );
};
