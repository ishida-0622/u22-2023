import useSWR from "swr";
import { User } from "@/features/auth/types";
import Router from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styles from "@/components/pages/AccountInfo/index.module.scss";

import "react-tabs/style/react-tabs.css";
import {
  ScanUsersRequest,
  ScanUsersResponse,
} from "@/features/auth/types/scanUsers";
import { BookLog, PuzzleLog } from "@/features/log/types";
import {
  ScanPuzzleLogRequest,
  ScanPuzzleLogResponse,
} from "@/features/log/types/scanPuzzleLog";
import {
  ScanBookLogRequest,
  ScanBookLogResponse,
} from "@/features/log/types/scanBookLog";

export const AccountInfo = () => {
  const userDataFetcher = async (url: string) => {
    const request: ScanUsersRequest = {
      u_id: ["92be8e7e-00da-448a-9e73-3cd0c60f6a35"],
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
    });
    const json: ScanUsersResponse = await response.json();
    return json.result[0];
  };

  const puzzleLogFetcher = async (url: string) => {
    const request: ScanPuzzleLogRequest = {
      // TODO:uid
      u_id: "92be8e7e-00da-448a-9e73-3cd0c60f6a35",
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
      u_id: "92be8e7e-00da-448a-9e73-3cd0c60f6a35",
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
    });
    const json: ScanBookLogResponse = await response.json();
    return json.result;
  };

  const { data: userData, error: userDataError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/ScanUsers`,
    userDataFetcher
  );

  const { data: puzzleLogs, error: puzzleLogError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/ScanP_log`,
    puzzleLogFetcher
  );

  const { data: bookLogs, error: bookLogError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/ScanB_log`,
    bookLogFetcher
  );

  const [volume, setVolume] = useState(50);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

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

  if (userDataError || puzzleLogError || bookLogError) {
    return (
      <p>
        {userDataError
          ? userDataError
          : puzzleLogError
            ? puzzleLogError
            : bookLogError}
      </p>
    );
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
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <h1>アカウント情報画面</h1>
      <Tabs>
        <TabList className={`${styles.tab_list}`}>
          <Tab>アカウント情報</Tab>
          <Tab>設定</Tab>
          <Tab>パズルログ</Tab>
          <Tab>えほんログ</Tab>
        </TabList>
        <TabPanel className={`${styles.info}`}>
          <p>クリア回数：---回</p>
          <p>シール獲得枚数：---枚</p>
          <p>メールアドレス</p>
          {/*
          <input
            type="text"
            name="emailaddress"
            value={userData.email}
            readOnly={true}
          />
          */}
          <p>パスワード</p>
          {/*
          <input
            type="password"
            name="password"
            value={userData.password}
            readOnly={true}
          />
          */}
          <p>チャイルドロック</p>
          <input
            type="password"
            name="child_lock"
            value={userData.child_lock}
            readOnly={true}
          />
          <br />
          <button
            type="button"
            name="account_change"
          // onClick={() => Router.push("/account-info/edit")}
          >
            アカウント情報を変更
          </button>
        </TabPanel>
        <TabPanel className={`${styles.setting}`}>
          <div className={`${styles.font_size}`}>
            <p className={`${styles.navigate_size}`}>フォントサイズ</p>
            <input type="radio" name="font-size" id="small" className={`${styles.radio_inline_input}`} />
            <label className={`${styles.radio_inline_label}`} htmlFor="small">
              <p className={`${styles.small}`}>小</p>
            </label>
            <input type="radio" name="font-size" id="normal" className={`${styles.radio_inline_input}`}/>
            <label className={`${styles.radio_inline_label}`} htmlFor="normal">
              <p className={`${styles.normal}`}>中</p>
            </label>
            <input type="radio" name="font-size" id="big" className={`${styles.radio_inline_input}`} />
            <label className={`${styles.radio_inline_label}`} htmlFor="big">
              <p className={`${styles.big}`}>大</p>
            </label>
          </div>
          <div className={`${styles.volume}`}>
            <p className={`${styles.navigate_volume}`}>音量</p>
            <div className={`${styles.volume_bar}`}>
              <input type="button" name="yellow_green" className={`${styles.yellow_green}`} />
              <input type="button" name="light_blue" className={`${styles.light_blue}`} />
              <input type="button" name="blue" className={`${styles.blue}`} />
              <input type="button" name="yellow" className={`${styles.yellow}`} />
              <input type="button" name="orange" className={`${styles.orange}`} />
              <input type="button" name="red" className={`${styles.red}`} />
            </div>
          </div>
          <div className={`${styles.time_limit}`}>
            <p className={`${styles.navigate_time}`}>使用時間制限</p>

            <select value={selectedHour} onChange={handleHourChange} className={`${styles.limit_hour}`} id="hour">
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
            <select value={selectedMinute} onChange={handleMinuteChange} className={`${styles.limit_minute}`} id="minute">
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
            <button type="button" name="setting_return" className={`${styles.back_button}`}>
              戻る
            </button>
            <button type="button" name="setting_change" className={`${styles.change_button}`}>
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
              <div>絵本タイトル：{log.play_times}</div>
              <div>読んだ時間{log.latest_play_datetime}</div>
            </div>
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
};
