import { GetServerSideProps } from "next";
import { PuzzlePlay } from "@/components/pages/PuzzlePlay";
import { Puzzle } from "@/features/puzzle/types";
import { endpoint } from "@/features/api";
import {
  ScanPuzzleRequest,
  ScanPuzzleResponse,
} from "@/features/puzzle/types/scan";

const PuzzlePlayPage = (props: Puzzle) => {
  return <PuzzlePlay {...props} />;
};

export default PuzzlePlayPage;

export const getServerSideProps: GetServerSideProps<Puzzle> = async (
  context
) => {
  // 問題id
  const { id } = context.params as any;

  const req: ScanPuzzleRequest = {
    p_id: id as string,
  };
  const url = `${endpoint}/ScanPuzzle`;

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(req),
  });
  const json: ScanPuzzleResponse = await res.json();

  const props: Puzzle = json.result;

  return {
    props: props,
  };
};
