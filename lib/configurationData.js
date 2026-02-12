
import { getSocket } from "./socket";


getSocket().on("configurationData", (config) => {
      const thresholds = config.motionSensitivity
        ?.slice(0, 8)
        .map(sanitizeVal);

     console.log("Motion Threshold data received:", thresholds);
    });