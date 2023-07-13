export type LoginLog = {
  u_id: string;
  datetime: string;
};

export type PuzzleLog = {
  u_id: string;
  p_id: string;
  play_times: number;
  latest_play_datetime: string;
};

export type BookLog = {
  u_id: string;
  b_id: string;
  play_times: number;
  latest_play_datetime: string;
};
