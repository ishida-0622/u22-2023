import { useState } from "react";
import Router from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { RootState } from "@/store";
import { endpoint } from "@/features/api";
import { Puzzle } from "@/features/puzzle/types";
import {
  StartPuzzleRequest,
  StartPuzzleResponse,
} from "@/features/puzzle/types/start";

import styles from "./index.module.scss";

Modal.setAppElement("#__next");

export const Seal = ({
  p_id,
  title,
  description,
  icon,
  className,
}: Puzzle & { className?: string }) => {
  const uid = useSelector((store: RootState) => store.uid);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const startPuzzle = async () => {
    if (!uid) return;
    const req: StartPuzzleRequest = {
      p_id: p_id,
      u_id: uid,
    };
    try {
      const res = await fetch(`${endpoint}/StartPuzzle`, {
        method: "POST",
        body: JSON.stringify(req),
      });
      const json: StartPuzzleResponse = await res.json();
      if (json.response_status === "fail") {
        throw new Error(json.error);
      }
      Router.push(`/puzzle/play/${p_id}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`${styles.seal_modal}`}>
      <div className={`${styles.sealWrapper} ${className}`} onClick={openModal}>
        <p className={`${styles.number}`}>No.{p_id}</p>
        <Image
          className={`${styles.seal}`}
          src={icon}
          alt="icon"
          width={120}
          height={120}
        />
      </div>
      <div className={`${styles.modal}`}>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <div className={`${styles.modal_contents}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            <button className={`${styles.back_button}`} onClick={closeModal}>
              もどる
            </button>
            <button className={`${styles.play_button}`} onClick={startPuzzle}>
              あそぶ
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
