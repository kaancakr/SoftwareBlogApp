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

const {width} = Dimensions.get("screen");
import {firebase} from "../../../firebase";
import InteractiveTextInput from "react-native-text-input-interactive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import Icon from "react-native-vector-icons/Ionicons";
import {heightPercentageToDP} from "react-native-responsive-screen";

const RegisterPage = ({navigation}) => {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate("Login");
            }
        });
        return () => {
            unsubscribe();
        };
    }, [navigation]);

    const onIconPress = () => {
        setPasswordVisible((prevVisible) => !prevVisible);
    };

    const handleSignUp = async (username, email, password) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firebase.auth().currentUser.sendEmailVerification({
                        handleCodeInApp: true,
                        url: 'https://devapp-c9602.firebaseapp.com',
                    })
                        .then(() => {
                            alert('Verification email sent to your email address')
                        }).catch((error) => {
                        alert(error.message)
                    })
                        .then(() => {
                            firebase.firestore().collection('users')
                                .doc(firebase.auth().currentUser.uid)
                                .set({
                                    username,
                                    email,
                                    password,
                                })
                                .then(() => {
                                    // Navigate to the OpenScreen after successful registration
                                    navigation.navigate('OpenScreen');
                                })
                                .catch((error) => {
                                    alert(error.message)
                                })
                        }).catch((error) => {
                        alert(error.message)
                    })
                }).catch(error => alert(error.message))
        } catch (error) {
            alert('Error while creating user: ' + error.message)
        }
    }

    const renderHeader = () => (
        <View style={{marginTop: 24}}>
            <Animatable.View animation="fadeInUp" duration={800}>
                <Text style={{
                    color: COLORS.blue,
                    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "normal",
                    fontWeight: "bold",
                    fontSize: 52
                }}>
                    Register
                </Text>
            </Animatable.View>
            <Animatable.View animation="fadeInUp" duration={900}>
                <Text style={{color: "#8e9496", letterSpacing: 1, marginTop: 8}}>
                    I am so happy to see you. You can continue to login for share your awesome ideas.
                </Text>
            </Animatable.View>
        </View>
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
                    textInputStyle={{width: width * 0.88}}
                    label="email"
                    mode="outlined"
                    placeholder={"Email"}
                    autoCapitalize="none"
                    color={COLORS.black}
                    placeholderTextColor={COLORS.gray}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
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
                        width: width * 0.88,
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
            </View>
        </Animatable.View>
    );

    const renderGoogleSignUpButton = () => (
        <Animatable.View animation="fadeInUp" duration={800}>
            <TouchableOpacity style={{
                height: 50,
                width: width * 0.88,
                backgroundColor: "#2a41cb",
                marginTop: 20,
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
                flexDirection: 'row'
            }}>
                <Icon name="logo-google" size={24} color={COLORS.white} style={styles.icon} />
                <Text style={{marginLeft: 20, fontWeight: "bold", color: COLORS.white}}>Sign up with Google</Text>
            </TouchableOpacity>
        </Animatable.View>
    );
    const renderRegisterButton = () => (
        <Animatable.View animation="fadeInUp" duration={900}>
            <TouchableOpacity
                style={{
                    height: 50,
                    width: width * 0.88,
                    backgroundColor: "#2a41cb",
                    marginTop: width * 0.25,
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
                onPress={() => handleSignUp(username, email, password)}
            >
                <Text style={{fontWeight: "bold", color: "#fff"}}>Register</Text>
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
                {renderRegisterButton()}
                <View style={{alignItems: 'center', justifyContent: 'center', marginTop: heightPercentageToDP(2)}}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>or</Text>
                </View>
                {renderGoogleSignUpButton()}
                {renderGoBackButton()}
            </View>
        </SafeAreaView>
    );
};
export default RegisterPage;

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
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DB4437',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 3,
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