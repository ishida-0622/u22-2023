import Router from "next/router";
import { Calendar } from "@/features/Calendar/calendar";
import { Information } from "@/features/Information/information";
import { useState } from "react";
import styles from './index.module.scss';

export const Top = () => {
    function nextMonth() {
        if (addMonth < 0)
            setAddMonth(addMonth + 1);
    }
    function previousMonth() {
        if (addMonth > -3)
            setAddMonth(addMonth - 1);
    }
    const [addMonth, setAddMonth] = useState(0);
    return (
        <div className={`${styles.container}`}>
            {/* カレンダー置く場所 */}
            <div id="calendar">
                <Calendar mm={addMonth} />
                {/* previousButtonは前の月を表示するためのボタン　
                    これ以上さかのぼれない場合previousButtonInvalidにクラス名が変わります
                    nextButtonは次の月を表示するためのボタン
                    previousと同様にこれ以上進めない場合Invalidが付きます */}
                <div className={`${styles.turn_calender}`}>
                    <button id="previousMonth" className={addMonth == -3 ? styles.previousButtonInvalid : styles.previousButton} onClick={previousMonth}>←</button>
                    <button id="nextMonth" className={addMonth == 0 ? styles.nextButtonInvalid : styles.nextButton} onClick={nextMonth}>→</button>
                </div>
            </div>
            {/* タップでアカウント情報画面へ飛ぶアイコン(右上) */}
            <img
                src="https://k-ishida-u22-2023-mock.s3.ap-northeast-1.amazonaws.com/IMG_3yvjyu.jpg"
                id="user-icon"
                onClick={() => {
                    Router.push("#");
                }}
                className={`${styles.icon}`}
            ></img>
            {/* お知らせ置く場所 */}
            <div id="information" className={styles.information}>
                <Information />
            </div>
            <div className={`${styles.button_container}`}>
                {/* パズルを始めるボタン */}
                <button
                    className={`${styles.puzzle_button}`}
                    onClick={() => {
                        Router.push("#");
                    }}
                >
                    パズル
                </button>
                {/* 読み聞かせを始めるボタン */}
                <button
                    className={`${styles.reading_button}`}
                    onClick={() => {
                        Router.push("#");
                    }}
                >
                    えほん
                </button>
            </div>
            <div className={`${styles.back_ground}`}></div>
        </div>
    );
};