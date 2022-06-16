import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import Box from './Box';

export default function BoxList(props: any) {
  console.log('BoxList ----- props:', props);

  return (
    <>
      {props.queue.map((item: any) => (
        <Box {...item} />
      ))}
    </>
  );
}
