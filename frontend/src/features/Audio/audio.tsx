import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  ScanLoginDatesRequest,
  ScanLoginDatesResponse,
} from "@/features/log/types/scanLoginDates";
import styles from "@/features/Calendar/calendar.module.scss";

export const AudioPlayer = ({ vol, audio }: { vol: number, audio: HTMLAudioElement}) => {
    const startAudio = () => {
        if(audio) {
         audio.play();
        }
    }
    audio.volume = vol;

  return (
    <div>
      <button onClick={() => startAudio()}>▶</button>
    </div>
  );
};
