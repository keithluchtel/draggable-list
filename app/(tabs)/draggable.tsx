import { DraggableListProvider } from "@/components/draggable-list/DraggableList.provider";
import { DraggableWrapper } from "@/components/draggable-list/DraggableWrapper";
import { ThemedView } from "@/components/ThemedView";
import { Data } from "@/constants/Data";
import { useCallback, useState } from "react";
import { FlatList, ListRenderItem } from "react-native";
import Reanimated, { useAnimatedRef } from "react-native-reanimated";

export default function DraggableScreen() {
  const [data, setData] = useState(Data);
  const renderItem = useCallback<ListRenderItem<(typeof data)[number]>>(
    ({ item, index }) => {
      return (
        <DraggableWrapper index={index}>
          <Reanimated.View
            style={{ paddingHorizontal: 10, height: 100, paddingVertical: 4 }}
          >
            <Reanimated.View
              style={{
                flex: 1,
                backgroundColor: item.color,
                padding: 20,
                borderRadius: 20,
              }}
            />
          </Reanimated.View>
        </DraggableWrapper>
      );
    },
    []
  );

  const onItemMoved = (from: number, to: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData.splice(to, 0, newData.splice(from, 1)[0]);
      return newData;
    });
  };

  return (
    <ThemedView>
      <DraggableListProvider rowHeight={100} onItemMoved={onItemMoved}>
        <Reanimated.FlatList data={data} renderItem={renderItem} />
      </DraggableListProvider>
    </ThemedView>
  );
}
