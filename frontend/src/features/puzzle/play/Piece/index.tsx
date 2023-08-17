import { useDraggable } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

import styles from "./index.module.scss";

export const Piece = ({
  id,
  children,
  className,
}: {
  id: UniqueIdentifier;
  children?: ReactNode;
  className?: string;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (

    <div
      className={className}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>

  );
};
