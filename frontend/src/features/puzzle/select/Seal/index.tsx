import Router from "next/router";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-modal";
import { PuzzleSealType } from "@/features/puzzle/types/puzzleSeal";
import styles from "./index.module.scss";

Modal.setAppElement("#__next");

export const Seal = ({
  puzzleId,
  title,
  description,
  icon,
  className
}: PuzzleSealType & { className?: string }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const startPuzzle = () => Router.push(`/puzzle/play/${puzzleId}`);

  return (
    <div className={`${styles.seal_modal}`}>
      <div className={`${styles.sealWrapper} ${className}`} onClick={openModal}>
        <p>No.{puzzleId}</p>
        <Image className={`${styles.seal}`} src={icon} alt="icon" width={120} height={120} />
      </div>
      <div className={`${styles.modal}`}>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <div className={`${styles.modal_contents}`}>
            <h3>{title}</h3>
            <p>{description}</p>
            <button className={`${styles.back_button}`} onClick={closeModal}>もどる</button>
            <button className={`${styles.play_button}`} onClick={startPuzzle}>あそぶ</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
