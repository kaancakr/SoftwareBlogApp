import {
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
  } from "react-native";
  import ProgressBar from "./ProgressBar";
  import { BlurView } from "expo-blur";
  
  export function Uploading({ image, progress }) {
    return (
      <View
        style={[
          { alignItems: "center", justifyContent: "center", zIndex: 1 },
          StyleSheet.absoluteFill,
        ]}
      >
        <BlurView
          intensity={1}
          style={StyleSheet.absoluteFill}
          tint="light"
        ></BlurView>
        <View style={styles.blurContainer}>
          <BlurView intensity={100} style={styles.blurView} tint="light">
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Text style={styles.uploadText}>Uploading...</Text>
            <ProgressBar progress={progress} />
            <View
              style={{
                height: 1,
                borderWidth: StyleSheet.hairlineWidth,
                width: "100%",
                borderColor: "#00000020",
                marginTop: 30,
              }}
            />
            <TouchableOpacity>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    blurContainer: {
      width: "70%",
      alignItems: "center",
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "#ababab",
      rowGap: 12,
      paddingVertical: 16,
    },
    blurView: {
      width: "100%",
      alignItems: "center",
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: "contain",
      borderRadius: 10,
    },
    uploadText: {
      fontSize: 12,
      marginBottom: 30,
    },
    cancelText: {
      fontWeight: "500",
      color: "#3478F6",
      fontSize: 17,
      marginTop: 10,
    },
  });
  