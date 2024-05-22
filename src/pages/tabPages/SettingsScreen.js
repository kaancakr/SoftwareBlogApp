import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Platform,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import COLORS from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../../firebase";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [twoStepVerification, setTwoStepVerification] = useState(false);

  const handleTwoStepVerificationToggle = async () => {
    try {
      // Update two-step verification status in Firebase Authentication
      await firebase.auth().currentUser.updateProfile({
        twoStepVerificationEnabled: twoStepVerification,
      });
      // Update local state
      setTwoStepVerification(!twoStepVerification);
    } catch (error) {
      console.error("Error updating two-step verification status:", error);
    }
  };

  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleOpenProfilePage = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222831" }}>
      <View style={styles.container}>
        <View style={styles.settingsText}>
          <View style={styles.welcomeArea}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ justifyContent: "center", marginRight: 10 }}
                onPress={handleOpenProfilePage}
              >
                <FeatherIcon color={COLORS.blue} name="arrow-left" size={35} />
              </TouchableOpacity>
              <Text style={styles.welcomeText}>Settings</Text>
            </View>
            <TouchableOpacity onPress={handleOpenProfilePage}>
              <Image
                source={require("../../assets/monkey.jpg")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#fe9400" }]}>
                <FeatherIcon color="#fff" name="globe" size={20} />
              </View>

              <Text style={styles.rowLabel}>Language</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
                <FeatherIcon color="#fff" name="moon" size={20} />
              </View>

              <Text style={styles.rowLabel}>Dark Mode</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={(darkMode) => setForm({ ...form, darkMode })}
                value={form.darkMode}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#32c759" }]}>
                <FeatherIcon color="#fff" name="navigation" size={20} />
              </View>

              <Text style={styles.rowLabel}>Location</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#38C959" }]}>
                <FeatherIcon color="#fff" name="at-sign" size={20} />
              </View>

              <Text style={styles.rowLabel}>Email Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={(emailNotifications) =>
                  setForm({ ...form, emailNotifications })
                }
                value={form.emailNotifications}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
                <FeatherIcon color="#fff" name="git-branch" size={20} />
              </View>
              <Text style={styles.rowLabel}>2-Step Verification</Text>
              <View style={styles.rowSpacer} />
              <Switch
                onValueChange={handleTwoStepVerificationToggle}
                value={twoStepVerification}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: "#38C959" }]}>
                <FeatherIcon color="#fff" name="bell" size={20} />
              </View>

              <Text style={styles.rowLabel}>Push Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={(pushNotifications) =>
                  setForm({ ...form, pushNotifications })
                }
                value={form.pushNotifications}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources</Text>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#8e8d91" }]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>Report Bug</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#007afe" }]}>
                <FeatherIcon color="#fff" name="mail" size={20} />
              </View>

              <Text style={styles.rowLabel}>Contact Us</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <View style={[styles.rowIcon, { backgroundColor: "#32c759" }]}>
                <FeatherIcon color="#fff" name="star" size={20} />
              </View>

              <Text style={styles.rowLabel}>Rate in App Store</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#9e9e9e",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "400",
    color: "#0c0c0c",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
