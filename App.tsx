import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from "react-native-video";
//import manifest from "./assets/124366fd-93e3-435d-9c0b-c77e87b159bf/manifest.mpd"

//const manifest = require("./assets/124366fd-93e3-435d-9c0b-c77e87b159bf/cmaf/video-H264-360-800k-video-avc1.mp4")

const App = () => {
  return (
    <View style={styles.viewHeight}>
       <Video
        source={{ uri:"file:///RNvideoPlayer/assets/124366fd-93e3-435d-9c0b-c77e87b159bf/cmaf/manifest.mpd", type:"mpd"}}
        //source={{uri:"assets/124366fd-93e3-435d-9c0b-c77e87b159bf/cmaf/manifest.mpd"}}
        resizeMode={"cover"}
        style={styles.backgroundVideo}
        allowsExternalPlayback={true}
        fullscreenAutorotate={true}
        controls={true}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,

},
viewHeight: {
  alignSelf:"center",
  justifyContent:"center",
  height: 300,
  width: "100%",
},
});

export default App;
