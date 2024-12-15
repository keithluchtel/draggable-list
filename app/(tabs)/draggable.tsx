import { DraggableListProvider } from "@/components/draggable-list/DraggableList.provider";
import { DraggableWrapper } from "@/components/draggable-list/DraggableWrapper";
import { ThemedView } from "@/components/ThemedView";
import { Data } from "@/constants/Data";
import { useCallback, useState } from "react";
import { ListRenderItem } from "react-native";
import Reanimated from "react-native-reanimated";

export default function DraggableScreen() {
  const [data, setData] = useState(Data);
  const renderItem = useCallback<ListRenderItem<(typeof data)[number]>>(
    ({ item, index }) => {
      return (
        <DraggableWrapper index={index}>
          <Reanimated.View
            style={{ paddingVertical: 2, paddingHorizontal: 10 }}
          >
            <Reanimated.View
              style={{ backgroundColor: item.color, height: 100, padding: 20 }}
            />
          </Reanimated.View>
        </DraggableWrapper>
      );
    },
    []
  );

  const onItemMoved = (from: number, to: number) => {
    console.log("ITEM MOVED", from, to);
    setData((prev) => {
      const newData = [...prev];
      newData.splice(to, 0, newData.splice(from, 1)[0]);
      return newData;
    });
  };

  console.log("RENDER");
  return (
    <ThemedView>
      <DraggableListProvider rowHeight={100} onItemMoved={onItemMoved}>
        <Reanimated.FlatList data={data} renderItem={renderItem} />
      </DraggableListProvider>
    </ThemedView>
  );
}
