import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import MainTabScreen from "./src/navigations/MainTabScreen";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import { useState, useEffect } from "react";
import { firebase } from "./firebase";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./src/components/drawer/DrawerContent";
import * as LocalAuthentication from "expo-local-authentication";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/pages/authPages/LoginScreen";
import HomeStackScreen from "./src/pages/tabPages/HomeScreen";
import OpenScreen from "./src/pages/tabPages/OpenScreen";
import SplashScreen from "./src/pages/tabPages/SplashScreen";
import RegisterPage from "./src/pages/authPages/RegisterPage";
const Drawer = createDrawerNavigator();
const OpenStack = createStackNavigator();

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // Check biometric support
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);

            // Set up Firebase auth listener
            const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

            // Register for push notifications and set Expo push token
            const token = await registerForPushNotificationsAsync();
            setExpoPushToken(token);

            // Add a notification received listener
            const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
                setNotifications(prevNotifications => [...prevNotifications, notification]);
            });

            // Clean up subscriptions
            return () => {
                subscriber();
                notificationSubscription.remove();
            };
        };

        fetchData();
    }, []);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    if (initializing) return null;

    const MyStack = () => {
        return (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
                <Drawer.Screen
                    name="tab"
                    component={MainTabScreen}
                    options={{
                        headerShown: false,
                        tabBarLabelStyle: {
                            fontSize: 12,
                        },
                    }}
                    listeners={({ navigation }) => ({
                        focus: () => {
                            StatusBar.setBarStyle("light-content");
                        },
                    })}
                />
            </Drawer.Navigator>
        );
    };

    return (
        <NavigationContainer style={styles.container}>
            {user ? (
                <MyStack></MyStack>
            ) : (
                <OpenStack.Navigator>
                    <OpenStack.Screen
                        name="SplashScreen"
                        component={SplashScreen}
                        options={{ headerShown: false }}
                        listeners={({ navigation }) => ({
                            focus: () => {
                                StatusBar.setBarStyle("light-content");
                            },
                        })}
                    />
                    <OpenStack.Screen
                        name="OpenScreen"
                        component={OpenScreen}
                        options={{ headerShown: false }}
                        listeners={({ navigation }) => ({
                            focus: () => {
                                StatusBar.setBarStyle("light-content");
                            },
                        })}
                    />
                    <OpenStack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                        listeners={({ navigation }) => ({
                            focus: () => {
                                StatusBar.setBarStyle("light-content");
                            },
                        })}
                    />
                    <OpenStack.Screen
                        name="RegisterPage"
                        component={RegisterPage}
                        options={{ headerShown: false }}
                        listeners={({ navigation }) => ({
                            focus: () => {
                                StatusBar.setBarStyle("light-content");
                            },
                        })}
                    />
                    <OpenStack.Screen
                        name="HomeScreen"
                        component={HomeStackScreen}
                        options={{ headerShown: false }}
                        listeners={({ navigation }) => ({
                            focus: () => {
                                StatusBar.setBarStyle("light-content");
                            },
                        })}
                    />
                </OpenStack.Navigator>
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    return token;
}