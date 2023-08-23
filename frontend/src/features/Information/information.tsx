import { GetAllNoticeResponse } from "../notice/types/get";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { Notice } from "../notice/types";
import styles from "@/features/Information/information.module.scss"

export const Information = () => {
    const featcher = async (key: string) => {
        return fetch(key, {
            method: "POST",
        }).then((res) => res.json() as Promise<GetAllNoticeResponse>)
    }

    const { data: Articles, error } = useSWR(
        `${
            process.env.NEXT_PUBLIC_API_ENDPOINT
        }/GetNotices`,
        featcher
    )

    const [informationData, setInformationData] = useState<Notice[]>();
    useEffect(()=>{
        if (Articles) {
            setInformationData(Articles.result);
        }
    })

    if (!informationData) {
        return <p>loading</p>;
    }
    if (error) {
        return <p>{error}</p>;
    }
    function isSecond(idx :  number) {
        if (idx >= 1) {
            return <hr></hr>
        } else {
            return
        }
    }
    return (
        <div className={`${styles.information_container}`}>
            {informationData.map((item, index) => (
                <div key={index}>
                    {isSecond(index)}
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    <p>{item.datetime}</p>
                </div>
            ))}
        </div>
    );
};
