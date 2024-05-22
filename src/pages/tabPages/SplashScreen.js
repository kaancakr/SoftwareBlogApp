import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  Text,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "../../constants/colors";
import { ActivityIndicator } from "react-native-paper";
import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("OpenScreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Animatable.View animation={"fadeIn"} style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to DevApp</Text>
          <View style={styles.activityIndicator}>
            <ActivityIndicator
              size={wp(20)}
              animating={true}
              color={COLORS.blue}
            />
          </View>
        </Animatable.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: wp(80),
  },
  welcomeText: {
    fontSize: 52,
    color: COLORS.blue,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "normal",
  },
  activityIndicator: {
    marginTop: hp(20),
  },
});

export default SplashScreen;
