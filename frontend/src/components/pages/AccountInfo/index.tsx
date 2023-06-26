import Script from "next/script";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "react-tabs/style/react-tabs.css";

export const AccountInfo = () => {
  const [volume, setVolume] = useState(50);

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
          <button type="button" name="change">
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
          <input
            type="range"
            name="unci"
            id="korogunomi"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </TabPanel>
        <TabPanel>c</TabPanel>
        <TabPanel>d</TabPanel>
      </Tabs>
    </div>
  );
};
