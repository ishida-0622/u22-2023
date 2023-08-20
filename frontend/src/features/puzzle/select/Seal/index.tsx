import Router from "next/router";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-modal";
import { Puzzle } from "@/features/puzzle/types";
import styles from "./index.module.scss";

Modal.setAppElement("#__next");

export const Seal = ({
  p_id,
  title,
  description,
  icon,
  className,
}: Puzzle & { className?: string }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const startPuzzle = () => Router.push(`/puzzle/play/${p_id}`);

  return (
    <div className={`${styles.seal_modal}`}>
      <div className={`${styles.sealWrapper} ${className}`} onClick={openModal}>
        <p>No.{p_id}</p>
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