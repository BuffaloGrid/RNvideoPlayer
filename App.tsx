import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Dimensions,
  Platform,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import ReactNativeBitmovinPlayer, {
  ReactNativeBitmovinPlayerMethodsType,
} from '@takeoffmedia/react-native-bitmovin-player';

const App = () => {
  const ref = useRef<ReactNativeBitmovinPlayerMethodsType>();
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [uri, setUri] = useState<string>('');
  const [isActive, setActive] = useState<boolean>(true);
  const DownloadModule = NativeModules.DownloadModule;
  const url =
    'https://ftp.itec.aau.at/datasets/DASHDataset2014/BigBuckBunny/15sec/BigBuckBunny_15s_simple_2014_05_09.mpd';

  const _onDownload = () => {
    if (Platform.OS === 'android') {
      DownloadModule.onPressDownload(url);
    }
  };

  

  const getURL = async () => {
    const value = await DownloadModule.getOfflineSourceUrl();
    setUri(value);
    setShowVideo(true);
  };

  return (
    <>
        <SafeAreaView style={styles.viewHeight}>
        <ReactNativeBitmovinPlayer
        style={styles.backgroundVideo}
          autoPlay
          hasZoom={false}
          configuration={{startOffset: 0, url: url, hasNextEpisode: false}}
        />
        </SafeAreaView>
    </>
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
    height: Dimensions.get('screen').height / 2,
    width: Dimensions.get('screen').width,
  },
  fullScreen: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
