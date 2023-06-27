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
}: PuzzleSealType) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const startPuzzle = () => Router.push(`/puzzle/play/${puzzleId}`);

  return (
    <div>
      <div className={styles.sealWrapper} onClick={openModal}>
        <p>No.{puzzleId}</p>
        <Image src={icon} alt="icon" width={100} height={100} />
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h3>{title}</h3>
        <p>{description}</p>
        <button onClick={closeModal}>もどる</button>
        <button onClick={startPuzzle}>プレイ</button>
      </Modal>
    </div>
  );
};
