import React, {useEffect, useState} from "react";
import {
    Image,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Easing, Platform,
} from "react-native";
import {Text} from "react-native-paper";
import COLORS from "../../constants/colors";
import {firebase} from "../../../firebase";
import InteractiveTextInput from "react-native-text-input-interactive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as Animatable from "react-native-animatable";
const {width} = Dimensions.get("screen");

const LoginScreen = ({navigation}) => {
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
        loadStoredUsername();
    }, []);

    const onIconPress = () => {
        setPasswordVisible((prevVisible) => !prevVisible);
    };

    const saveLoginInfo = async () => {
        try {
            await AsyncStorage.setItem(
                "lastLoginInfo",
                JSON.stringify({username, password, rememberMe})
            );
        } catch (error) {
            console.error("Error saving login information to AsyncStorage:", error);
        }
    };

    const loginUser = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(username, password);

            if (rememberMe) {
                saveLoginInfo();
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
                            const {password: storedPassword} = JSON.parse(storedLoginInfo);
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

        return <Animated.View style={lineStyle}/>;
    };

    const renderHeader = () => (
        <View style={{marginTop: 24}}>
            <Animatable.View animation="fadeInUp" duration={800}>
                <Text style={{color: COLORS.blue, fontFamily: Platform.OS === "ios" ? "Avenir Next" : "normal", fontWeight: "bold", fontSize: 42}}>
                    Welcome Back 👋
                </Text>
            </Animatable.View>
            <Animatable.View animation="fadeInUp" duration={900}>
                <Text style={{color: "#8e9496", letterSpacing: 1, marginTop: 8}}>
                    I am so happy to see you. You can continue to login for share your awesome ideas.
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
                marginLeft: 2,
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
                        style={{width: 25, height: 25, borderRadius: 10}}
                    />
                )}
            </TouchableOpacity>
            <Text style={{fontWeight: "600", color: "#fff"}}>Remember Me</Text>
        </Animatable.View>
    );

    const renderTextInputs = () => (
        <Animatable.View animation="fadeInUp" style={{marginTop: 52}}>
            <InteractiveTextInput
                textInputStyle={{width: width * 0.88}}
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
                        style={{height: 25, width: 25, tintColor: COLORS.blue}}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{marginLeft: "auto", marginTop: 16}}>
                <Text style={{color: COLORS.blue, fontWeight: "500"}}>
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
                <Text style={{fontWeight: "bold", color: "#fff"}}>Login</Text>
            </TouchableOpacity>
        </Animatable.View>
    );
    const renderGoBackButton = () => (
        <Animatable.View animation="fadeInUp" duration={1000}>
            <TouchableOpacity
                style={{
                    height: 50,
                    width: width * 0.88,
                    backgroundColor: "#636570",
                    marginTop: 20,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowRadius: 8,
                    shadowOpacity: 0.3,
                    shadowColor: "#636570",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                }}
                onPress={() => navigation.navigate("OpenScreen")}
            >
                <Text style={{fontWeight: "bold", color: "#fff"}}>Go Back</Text>
            </TouchableOpacity>
        </Animatable.View>
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.background
            }}
        >
            <View style={{
                marginLeft: 24,
                marginRight: 24,
            }}>
                {renderHeader()}
                {renderTextInputs()}
                {renderRememberMeButton()}
                {renderLoginButton()}
                {renderGoBackButton()}
            </View>
        </SafeAreaView>
    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 10,
        paddingTop: 10,
    },
    loginContent: {
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#1d3b86",
    },
    box: {
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 18,
        elevation: 15,
        paddingRight: 20,
        paddingLeft: 20,
        height: 450,
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        fontSize: 40,
        textAlign: "center",
        color: COLORS.white,
        marginBottom: 20,
        fontWeight: "bold",
    },
    header: {
        justifyContent: "flex-start",
        paddingBottom: 20,
        alignItems: "center",
    },
    logo: {
        alignItems: "center",
        height: 100,
        width: width,
        marginTop: -40,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 25,
        backgroundColor: "#1e2024",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 50,
        marginTop: 50,
        padding: 15,
        elevation: 3,
        width: 100,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderColor: COLORS.green,
        borderWidth: 1,
    },
    buttonOpen: {
        backgroundColor: COLORS.green,
    },
    buttonClose: {
        backgroundColor: COLORS.green,
    },
    textStyle: {
        fontSize: 12,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "white",
        fontSize: 13,
    },
    languageContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "absolute",
        bottom: 13,
        right: 20,
        padding: 5,
    },
    languageButton: {
        backgroundColor: "#1d3b86",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#95877A",
    },
    languageButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
    },
    pickerContainer: {
        position: "absolute",
        bottom: 65,
        right: 35,
        zIndex: 2,
        backgroundColor: "#fff",
        shadowColor: "black",
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
    },
    languagePicker: {
        width: 150,
        backgroundColor: "white",
        borderRadius: 10,
        color: "white",
    },
    iconStyle: {
        width: 50,
        height: 50,
    },
    languageItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#fff", // Add background color to each language item
        borderRadius: 5, // Add border radius to each language item
        marginBottom: 5,
    },
    languageIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 3, // Add border radius to the icon
    },
    languageLabel: {
        fontSize: 16,
        color: "#333", // Add text color to the language label
    },
    rememberMe: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        bottom: 15,
        left: 25,
        zIndex: 1,
        elevation: 5,
        padding: 5,
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "absolute",
        bottom: 15,
        left: 10,
        padding: 5,
    },
});
