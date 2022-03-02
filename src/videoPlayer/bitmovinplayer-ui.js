import {Label, UIContainer, FullscreenToggleButton, UIManager } from "bitmovin-player-ui";
import {Player} from "bitmovin-pla"
 const containerui = new UIContainer({
    components: [
        new FullscreenToggleButton().enable(),
    ]
  ,cssClass: "#player"  
})

new UIManager(this,containerui)