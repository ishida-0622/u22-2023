import Router, { useRouter } from "next/router";
import Image from "next/image";
import styles from "./index.module.scss";
import { Menubar } from "@/components/elements/Menubar";
import backGround from "@/components/pages/PuzzleResult/images/confetti.gif";
import { useEffect } from "react";

export const PuzzleResult = () => {
  const router = useRouter();
  const { imageUrl } = router.query;

  useEffect(() => {
    if (typeof imageUrl !== "string") {
      Router.push("/");
    }
  }, []);

  return (
    <div className={`${styles.container}`}>
      <Image
        className={`${styles.back_ground}`}
        src={backGround}
        alt="background image"
      />
      <h1 className={`${styles.big_message}`}>congratulation！</h1>
      <div className={`${styles.seal_field}`}>
        <Image
          className={`${styles.got_seal}`}
          src={imageUrl as string}
          alt="seal"
          width={230}
          height={230}
        />
      </div>
      <p className={`${styles.small_message}`}>You got a seal！</p>
      <Menubar />
    </div>
  );
};
