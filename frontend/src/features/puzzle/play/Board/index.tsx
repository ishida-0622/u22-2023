import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import styles from "@/features/puzzle/play/Board/index.module.scss";

export const Board = ({
  id,
  className,
  children,
}: {
  id: UniqueIdentifier;
  className?: string;
  children?: ReactNode;
}) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className={`${className} ${styles.board}`} ref={setNodeRef}>
      {children}
    </div>
  );
};
