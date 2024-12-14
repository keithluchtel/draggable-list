import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
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
  const translateY = useSharedValue(0);
  const ref = useAnimatedRef<Animated.View>();
  const swapDistance = data.rowHeight / 2;
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

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale:
            data.active.value && index === data.activeIndex.value ? 1.3 : 1,
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
          position.value = {
            x,
            y,
            w: width,
            h: height,
            px: pageX,
            py: pageY,
          };
        }
      );
      data.active.value = true;
      data.activeIndex.value = index;
      data.draggedIndex.value = index;
      translateY.value = 0;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onFinalize(() => {
      data.active.value = false;
      translateY.value = withTiming(0, { duration: 200 });
    });

  return (
    <GestureDetector gesture={index === 3 ? gesture : Gesture.Race()}>
      <Animated.View ref={ref} style={style}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
