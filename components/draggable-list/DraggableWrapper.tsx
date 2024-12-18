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
import { useEffect, useRef } from "react";

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
  const translateY = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return {
        active: data.active.value,
        startIndex: data.startIndex.value,
        currentIndex: data.currentIndex.value,
        draggedOffset: data.draggedOffset.value,
      };
    },
    (cv, pv) => {
      if (cv.active) {
        if (index === cv.startIndex) {
          translateY.value = cv.draggedOffset;
        } else if (cv.currentIndex !== cv.startIndex) {
          const lower = Math.min(cv.currentIndex, cv.startIndex);
          const upper = Math.max(cv.currentIndex, cv.startIndex);
          if (between(index, lower, upper)) {
            const translateBy =
              cv.startIndex > cv.currentIndex
                ? data.rowHeight
                : -data.rowHeight;
            translateY.value = withTiming(translateBy, { duration: 200 });
          } else {
            translateY.value = withTiming(0, { duration: 200 });
          }
        } else {
          translateY.value = withTiming(0, { duration: 200 });
        }
      }
    }
  );

  const style = useAnimatedStyle(() => {
    const zIndex = data.startIndex.value === index ? 100 : 1;
    const scale =
      data.startIndex.value === index && data.active.value
        ? withTiming(1.1, { duration: 200 })
        : withTiming(1, { duration: 200 });
    return {
      transform: [{ translateY: translateY.value }, { scale: scale }],
      zIndex: zIndex,
    };
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
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
      let translateTarget = 0;

      if (
        index === data.startIndex.value &&
        data.currentIndex.value !== data.startIndex.value
      ) {
        translateTarget =
          (data.currentIndex.value - data.startIndex.value) * data.rowHeight;
      }
      translateY.value = withTiming(translateTarget, { duration: 200 }, () => {
        data.onDragComplete();
      });
    })
    .activateAfterLongPress(500);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View ref={ref} style={style}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
