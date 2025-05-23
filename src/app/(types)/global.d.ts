import type { ReactNode } from "react";

declare global {
  type ChildrenProps = {
    children: ReactNode;
  };
}
