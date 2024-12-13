import { DraggableListProvider } from "@/components/draggable-list/DraggableList.provider";
import { DraggableWrapper } from "@/components/draggable-list/DraggableWrapper";
import { HelloWave } from "@/components/HelloWave";
import { ThemedView } from "@/components/ThemedView";
import { Data } from "@/constants/Data";
import { useCallback } from "react";
import { View } from "react-native";
import Reanimated from "react-native-reanimated";

export default function DraggableScreen() {
  const renderItem = useCallback(
    ({ item }: { item: (typeof Data)[number] }) => {
      return (
        <DraggableWrapper>
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
      <DraggableListProvider>
        <Reanimated.FlatList data={Data} renderItem={renderItem} />
      </DraggableListProvider>
    </ThemedView>
  );
}
