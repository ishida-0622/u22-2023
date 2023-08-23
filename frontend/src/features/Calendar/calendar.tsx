import useSWR from "swr";
import { useEffect, useState } from "react";
import { ScanLoginDatesRequest, ScanLoginDatesResponse } from "@/features/log/types/scanLoginDates";
import styles from "@/features/Calendar/calendar.module.scss";


export const Calendar = ({ mm }: { mm: number }) => {
    const date = new Date();
    date.setMonth(date.getMonth() + mm);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const table = [];
    const line = Math.ceil(lastDate / 7);

    const featcher = async (key: string) => {
        const req: ScanLoginDatesRequest = {
            // TODO:
            u_id: "aNPEZQDn8Mb62fE5hQMAcieLkL13",
            start_date: year + numPadding(month) + "01",
            end_date: year + numPadding(month) + lastDate
        }
        const res = await fetch(key, {
            method: "POST",
            body: JSON.stringify(req)
        })
        return await res.json() as Promise<ScanLoginDatesResponse>;
    }
    const { data: LoginLogs, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT
        }/ScanL_log`,
        featcher
    )

    const [dateSet, setDateSet] = useState(new Set());
    useEffect(() => {
        if (LoginLogs) {
            console.log(LoginLogs)
            setDateSet(new Set(LoginLogs.result.map(x => `${x.datetime.slice(0, 4)}${x.datetime.slice(5, 7)}${x.datetime.slice(8, 10)}`)));
        }
    }, [LoginLogs])

    if (!LoginLogs) {
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

    function isLogined(date: string) {
        if (dateSet.has(year + numPadding(month + 1) + strPadding(date))) {
            // TODO:
            return <img src="https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/IMG_3yvjyu.jpg" width="30px" height="30px"></img>
        } else {
            return date;
        }
    }

    return (
        <div className={`${styles.calendar_container}`}>
            <table className={`${styles.calendar_table}`}>
                <thead>
                    <tr><th colSpan={7} className={`${styles.calendar_month}`}>{month + 1 + "がつ"}</th></tr>
                </thead>
                <tbody className={`${styles.calendar_days}`}>
                    {table.map((line, index) => (
                        <tr key={index} className={`${styles.calendar_week}`}>
                            {line.map((item) => (
                                <td key={item} className={`${styles.calendar_day}`}>{isLogined(String(item))}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
