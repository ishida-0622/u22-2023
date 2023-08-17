import { SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import Router from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { endpoint } from "@/features/api";
import {
  LOCAL_STORAGE_FONTSIZE_KEY,
  LOCAL_STORAGE_VOLUME_KEY,
  FONTSIZE_SMALL,
  FONTSIZE_NORMAL,
  FONTSIZE_BIG,
  VOLUMES,
} from "@/features/auth/consts/setting";

import {
  ScanPuzzleLogRequest,
  ScanPuzzleLogResponse,
} from "@/features/log/types/scanPuzzleLog";
import {
  ScanBookLogRequest,
  ScanBookLogResponse,
} from "@/features/log/types/scanBookLog";

import "react-tabs/style/react-tabs.css";
import styles from "@/components/pages/AccountInfo/index.module.scss";

export const AccountInfo = () => {
  const email = useSelector((store: RootState) => store.email);
  const uid = useSelector((store: RootState) => store.uid);
  const userData = useSelector((store: RootState) => store.user);

  const [volume, setVolume] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_VOLUME_KEY) ?? VOLUMES[3]
  );
  const [fontsize, setFontsize] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_FONTSIZE_KEY) ?? FONTSIZE_NORMAL
  );
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const volumeOnchangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = e.target.value;
    if (!VOLUMES.some((v) => v === vol)) {
      throw new Error("volume is invalid");
    }
    setVolume(vol);
    localStorage.setItem(LOCAL_STORAGE_VOLUME_KEY, vol);
  };

  const fontsizeOnchangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = e.target.value;
    if (
      ![FONTSIZE_SMALL, FONTSIZE_NORMAL, FONTSIZE_BIG].some((v) => v === size)
    ) {
      throw new Error("fontsize is invalid");
    }
    setFontsize(size);
    localStorage.setItem(LOCAL_STORAGE_FONTSIZE_KEY, size);
  };

  const puzzleLogFetcher = async (url: string) => {
    const request: ScanPuzzleLogRequest = {
      // TODO:uid
      // u_id: uid!,
      u_id: "748fb36e-178c-4a7e-8b07-006597becb1e",
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
    });
    const json: ScanPuzzleLogResponse = await response.json();
    return json.result;
  };

  const bookLogFetcher = async (url: string) => {
    const request: ScanBookLogRequest = {
      // TODO:uid
      // u_id: uid!,
      u_id: "748fb36e-178c-4a7e-8b07-006597becb1e",
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
    });
    const json: ScanBookLogResponse = await response.json();
    return json.result;
  };

  const { data: puzzleLogs, error: puzzleLogError } = useSWR(
    `${endpoint}/ScanP_log`,
    puzzleLogFetcher
  );

  const { data: bookLogs, error: bookLogError } = useSWR(
    `${endpoint}/ScanB_log`,
    bookLogFetcher
  );

  const handleHourChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedHour(event.target.value);
  };

  const handleMinuteChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedMinute(event.target.value);
  };

  useEffect(() => {
    if (userData) {
      setSelectedHour(
        Math.floor(userData.limit_time / 60)
          .toString()
          .padStart(2, "0")
      );
      setSelectedMinute((userData.limit_time % 60).toString().padStart(2, "0"));
    }
  }, [userData]);

  if (!(uid && userData)) {
    return null;
  }

  if (puzzleLogError || bookLogError) {
    return <p>{puzzleLogError ? puzzleLogError : bookLogError}</p>;
  }

  if (
    userData === undefined ||
    puzzleLogs === undefined ||
    bookLogs === undefined
  ) {
    return <p>Now Loading</p>;
  }

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.back_ground}`}></div>
      <h1>アカウント情報画面</h1>
      <Tabs>
        <TabList className={`${styles.tab_list}`}>
          <Tab>アカウント情報</Tab>
          <Tab>設定</Tab>
          <Tab>パズルログ</Tab>
          <Tab>えほんログ</Tab>
        </TabList>
        <TabPanel className={`${styles.info}`}>
          <p>メールアドレス：{email}</p>
          <p>名前：{`${userData.family_name} ${userData.first_name}`}</p>
          <p>
            名前（ローマ字）：
            {`${userData.family_name_roma} ${userData.first_name_roma}`}
          </p>
          <p>アカウント名：{userData.account_name}</p>
          <p>チャイルドロック：{userData.child_lock}</p>
          <button
            type="button"
            name="account_change"
            onClick={() => Router.push("/account-info/edit")}
          >
            アカウント情報を変更
          </button>
        </TabPanel>
        <TabPanel className={`${styles.setting}`}>
          <div className={`${styles.font_size}`}>
            <p className={`${styles.navigate_size}`}>フォントサイズ</p>
            <input
              type="radio"
              name="font-size"
              id="small"
              className={`${styles.radio_inline_input}`}
              value={FONTSIZE_SMALL}
              checked={fontsize === FONTSIZE_SMALL}
              onChange={fontsizeOnchangeHandler}
            />
            <label className={`${styles.radio_inline_label}`} htmlFor="small">
              <p className={`${styles.small}`}>小</p>
            </label>
            <input
              type="radio"
              name="font-size"
              id="normal"
              className={`${styles.radio_inline_input}`}
              value={FONTSIZE_NORMAL}
              checked={fontsize === FONTSIZE_NORMAL}
              onChange={fontsizeOnchangeHandler}
            />
            <label className={`${styles.radio_inline_label}`} htmlFor="normal">
              <p className={`${styles.normal}`}>中</p>
            </label>
            <input
              type="radio"
              name="font-size"
              id="big"
              className={`${styles.radio_inline_input}`}
              value={FONTSIZE_BIG}
              checked={fontsize === FONTSIZE_BIG}
              onChange={fontsizeOnchangeHandler}
            />
            <label className={`${styles.radio_inline_label}`} htmlFor="big">
              <p className={`${styles.big}`}>大</p>
            </label>
          </div>
          <div className={`${styles.volume}`}>
            <p className={`${styles.navigate_volume}`}>音量</p>
            <div className={`${styles.volume_bar}`}>
              <input
                type="button"
                name="yellow_green"
                className={`${styles.yellow_green}`}
              />
              <input
                type="button"
                name="light_blue"
                className={`${styles.light_blue}`}
              />
              <input type="button" name="blue" className={`${styles.blue}`} />
              <input
                type="button"
                name="yellow"
                className={`${styles.yellow}`}
              />
              <input
                type="button"
                name="orange"
                className={`${styles.orange}`}
              />
              <input type="button" name="red" className={`${styles.red}`} />
            </div>
          </div>
          <div className={`${styles.time_limit}`}>
            <p className={`${styles.navigate_time}`}>使用時間制限</p>

            <select
              value={selectedHour}
              onChange={handleHourChange}
              className={`${styles.limit_hour}`}
            >
              {Array.from({ length: 24 }, (_, i) =>
                i.toString().padStart(2, "0")
              ).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <label className={`${styles.hour_navigate}`} htmlFor="hour">
              時間
            </label>
            <select
              value={selectedMinute}
              onChange={handleMinuteChange}
              className={`${styles.limit_minute}`}
            >
              {Array.from({ length: 60 }, (_, i) =>
                i.toString().padStart(2, "0")
              ).map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
            <label className={`${styles.minute_navigate}`} htmlFor="minute">
              分
            </label>
          </div>
          <div className={`${styles.buttons}`}>
            <button
              type="button"
              name="setting_return"
              className={`${styles.back_button}`}
            >
              戻る
            </button>
            <button
              type="button"
              name="setting_change"
              className={`${styles.change_button}`}
            >
              変更
            </button>
          </div>
        </TabPanel>
        <TabPanel className={`${styles.puzzle_log}`}>
          パズルログ
          {puzzleLogs.map((log) => (
            <div key={log.p_id}>
              <div>No.{log.p_id}</div>
              <div>クリア回数：{log.play_times}</div>
              <div>最終クリア時刻{log.latest_play_datetime}</div>
            </div>
          ))}
        </TabPanel>
        <TabPanel className={`${styles.book_log}`}>
          えほんログ
          {bookLogs.map((log) => (
            <div key={log.b_id}>
              <div>No.{log.b_id}</div>
              <div>読んだ回数：{log.play_times}</div>
              <div>読んだ時間{log.latest_play_datetime}</div>
            </div>
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
};
