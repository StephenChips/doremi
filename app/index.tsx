import { useEffect, useState } from "react";
import { PermissionsAndroid, Text, View } from "react-native";
import throttle from "lodash-es/throttle"
import Recording from "react-native-recording"

export default function Index() {
  const [recordingData, setRecordingData] = useState<Float32Array>();

  useEffect(() => {
    let listener;
    (async () => {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      Recording.init({
        bufferSize: 1024,
        sampleRate: 44100,
        bitsPerChannel: 16,
        channelsPerFrame: 1,
      });

      listener = Recording.addRecordingEventListener(throttle((data) => {
        setRecordingData(data.toString());
      }, 1000));

      Recording.start();
    })();

    return () => {
      Recording.stop();
      listener.remove();
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{recordingData}</Text>
    </View>
  );
}
