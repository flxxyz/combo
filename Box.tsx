import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
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

    const translationX = useSharedValue(x);
    const translationY = useSharedValue(y);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1.2);
    const startTime = useRef(0);

    const handleAnimationEnd = (finished?: boolean) => {
      onAnimFinished(boxKey, finished);

      const executionTime = (Date.now() - startTime.current) / 1000;
      console.log(
        'handleAnimationEnd()',
        `idx: ${idx};`,
        'executionTime:',
        executionTime.toFixed(2),
        's',
      );
    };

    const exiting = (_?: boolean) => {
      opacity.value = withDelay(190, withTiming(0, {duration: 200}));
      translationY.value = withDelay(
        100,
        withTiming(translationY.value - 50, {duration: 200}),
      );
      scale.value = withDelay(
        200,
        withTiming(2.25, {duration: 200}, (finished?: boolean) =>
          runOnJS(handleAnimationEnd)(finished),
        ),
      );
    };

    const animatedStyle = useAnimatedStyle(() => {
      const deg = [-6, -32, -11, -24, -19, -42];
      const baseX = Math.abs(translationX.value - 50);
      const baseY = Math.abs(translationY.value - 50);

      return {
        opacity: opacity.value,
        transform: [
          {
            translateX: baseX,
          },
          {
            translateY: baseY,
          },
          {
            rotate: `${deg[idx % deg.length]}deg`,
          },
          {
            scale: scale.value,
          },
        ],
      };
    }, [translationX, translationY, opacity, scale]);

    useEffect(() => {
      startTime.current = Date.now();
      translationX.value = x;
      translationY.value = y;

      scale.value = withSequence(
        withTiming(scale.value, {
          duration: 10,
          easing: Easing.bezier(0.1, 0.3, 0.8, 1),
        }),
        withTiming(1, {duration: 5, easing: Easing.linear}),
        withSpring(1.2, {velocity: -2}, (finished?: boolean) =>
          runOnJS(exiting)(finished),
        ),
      );
    }, []);

    return (
      <Animated.Image
        source={require('./images/heart.png')}
        style={[styles.box, animatedStyle]}
      />
    );
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
    width: 100,
    height: 100,
    zIndex: 2,
  },
});
