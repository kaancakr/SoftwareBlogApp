import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    SafeAreaView,
    Linking,
    Platform,
    TouchableOpacity,
    StatusBar,
    FlatList,
    ScrollView,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../../firebase";
import { Modal } from "react-native-paper";
import COLORS from "../../constants/colors";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const WINDOW_WIDTH = wp("100%");
const WINDOW_HEIGHT = hp("100%");

export function DrawerContent() {
    const [credentialsOpen, setCredentialsOpen] = useState(false);
    const navigation = useNavigation();

    const handleOpenCredentials = () => {
        setCredentialsOpen(true);
    };

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
            // Additional actions after successful logout can be added here
            navigation.navigate("Login");
        } catch (error) {
            console.error("Error signing out:", error.message);
            // Handle sign-out error, if any
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Image
                source={require("../../assets/monkey.jpg")}
                style={styles.sideMenuProfileIcon}
            />

            <DrawerContentScrollView>
                <View>
                    <TouchableOpacity
                        style={styles.customItem}
                        onPress={() => {
                            Linking.openURL("");
                        }}
                    >
                        <Ionicons name="globe" size={25} color="grey" />
                        <Text style={styles.drawerText}>Visit Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.customItem}
                        onPress={() => {
                            Linking.openURL(
                                ""
                            );
                        }}
                    >
                        <Ionicons name="people-circle-outline" size={25} color="grey" />
                        <Text style={styles.drawerText}>About DevApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.customItem}
                        onPress={() => {
                            Linking.openURL("");
                        }}
                    >
                        <Ionicons name="hardware-chip-outline" size={25} color="grey" />
                        <Text style={styles.drawerText}>Products</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.customItem}
                        onPress={handleOpenCredentials}
                    >
                        <Ionicons name="finger-print-outline" size={25} color="grey" />
                        <Text style={styles.drawerText}>Credentials</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
            <DrawerItem
                icon={({ color, size }) => (
                    <Icon name="exit-to-app" color="white" size={25} />
                )}
                label={"Log Out"}
                labelStyle={{ color: 'white', fontSize: 16 }} // Customize label style
                onPress={async () => {
                    await signOut();
                    // Additional actions after successful logout can be added here
                }}
            />

            <Text
                style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: "white",
                    paddingBottom: 20,
                }}
            >
                Copyright CKR Design © 2024
            </Text>
            <Modal
                animationType="slide"
                transparent={false}
                visible={credentialsOpen}
                onRequestClose={() => setCredentialsOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Credentials <Ionicons name="finger-print-outline" size={25} color={COLORS.blue} /></Text>
                        <ScrollView>
                            <View style={styles.innerModal}>
                                <Text style={styles.modalHeader}>Front-End Developer 📱</Text>
                                <Text style={styles.modalText}>Eren Kaan Çakır</Text>
                                <Text style={styles.modalHeader}>Back-End Developers 🖥️</Text>
                                <Text style={styles.modalText}>Berkay Kaan Karaca</Text>
                                <Text style={styles.modalText}>Berke Beyazbenli</Text>
                                <Text style={styles.modalText}>Kıvanç Terzioğlu</Text>
                            </View>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setCredentialsOpen(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sideMenuProfileIcon: {
        resizeMode: "contain",
        maxWidth: Platform.OS === "ios" ? 130 : 110,
        maxHeight: Platform.OS === "ios" ? 130 : 110,
        borderRadius: Platform.OS === "ios" ? 20 : 20,
        alignSelf: "center",
    },
    customItem: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: "bold",
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    paragraph: {
        fontWeight: "bold",
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    languageContainer: {
        width: 150, // Set your desired absolute width
        height: 50, // Set your desired absolute height
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "grey",
        marginLeft: 10,
    },
    languageButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    languageButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    pickerContainer: {
        position: "absolute",
        bottom: 135,
        right: 25,
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
    customDeleteItem: {
        width: 150, // Set your desired absolute width
        height: 50, // Set your desired absolute height
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#fff",
        marginLeft: 10,
        backgroundColor: "red",
        marginTop: 5,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    aboutText: {
        fontSize: 16,
        fontWeight: "400",
    },
    drawerText: {
        marginLeft: 10,
        color: COLORS.white
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        marginLeft: wp(32),
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: wp(4),
        borderRadius: wp(2),
        width: wp(90),
        height: hp(60),
    },
    modalTitle: {
        fontSize: wp(8),
        fontWeight: "bold",
        marginBottom: hp(5),
        color: COLORS.blue,
    },
    innerModal: {
        justifyContent: "space-between",
        display: "flex",
        margin: 5
    },
    modalHeader: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
        color: COLORS.blue,
    },
    modalText: {
        fontSize: wp(4),
        color: COLORS.grey,
        marginBottom: 30
    },
    closeButton: {
        marginTop: hp(2),
        alignSelf: "flex-end",
        padding: wp(2),
    },
    closeButtonText: {
        fontSize: wp(4),
        color: COLORS.blue,
    },
});