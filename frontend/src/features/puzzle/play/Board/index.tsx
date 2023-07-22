import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

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
    <div className={className} ref={setNodeRef}>
      {children}
    </div>
  );
};
