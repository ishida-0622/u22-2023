import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  ScanLoginDatesRequest,
  ScanLoginDatesResponse,
} from "@/features/log/types/scanLoginDates";
import styles from "@/features/Calendar/calendar.module.scss";
import Image from "next/image";

export const Calendar = ({ mm }: { mm: number }) => {
  const uid = useSelector((store: RootState) => store.uid);

  const date = new Date();
  date.setMonth(date.getMonth() + mm);
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const table = [];
  const line = Math.ceil(lastDate / 7);

  const fetcher = async (key: string) => {
    if (!uid) {
      console.warn("uid is null");
      return;
    }
    const req: ScanLoginDatesRequest = {
      u_id: uid,
      start_date: year + numPadding(month) + "01",
      end_date: year + numPadding(month) + lastDate,
    };
    const res = await fetch(key, {
      method: "POST",
      body: JSON.stringify(req),
    });
    const json: ScanLoginDatesResponse = await res.json();
    if (json.response_status === "fail") {
      throw new Error(json.error);
    }
    return json.result;
  };

  const { data: LoginLogs, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/ScanL_log`,
    fetcher
  );

  const [dateSet, setDateSet] = useState(new Set());
  useEffect(() => {
    if (LoginLogs !== undefined) {
      setDateSet(
        new Set(
          LoginLogs.map(
            (x) =>
              `${x.datetime.slice(0, 4)}${x.datetime.slice(
                5,
                7
              )}${x.datetime.slice(8, 10)}`
          )
        )
      );
    }
  }, [LoginLogs]);

  if (LoginLogs === undefined) {
    return <p>loading</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  let count = 1;
  for (let i = 0; i < line; i++) {
    let tempLine = [];
    for (let j = 0; j < (i + 1 == line ? lastDate - 7 * i : 7); j++) {
      tempLine.push(count);
      count++;
    }
    table.push(tempLine);
  }

  function numPadding(num: number) {
    return num.toString().padStart(2, "0");
  }
  function strPadding(num: string) {
    return num.padStart(2, "0");
  }

  function isLogined(date: number) {
    if (
      dateSet.has(year + numPadding(month + 1) + strPadding(date.toString()))
    ) {
      return (
        <Image
          className={styles.login_image}
          src={`https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/${
            date % 5
          }.png`}
          alt=""
          width={30}
          height={30}
        />
      );
    } else {
      return date;
    }
  }

  return (
    <div className={`${styles.calendar_container}`}>
      <table className={`${styles.calendar_table}`}>
        <thead>
          <tr>
            <th colSpan={7} className={`${styles.calendar_month}`}>
              {month + 1 + "がつ"}
            </th>
          </tr>
        </thead>
        <tbody className={`${styles.calendar_days}`}>
          {table.map((line, index) => (
            <tr key={index} className={`${styles.calendar_week}`}>
              {line.map((item) => (
                <td key={item} className={`${styles.calendar_day}`}>
                  {isLogined(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
