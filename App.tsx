import React, { useRef } from 'react';
import {StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerMethodsType,
} from '@takeoffmedia/react-native-bitmovin-player';
//import manifest from "./assets/124366fd-93e3-435d-9c0b-c77e87b159bf/manifest.mpd"

//const manifest = require("./assets/124366fd-93e3-435d-9c0b-c77e87b159bf/cmaf/video-H264-360-800k-video-avc1.mp4")

const App = () => {
  const ref = useRef<ReactNativeBitmovinPlayerMethodsType>();
  return (
    <SafeAreaView style={styles.viewHeight}>
    <ReactNativeBitmovinPlayer
      autoPlay={false}
      hasZoom={false}
      style={styles.backgroundVideo}
      configuration={{
        startOffset: 0,
        hasNextEpisode: false,
        url: 'https://ftp.itec.aau.at/datasets/DASHDataset2014/BigBuckBunny/15sec/BigBuckBunny_15s_simple_2014_05_09.mpd',
      }}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  viewHeight: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
