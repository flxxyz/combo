import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

export default React.memo(
  function Box(props: {
    idx: number;
    boxKey: string;
    x: number;
    y: number;
    onAnimFinished: any;
  }) {
    const {idx, boxKey, x, y, onAnimFinished} = props;
    console.log(props);

    const baseDuration = 500;
    const translationX = useSharedValue(x);
    const translationY = useSharedValue(y);

    const handleAnimationEnd = (finished?: boolean) =>
      onAnimFinished(boxKey, finished);

    const animatedStyle = useAnimatedStyle(() => {
      const deg = [45, 0, 120, 60];

      return {
        opacity: withSequence(
          withSpring(1),
          withTiming(0.1, {duration: baseDuration, easing: Easing.linear}),
        ),
        transform: [
          {
            translateX: Math.abs(translationX.value - 50),
          },
          {
            translateY: Math.abs(translationY.value - 50),
          },
          {
            rotate: `${deg[idx % deg.length]}deg`,
          },
          {
            scale: withSequence(
              withSpring(0.8),
              withTiming(
                2,
                {
                  duration: baseDuration,
                  easing: Easing.bezier(0.5, 0.1, 0.2, 1),
                },
                (finished?: boolean) => runOnJS(handleAnimationEnd)(finished),
              ),
            ),
          },
        ],
      };
    });

    return <Animated.View style={[styles.box, animatedStyle]} />;
  },
  (prevProps, nextProps) => {
    if (prevProps.idx !== nextProps.idx) {
      return false;
    }
    return true;
  },
);

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    backgroundColor: '#ff7391',
    width: 100,
    height: 100,
    zIndex: 999,
  },
});
