import Animated, {
  LinearTransition,
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

  // replace with redash
  const between = (
    value: number,
    lowerBound: number,
    upperBound: number,
    inclusive = true
  ) => {
    "worklet";
    if (inclusive) {
      return value >= lowerBound && value <= upperBound;
    }
    return value > lowerBound && value < upperBound;
  };

  const translateY = useDerivedValue(() => {
    // if index is equal to start index and pan is currently active, return the dragged offset.
    if (data.active.value) {
      if (index === data.startIndex.value) {
        return data.draggedOffset.value;
      }

      if (data.currentIndex.value !== data.startIndex.value) {
        const lower = Math.min(data.currentIndex.value, data.startIndex.value);
        const upper = Math.max(data.currentIndex.value, data.startIndex.value);
        if (between(index, lower, upper)) {
          const translateBy =
            data.startIndex.value > data.currentIndex.value
              ? data.rowHeight
              : -data.rowHeight;
          return withTiming(translateBy, { duration: 200 });
        }
      }
    }
    return withTiming(0, { duration: 200 });
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
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
      data.onDragComplete();
    });

  return (
    <GestureDetector gesture={index === 3 ? gesture : Gesture.Race()}>
      <Animated.View
        ref={ref}
        style={style}
        onLayout={() => {
          if (index === 3) {
            console.log("LAYOUT");
          }
        }}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
