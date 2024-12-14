import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDraggableListContext } from "./DraggableList.provider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEffect } from "react";

type DraggableWrapperProps = {
  index: number;
  children: React.ReactNode;
};
export const DraggableWrapper = ({
  children,
  index,
}: DraggableWrapperProps) => {
  const data = useDraggableListContext();
  const ref = useAnimatedRef<Animated.View>();
  const position = useSharedValue<
    | {
        x: number;
        y: number;
        w: number;
        h: number;
        px: number;
        py: number;
      }
    | undefined
  >(undefined);

  const translateY = useDerivedValue(() => {
    // if index is equal to start index and pan is currently active, return the dragged offset.
    if (index === data.startIndex.value && data.active.value) {
      return data.draggedOffset.value;
    }
    return withTiming(0, { duration: 200 });
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: data.active.value && index === data.startIndex.value ? 1.3 : 1,
        },
        { translateY: translateY.value },
      ],
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      position.value = undefined;
      const measurements = ref.current?.measure(
        (x, y, width, height, pageX, pageY) => {
          data.draggedItem.value = {
            y: y,
            h: height,
          };
        }
      );
      data.active.value = true;
      data.startIndex.value = index;
      data.currentIndex.value = index;
      data.draggedOffset.value = 0;
    })
    .onUpdate((event) => {
      data.draggedOffset.value = event.translationY;
    })
    .onFinalize(() => {
      data.active.value = false;
    });

  return (
    <GestureDetector gesture={index === 3 ? gesture : Gesture.Race()}>
      <Animated.View ref={ref} style={style}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
