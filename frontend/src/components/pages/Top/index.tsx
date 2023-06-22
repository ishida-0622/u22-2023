import Router from "next/router";
import { Calendar } from "@/features/Calendar/calendar";
import { useState } from "react";

export const Top = () => {
    function nextMonth() {
        setAddMonth(addMonth + 1);
    }
    function previousMonth() {
        setAddMonth(addMonth - 1);
    }
    const [addMonth, setAddMonth] = useState(0);
    return (
        <div>
            <div id="calendar">
                <Calendar mm={addMonth} />
                <button onClick={previousMonth}>←</button>
                <button onClick={nextMonth}>→</button>
            </div>
            <img
                src="#"
                id="user-icon"
                onClick={() => {
                    Router.push("#");
                }}
            ></img>
            <div id="information">お知らせ置く場所</div>
            <button
                className="#"
                onClick={() => {
                    Router.push("#");
                }}
            >
                パズル
            </button>
            <button
                className="#"
                onClick={() => {
                    Router.push("#");
                }}
            >
                えほん
            </button>
        </div>
    );
};
