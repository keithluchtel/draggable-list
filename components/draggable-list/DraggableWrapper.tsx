import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDraggableListContext } from "./DraggableList.provider";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useLayoutEffect, useRef } from "react";
import { between } from "react-native-redash";

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
  const translateY = useSharedValue(0);
  const indexRef = useRef(index);

  useLayoutEffect(() => {
    // reset the translation when the index changes
    // use layout effect to ensure the index is updated before the next render
    if (indexRef.current !== index) {
      translateY.value = 0;
    }
    indexRef.current = index;
  }, [index]);

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
        // if we are the item being reordered, follow the drag offset
        if (index === cv.startIndex) {
          translateY.value = cv.draggedOffset;
        }
        // Otherwise, check if the surrounding items needs to be moved
        // due to the dragged item switching positions
        else if (cv.currentIndex !== cv.startIndex) {
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
        }
        // otherwise, just revert back to default position
        else {
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
    .onEnd(() => {
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
    .onFinalize(() => {
      data.active.value = false;
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
