import { createContext, useContext, useState } from "react";
import {
  clamp,
  makeMutable,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";

type DraggableListContextType = {
  /* whether we are actively dragging a list item */
  active: SharedValue<boolean>;
  /* the index of the item that we started dragging */
  startIndex: SharedValue<number>;
  /* the index of the item that we are currently dragging */
  currentIndex: SharedValue<number>;
  /* the offset of the dragged item */
  draggedOffset: SharedValue<number>;
  /* the position and height of the dragged item */
  draggedItem: SharedValue<{
    y: number;
    h: number;
  }>;
  /* the height of each row in the list */
  rowHeight: number;
  /* callback to be called when the drag is complete */
  onDragComplete: () => void;
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
  onItemMoved?: (from: number, to: number) => void;
  children: React.ReactNode;
};
export const DraggableListProvider = ({
  rowHeight,
  onItemMoved,
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

  useAnimatedReaction(
    () => {
      // calculate the current index based on the dragged offset
      const index = Math.round(draggedOffset.value / rowHeight);
      return index;
    },
    (cv, pv) => {
      if (cv !== pv) {
        // TODO update the max to the data length
        currentIndex.value = clamp(startIndex.value + cv, 0, 99);
      }
    }
  );

  const onDragComplete = () => {
    "worklet";
    if (onItemMoved && startIndex.value !== currentIndex.value) {
      runOnJS(onItemMoved)(startIndex.value, currentIndex.value);
    }
  };

  return (
    <DraggableListContext.Provider
      value={{
        active,
        startIndex,
        currentIndex,
        draggedOffset,
        rowHeight,
        draggedItem,
        onDragComplete,
      }}
    >
      {children}
    </DraggableListContext.Provider>
  );
};
