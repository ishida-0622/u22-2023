export type User = {
  u_id: string;
  family_name: string;
  first_name: string;
  family_name_roma: string;
  first_name_roma: string;
  child_lock: string;
  account_name: string;
  limit_time: number;
  delete_flg: boolean;
};

export type Status = {
  u_id: string;
  game_status: number;
  status_infos?: string[] | { b_id: string; page: number };
};
