import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import COLORS from "../../constants/colors"; // Import moment for date manipulation

export default function NotificationScreen() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchedNotifications = [
      {
        id: 1,
        title: "Notification 1",
        timestamp: new Date(),
      },
      {
        id: 2,
        title: "Notification 2",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    const lastWeekNotifications = fetchedNotifications.filter((notification) =>
      moment(notification.timestamp).isAfter(moment().subtract(7, "days"))
    );

    setNotifications(lastWeekNotifications);
  }, []);

  const handleOpenProfilePage = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222831" }}>
      <View style={styles.container}>
        <View style={styles.settingsText}>
          <View style={styles.welcomeArea}>
            <Text style={styles.welcomeText}>Notifications</Text>
            <TouchableOpacity onPress={handleOpenProfilePage}>
              <Image
                source={require("../../assets/monkey.jpg")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.seperatorText}>
          <Text style={styles.sectionTitle}>Last Week</Text>
        </View>
        <ScrollView>
          <View style={styles.section}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notification}>
                <Text style={styles.notificationText}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationTimestamp}>
                  {moment(notification.timestamp).fromNow()}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeArea: {
    display: "flex",
    flexDirection: "row",
    width: wp(90),
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 50,
    marginRight: wp(0.5),
  },
  settingsText: {
    paddingHorizontal: wp(5.5),
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 42,
    color: COLORS.blue,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "normal",
  },
  section: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  seperatorText: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9e9e9e",
    marginBottom: 8,
  },
  notification: {
    backgroundColor: "#efefef",
    marginBottom: 10,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#fff",
    shadowOffset: {
      width: 8,
      height: hp(1),
    },
    shadowOpacity: 0.3,
    shadowRadius: wp(0.5),
    elevation: 5,
  },
  notificationText: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationTimestamp: {
    color: "#ababab",
    fontSize: 12,
  },
});
