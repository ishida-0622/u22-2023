import useSWR from "swr";
import { User } from "@/features/auth/types";
import Router from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

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
    console.log(json);
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
    <div>
      <h1>アカウント情報画面</h1>
      <Tabs>
        <TabList>
          <Tab>アカウント情報</Tab>
          <Tab>設定</Tab>
          <Tab>パズルログ</Tab>
          <Tab>えほんログ</Tab>
        </TabList>
        <TabPanel>
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
        <TabPanel>
          <p>フォントサイズ</p>
          <label>
            小
            <input type="radio" name="font-size" />
          </label>
          <label>
            中
            <input type="radio" name="font-size" />
          </label>
          <label>
            大
            <input type="radio" name="font-size" />
          </label>
          <p>音量</p>
          <div>
            <input type="button" name="yellow_green" />
            <input type="button" name="light_blue" />
            <input type="button" name="blue" />
            <input type="button" name="yellow" />
            <input type="button" name="orange" />
            <input type="button" name="red" />
          </div>
          <p>使用時間制限</p>
          <select value={selectedHour} onChange={handleHourChange}>
            {Array.from({ length: 24 }, (_, i) =>
              i.toString().padStart(2, "0")
            ).map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          時間
          <select value={selectedMinute} onChange={handleMinuteChange}>
            {Array.from({ length: 60 }, (_, i) =>
              i.toString().padStart(2, "0")
            ).map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
          分
          <div>
            <button type="button" name="setting_return">
              戻る
            </button>
            <button type="button" name="setting_change">
              変更
            </button>
          </div>
        </TabPanel>
        <TabPanel>
          パズルログ
          {puzzleLogs.map((log) => (
            <div key={log.p_id}>
              <div>No.{log.p_id}</div>
              <div>クリア回数：{log.play_times}</div>
              <div>最終クリア時刻{log.latest_play_datetime}</div>
            </div>
          ))}
        </TabPanel>
        <TabPanel>
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
