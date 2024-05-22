import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { firebase } from "../../../firebase";
import InteractiveTextInput from "react-native-text-input-interactive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as Animatable from "react-native-animatable";
const { width } = Dimensions.get("screen");

export default function OpenScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomeScreen");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    const loadStoredUsername = async () => {
      try {
        const storedLoginInfo = await AsyncStorage.getItem("lastLoginInfo");
        if (storedLoginInfo) {
          const {
            username,
            password,
            rememberMe: storedRememberMe,
          } = JSON.parse(storedLoginInfo);
          setUsername(username);
          setPassword(password);
          setRememberMe(storedRememberMe);
        }
      } catch (error) {
        console.error("Error loading stored login information:", error);
      }
    };
    loadStoredUsername().catch((error) => {
      alert("Error loading stored username");
    });
  }, []);

  const onIconPress = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const saveLoginInfo = async () => {
    try {
      await AsyncStorage.setItem(
        "lastLoginInfo",
        JSON.stringify({ username, password, rememberMe })
      );
    } catch (error) {
      console.error("Error saving login information to AsyncStorage:", error);
    }
  };

  const loginUser = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(username, password);

      if (rememberMe) {
        await saveLoginInfo();
      } else {
        await AsyncStorage.removeItem("lastLoginInfo");
      }
      navigation.navigate("HomeScreen");
    } catch (error) {
      alert(error.message);
    }
  };

  const fingerprintAuthentication = async () => {
    try {
      const isAuthenticated = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Fingerprint",
        fallbackLabel: "Enter Password",
      });

      if (isAuthenticated.success) {
        if (rememberMe) {
          try {
            const storedLoginInfo = await AsyncStorage.getItem("lastLoginInfo");
            if (storedLoginInfo) {
              const { password: storedPassword } = JSON.parse(storedLoginInfo);
              setPassword(storedPassword);
            }
          } catch (error) {
            console.error("Error loading stored login information:", error);
          }

          loginUser();
        } else {
          console.log(
            "Remember Me is not checked. Handle this case accordingly."
          );
        }
      }
    } catch (error) {
      console.error("Fingerprint authentication error:", error);
    }
  };

  const AnimatedBottomLine = () => {
    const [lineWidth] = useState(new Animated.Value(0));

    const animateLine = () => {
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    };

    useEffect(() => {
      animateLine();
    }, []);

    const lineStyle = {
      backgroundColor: "#2a41cb", // Set your desired line color
      height: 2,
      marginTop: 10,
      width: lineWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "50%"],
      }),
    };

    return <Animated.View style={lineStyle} />;
  };

  const renderHeader = () => (
    <View style={{ marginTop: 24 }}>
      <Animatable.View animation="fadeInUp" duration={800}>
        <Text
          style={{
            color: COLORS.blue,
            fontWeight: "bold",
            fontSize: 46,
            fontFamily: "Avenir Next",
          }}
        >
          DevApp
        </Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={900}>
        <Text style={{ color: "#8e9496", letterSpacing: 1, marginTop: 8 }}>
          I am so happy to see you. You can continue to login for share your
          awesome ideas.
        </Text>
      </Animatable.View>
    </View>
  );

  const renderRememberMeButton = () => (
    <Animatable.View
      animation="fadeInUp"
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginLeft: -4,
        marginTop: -20,
      }}
    >
      <TouchableOpacity
        style={{
          height: 24,
          width: 24,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: "#2a41cb",
          marginRight: 10,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 5,
        }}
        onPress={() => {
          setRememberMe(!rememberMe);
          saveLoginInfo();
        }}
      >
        {rememberMe && (
          <Image
            source={require("../../assets/checkbox.jpeg")}
            style={{ width: 25, height: 25, borderRadius: 10 }}
          />
        )}
      </TouchableOpacity>
      <Text style={{ fontWeight: "600", color: "#fff" }}>Remember Me</Text>
    </Animatable.View>
  );

  const renderTextInputs = () => (
    <Animatable.View animation="fadeInUp" style={{ marginTop: 52 }}>
      <InteractiveTextInput
        textInputStyle={{ width: width * 0.88 }}
        label="Username"
        mode="outlined"
        placeholder={"Username"}
        autoCapitalize="none"
        color={COLORS.black}
        placeholderTextColor={COLORS.gray}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <InteractiveTextInput
          placeholder={"Password"}
          secureTextEntry={!passwordVisible}
          enableIcon
          textInputStyle={{
            width: width * 0.7,
          }}
          iconImageSource={
            passwordVisible
              ? require("../../assets/visibility-button.png")
              : require("../../assets/invisible.png")
          }
          onIconPress={onIconPress}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            borderColor: COLORS.blue,
            borderWidth: 1,
            borderRadius: 8,
          }}
          onPress={() => fingerprintAuthentication()}
        >
          <Image
            source={require("../../assets/fingerprint.png")}
            style={{ height: 25, width: 25, tintColor: COLORS.blue }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ marginLeft: "auto", marginTop: 16 }}>
        <Text style={{ color: COLORS.blue, fontWeight: "500" }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderLoginButton = () => (
    <Animatable.View animation="fadeInUp" duration={900}>
      <TouchableOpacity
        style={{
          height: 50,
          width: width * 0.88,
          backgroundColor: "#2a41cb",
          marginTop: width * 0.4,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          shadowRadius: 8,
          shadowOpacity: 0.3,
          shadowColor: "#2a41cb",
          shadowOffset: {
            width: 0,
            height: 5,
          },
        }}
        onPress={() => loginUser(username, password)}
      >
        <Text style={{ fontWeight: "bold", color: "#fff" }}>Login</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const handlePressRegister = () => {
    navigation.navigate("RegisterPage");
  };
  const renderGoBackButton = () => (
    <Animatable.View
      animation="fadeInUp"
      duration={1000}
      style={{ flexDirection: "row", padding: 10, marginTop: 20 }}
    >
      <Text
        style={{
          fontWeight: "500",
          color: "#fff",
          marginLeft: wp(10),
        }}
      >
        You don't have an account
      </Text>
      <TouchableOpacity
        style={{
          marginLeft: 10,
        }}
        onPress={() => handlePressRegister()}
      >
        <Text style={{ fontWeight: "bold", color: COLORS.blue }}>Register</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      <View
        style={{
          marginLeft: 24,
          marginRight: 24,
        }}
      >
        {renderHeader()}
        {renderTextInputs()}
        {renderRememberMeButton()}
        {renderLoginButton()}
        {renderGoBackButton()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Set background color to transparent so that image shows through
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeArea: {
    display: "flex",
    flexDirection: "row",
    width: wp(90),
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 42,
    color: COLORS.blue,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "normal",
  },
});
