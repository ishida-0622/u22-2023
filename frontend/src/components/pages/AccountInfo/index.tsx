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
        <TabPanel>a</TabPanel>
        <TabPanel>b</TabPanel>
        <TabPanel>c</TabPanel>
        <TabPanel>d</TabPanel>
      </Tabs>
    </div>
  );
};
