/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  State,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import Box from './Box';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [hearts, setQueue] = useState([] as any);
  const counter = useRef(0);
  const ticker = useRef(0 as any);
  const [counterResult, setCounter] = useState(0);

  const addHeart = useCallback(heart => {
    setQueue((list: any) => [...list, heart]);
  }, []);

  const removeHeart = useCallback((key: number) => {
    setQueue((list: any) => list.filter((item: any) => item.key !== key));
  }, []);

  const _onSingleTap = useCallback(
    (event: TapGestureHandlerGestureEvent) => {
      if (event.nativeEvent.state === State.END) {
        if (ticker) {
          clearTimeout(ticker.current);
        }
        ticker.current = setTimeout(() => {
          console.log('连击结束 counter:', counter.current);
          setCounter(counter.current);
          counter.current = 0;
          ticker.current = 0;
          // setQueue([]);
        }, 200);

        counter.current += 1;
        addHeart({
          idx: counter.current,
          x: event.nativeEvent.absoluteX,
          y: event.nativeEvent.absoluteY,
          key: String(Date.now()),
        });
      }
    },
    [addHeart],
  );

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{height: 200}}>
        <Text style={{fontSize: 64}}>{counter.current}</Text>
        <Text style={{fontSize: 32}}>上回连击次数: {counterResult}</Text>
      </View>
      <TapGestureHandler onHandlerStateChange={e => _onSingleTap(e)}>
        <View
          style={[
            backgroundStyle,
            {
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 999,
              backgroundColor: 'transparent',
            },
          ]}>
          {hearts.map(
            (item: {key: string; x: number; y: number; idx: number}) => (
              <Box {...item} boxKey={item.key} onAnimFinished={removeHeart} />
            ),
          )}
        </View>
      </TapGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
