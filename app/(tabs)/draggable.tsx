import { DraggableListProvider } from "@/components/draggable-list/DraggableList.provider";
import { DraggableWrapper } from "@/components/draggable-list/DraggableWrapper";
import { HelloWave } from "@/components/HelloWave";
import { ThemedView } from "@/components/ThemedView";
import { Data } from "@/constants/Data";
import { useCallback } from "react";
import { ListRenderItem, View } from "react-native";
import Reanimated from "react-native-reanimated";

export default function DraggableScreen() {
  const renderItem = useCallback<ListRenderItem<(typeof Data)[number]>>(
    ({ item, index }) => {
      return (
        <DraggableWrapper index={index}>
          <Reanimated.View
            style={{ backgroundColor: item.color, height: 100, opacity: 0.5 }}
          />
        </DraggableWrapper>
      );
    },
    []
  );

  return (
    <ThemedView>
      <DraggableListProvider rowHeight={100}>
        <Reanimated.FlatList data={Data} renderItem={renderItem} />
      </DraggableListProvider>
    </ThemedView>
  );
}
