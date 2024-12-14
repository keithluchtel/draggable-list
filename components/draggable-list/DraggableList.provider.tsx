import { createContext, useContext, useState } from "react";
import { makeMutable, SharedValue } from "react-native-reanimated";

type DraggableListContextType = {
  active: SharedValue<boolean>;
  startIndex: SharedValue<number>;
  currentIndex: SharedValue<number>;
  draggedOffset: SharedValue<number>;
  draggedItem: SharedValue<{
    y: number;
    h: number;
  }>;
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
  const startIndex = makeMutable(0);
  const currentIndex = makeMutable(0);
  const draggedOffset = makeMutable(0);
  const draggedItem = makeMutable({
    y: 0,
    h: 0,
  });

  return (
    <DraggableListContext.Provider
      value={{
        active,
        startIndex,
        currentIndex,
        draggedOffset,
        rowHeight,
        draggedItem,
      }}
    >
      {children}
    </DraggableListContext.Provider>
  );
};
