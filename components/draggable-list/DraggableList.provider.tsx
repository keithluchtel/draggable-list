import { createContext, useContext, useState } from "react";
import { makeMutable, SharedValue } from "react-native-reanimated";

type DraggableListContextType = {
  active: SharedValue<boolean>;
  activeIndex: SharedValue<number>;
  draggedIndex: SharedValue<number>;
  draggedOffset: SharedValue<number>;
  rowHeight: number;
};
const DraggableListContext = createContext<
  DraggableListContextType | undefined
>(undefined);

export const useDraggableListContext = () => {
  const context = useContext(DraggableListContext);

  if (context === undefined) {
    throw new Error(
      "useDraggableListContext must be used within a DraggableListProvider"
    );
  }

  return context;
};

type DraggableListProviderProps = {
  rowHeight: number;
  children: React.ReactNode;
};
export const DraggableListProvider = ({
  rowHeight,
  children,
}: DraggableListProviderProps) => {
  const active = makeMutable(false);
  const activeIndex = makeMutable(0);
  const draggedIndex = makeMutable(0);
  const draggedOffset = makeMutable(0);

  return (
    <DraggableListContext.Provider
      value={{ active, activeIndex, draggedIndex, draggedOffset, rowHeight }}
    >
      {children}
    </DraggableListContext.Provider>
  );
};
