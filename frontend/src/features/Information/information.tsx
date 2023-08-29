import { useEffect, useState } from "react";
import useSWR from "swr";
import { GetAllNoticeResponse } from "@/features/notice/types/get";
import { Notice } from "@/features/notice/types";
import styles from "@/features/Information/information.module.scss";

export const Information = () => {
  const fetcher = async (key: string) => {
    return fetch(key, {
      method: "POST",
    }).then((res) => res.json() as Promise<GetAllNoticeResponse>);
  };

  const { data: Articles, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/GetNotices`,
    fetcher
  );

  const [informationData, setInformationData] = useState<Notice[]>();
  useEffect(() => {
    if (Articles) {
      setInformationData(Articles.result);
    }
  }, [Articles]);

  if (!informationData) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  function isSecond(idx: number) {
    if (idx >= 1) {
      return <hr></hr>;
    } else {
      return;
    }
  }
  return (
    <div className={`${styles.information_container}`}>
      {informationData.map((item, index) => (
        <div key={index}>
          {isSecond(index)}
          <h3>{item.title}</h3>
          <p>{item.content}</p>
          <p>{item.createdate}</p>
        </div>
      ))}
    </div>
  );
};
