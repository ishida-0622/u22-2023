import { PuzzlePlay } from "@/components/pages/PuzzlePlay";
import { Puzzle } from "@/features/puzzle/types";
import { endpoint } from "@/features/api";
import {
  ScanPuzzleRequest,
  ScanPuzzleResponse,
} from "@/features/puzzle/types/scan";
import { useScrollLock } from "@/hooks/useScrollLock";

const PuzzlePlayPage = (props: Puzzle) => {
  useScrollLock();
  return <PuzzlePlay {...props} />;
};

export default PuzzlePlayPage;
