import Script from "next/script";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "react-tabs/style/react-tabs.css";

export const AccountInfo = () => {
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
        <TabPanel>b</TabPanel>
        <TabPanel>c</TabPanel>
        <TabPanel>d</TabPanel>
      </Tabs>
    </div>
  );
};
