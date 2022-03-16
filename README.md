# RNvideoPlayer

This repository is for testing `react-native-video` with exoplayer as a video player in a empty project to evaluate whether react native video works with ofline playbacks and more esential features.


# Installation

- Run `npm install`
- Run an emluator from Android Studio Device Manager
- run `npm run android`

### Note: 
If for any reason the npm installation installs the last `takeoffmedia/bitmovinvideoplayer` version (currently there's an issue regarding the PinP functonality) so you just need to comment out from `ReactNativeBitmovinPlayerManager.java` all what is related to the `DefaultPictureInPictureHandler`.

# Extra native features

In order to run certain features into the bitmovin video player it was created an extra native java files that handles these functionalities.

### Download
the download functionality works thanks to the basic snippet module create to control it by a button press, after running `npm i` and by opening the project through android studio, if you realise a `DownloadModule.java` is not included into the `../main/com.takeoffmediareactnativebitmovinvideoplayer` package you must add it manually by creating a new file that contains the following snippet code:

```Java
package com.takeoffmediareactnativebitmovinplayer;

import android.content.Context;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.bitmovin.player.api.deficiency.ErrorEvent;
import com.bitmovin.player.api.deficiency.exception.IllegalOperationException;
import com.bitmovin.player.api.deficiency.exception.NoConnectionException;
import com.bitmovin.player.api.offline.OfflineContentManager;
import com.bitmovin.player.api.offline.OfflineContentManagerListener;
import com.bitmovin.player.api.offline.options.OfflineContentOptions;
import com.bitmovin.player.api.offline.options.OfflineOptionEntry;
import com.bitmovin.player.api.offline.options.OfflineOptionEntryAction;
import com.bitmovin.player.api.offline.options.ThumbnailOfflineOptionEntry;
import com.bitmovin.player.api.source.SourceConfig;
import com.bitmovin.player.api.source.SourceType;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DownloadModule extends ReactContextBaseJavaModule implements OfflineContentManagerListener {
    private final String MODULE_NAME = "DownloadModule";
    private final Context _context;
    private File file;
    private Item item;
    boolean isActive = false;

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    public DownloadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this._context = reactContext;
        this.file = new File(_context.getFilesDir(),"Downloads");
    }



    @Override
    public void onCompleted(SourceConfig sourceConfig, OfflineContentOptions offlineContentOptions) {
        Item item = getSourceConfig(sourceConfig);
        if(item != null ) {
            item.setOfflineContentOptions(offlineContentOptions);
        }
        Toast.makeText(this._context.getApplicationContext(),"the video was successfully downloaded", Toast.LENGTH_LONG).show();
    }

    @Override
    public void onError(SourceConfig sourceConfig, ErrorEvent errorEvent) {
        System.out.println(errorEvent);
    }

    @Override
    public void onProgress(SourceConfig sourceConfig, float v) {
        System.out.println("progress value: "+ v);
    }

    @Override
    public void onOptionsAvailable(SourceConfig sourceConfig, OfflineContentOptions offlineContentOptions) {
        getSourceConfig(item.getSourceConfig());
        item.setOfflineContentOptions(offlineContentOptions);
        this.isActive = true;
        init();
    }

    @ReactMethod
    public void getOfflineSourceUrl(Promise promise) {
        SourceConfig sourceConfig = null;
        if(item.getOfflineContentManager() != null){
            try{
                sourceConfig = item.getOfflineContentManager().getOfflineSourceConfig();
            }catch(IOException e){
                e.printStackTrace();
            }
        }
        if(sourceConfig != null) {
            System.out.println(sourceConfig.getPosterSource());
            promise.resolve(sourceConfig.getUrl());
        }
    }
    @ReactMethod
    public void onPressDownload(String url) {
        SourceConfig sourceConfig = new SourceConfig(url,SourceType.Dash);
        OfflineContentManager offlineContentManager = OfflineContentManager.getOfflineContentManager(
                sourceConfig, this.file.getPath(), "1", this, this._context);
        this.item = new Item(sourceConfig,offlineContentManager);
        requestOfflineContentOptions(this.item);
    }

    @Override
    public void onDrmLicenseUpdated(SourceConfig sourceConfig) {

    }

    @Override
    public void onSuspended(SourceConfig sourceConfig) {

    }

    @Override
    public void onResumed(SourceConfig sourceConfig) {

    }
    private Item getSourceConfig(SourceConfig sourceConfig) {
        if(item.getSourceConfig() == sourceConfig){
            return item;
        }
        return null;
    }

    private void requestOfflineContentOptions(Item item){
        item.getOfflineContentManager().getOptions();
    }
    private void download() {
        try {
            item.getOfflineContentManager().process(item.getOfflineContentOptions());
        } catch (NoConnectionException e) {
            e.printStackTrace();
        }
    }
    private List<OfflineOptionEntry> getAsOneList(OfflineContentOptions offlineContentOptions) {
        List<OfflineOptionEntry> offlineOptionEntries = new ArrayList<OfflineOptionEntry>(offlineContentOptions.getVideoOptions());
        offlineOptionEntries.addAll(offlineContentOptions.getAudioOptions());
        offlineOptionEntries.addAll(offlineContentOptions.getTextOptions());
        ThumbnailOfflineOptionEntry thumbnailOfflineOptionEntry = offlineContentOptions.getThumbnailOption();
        if (thumbnailOfflineOptionEntry != null) {
            offlineOptionEntries.add(thumbnailOfflineOptionEntry);
        }
        return offlineOptionEntries;
    }

    private void init() {
        if(isActive){
            OfflineOptionEntry videoOption = getAsOneList(item.getOfflineContentOptions()).get(1);
            System.out.println("video info: "+ videoOption.getId()+ " - "+videoOption.getMimeType());
            try {
                videoOption.setAction(OfflineOptionEntryAction.Download);
            } catch (IllegalOperationException e) {
                e.printStackTrace();
            }
            download();
            this.isActive = false;
        }
    }
}
```

As you notice, the manager for each video is handled by an Item class that take over the `offlineManagerContent` for each video url. the snippet code is:

```Java
package com.takeoffmediareactnativebitmovinplayer;

import com.bitmovin.player.api.offline.OfflineContentManager;
import com.bitmovin.player.api.offline.options.OfflineContentOptions;
import com.bitmovin.player.api.source.SourceConfig;

public class Item {
    private SourceConfig sourceConfig;
    private OfflineContentManager offlineContentManager;
    private OfflineContentOptions offlineContentOptions;
    private float progress;

    public Item(SourceConfig sourceConfig, OfflineContentManager offlineContentManager) {
        this.sourceConfig = sourceConfig;
        this.offlineContentManager = offlineContentManager;
    }

    public SourceConfig getSourceConfig() {
        return this.sourceConfig;
    }

    public OfflineContentManager getOfflineContentManager()
    {
        return this.offlineContentManager;
    }

    public OfflineContentOptions getOfflineContentOptions()
    {
        return this.offlineContentOptions;
    }

    public void setOfflineContentOptions(OfflineContentOptions offlineContentOptions) {
        this.offlineContentOptions = offlineContentOptions;
    }
}
```

The last change that needs to be added in order to use this module on our react-native layer is attach this module to the package list so in the `ReactNativeBitmovinPlayerPackage.kt` you will need to add the `DownloadModule.java` into the modules list.

then you just need to create a button on the RN layer and attached `_onDownload` that is already defined to the `onPress` function. 


## Fullscreen Icon

As the installation is made from the github repository may not be available the fullscreen changes as well, if it not, what you need to do is the following steps:

1. the `configuration` react prop is where your app have access to the state of the props and acts on top of that in the native code, this is the example of the fullscreen icon, so what you need to add into the `setConfiguration` function (that is where you manage all the props that are into the configuration object) is:

```Java
if(config.hasKey("style")) {
        styleMap = config.getMap("style");
      }
      if(styleMap != null) {
        if(styleMap.hasKey("fullscreenIcon") && styleMap.getBoolean("fullscreenIcon")) {
          DefaultFullscreenHandler defaultFullscreenHandler = new DefaultFullscreenHandler(Objects.requireNonNull(_reactContext.getCurrentActivity()),_playerView,_fullscreen);
          _playerView.setFullscreenHandler(defaultFullscreenHandler);
        }
        if (styleMap.hasKey("uiEnabled") && !styleMap.getBoolean("uiEnabled")) {
          _playerView.setUiVisible(false);
        }
      }
```
Then on the `index.tsx` as it is typescript, you need to predefine the type of the extra styling props and then give the value into the return statement.

```Javascript
 return (
      <View
        style={{ flex: 1 }}
        onLayout={(event) => {
          setLayout(event?.nativeEvent?.layout || null);
        }}
      >
        <ReactNativeBitmovinPlayer
          ref={playerRef as any}
          {...{
            autoPlay,
            hasZoom,
            hasChromecast,
            inPiPMode,
            configuration: {
              ...configuration,
              style:{
                fullscreenIcon: true,
              }
            },
            ...props,
          }}
```
