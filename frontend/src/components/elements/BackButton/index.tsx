import Router from "next/router";
import styles from "./index.module.scss";

export const BackButton = () => {
  return <button onClick={() => Router.back()}></button>;
};
