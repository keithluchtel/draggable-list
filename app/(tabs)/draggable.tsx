import { DraggableListProvider } from "@/components/draggable-list/DraggableList.provider";
import { DraggableWrapper } from "@/components/draggable-list/DraggableWrapper";
import { ThemedView } from "@/components/ThemedView";
import { Data } from "@/constants/Data";
import { useCallback, useState } from "react";
import { FlatList, ListRenderItem } from "react-native";
import Reanimated from "react-native-reanimated";

export default function DraggableScreen() {
  const [data, setData] = useState(Data);
  const renderItem = useCallback<ListRenderItem<(typeof data)[number]>>(
    ({ item, index }) => {
      return (
        <Reanimated.View style={{ paddingVertical: 2, paddingHorizontal: 10 }}>
          <Reanimated.View
            style={{ backgroundColor: item.color, height: 100, padding: 20 }}
          />
        </Reanimated.View>
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
        <FlatList
          data={data}
          renderItem={renderItem}
          CellRendererComponent={({ index, children }) => (
            <DraggableWrapper index={index}>{children}</DraggableWrapper>
          )}
        />
      </DraggableListProvider>
    </ThemedView>
  );
}
