import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import COLORS from "../../constants/colors";

const videos = [
  { uri: "video_uri_1", caption: "Caption 1" },
  { uri: "video_uri_2", caption: "Caption 2" },
  { uri: "video_uri_3", caption: "Caption 3" },
];

export default function FlowScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.translationY < -100 && nativeEvent.state === State.END) {
      const nextIndex = (currentIndex + 1) % videos.length;
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    // Update caption when currentIndex changes
    console.log("currentIndex:", currentIndex);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.videoContainer}>
          <Text>Swipe up to change video</Text>
        </View>
      </PanGestureHandler>
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>{videos[currentIndex].caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
  },
  captionContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  caption: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
