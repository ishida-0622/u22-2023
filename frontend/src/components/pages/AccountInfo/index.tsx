import Router from "next/router";
import { SetStateAction, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "react-tabs/style/react-tabs.css";

export const AccountInfo = () => {
  const [volume, setVolume] = useState(50);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [puzzleLogs, setPuzzleLogs] = useState([
    {
      userId: "user",
      puzzleId: "1234",
      playCount: 4,
      lastPlayTime: "2023-07-06T16:23:44Z",
    },
    {
      userId: "user",
      puzzleId: "1235",
      playCount: 100,
      lastPlayTime: "2023-07-06T16:23:44Z",
    },
  ]);

  const [bookLogs, setBookLogs] = useState([
    {
      userId: "user",
      bookId: "1234",
      playCount: 4,
      lastReadTime: "2023-07-06T16:23:44Z",
    },
    {
      userId: "user",
      bookId: "1235",
      playCount: 100,
      lastReadTime: "2023-07-06T16:23:44Z",
    },
  ]);

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
          <input type="text" name="mailadress" readOnly={true} />
          icould.com
          <p>パスワード</p>
          <input type="password" name="passward" readOnly={true} />
          <p>チャイルドロック</p>
          <input type="password" name="chilglock" readOnly={true} />
          <button
            type="button"
            name="account_change"
            onClick={() => Router.push("/account-info/edit")}
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
            <div key={log.puzzleId}>
              <div>No.{log.puzzleId}</div>
              <div>クリア回数：{log.playCount}</div>
              <div>最終クリア時刻{log.lastPlayTime}</div>
            </div>
          ))}
        </TabPanel>
        <TabPanel>
          えほんログ
          {bookLogs.map((log) => (
            <div key={log.bookId}>
              <div>No.{log.bookId}</div>
              <div>絵本タイトル：{log.playCount}</div>
              <div>読んだ時間{log.lastReadTime}</div>
            </div>
          ))}
        </TabPanel>
      </Tabs>
    </div>
  );
};
