import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import COLORS from "../constants/colors";
import { Uploading } from "../components/Uploading";
import * as ImagePicker from "expo-image-picker";
import * as Animatable from "react-native-animatable";
import RNPickerSelect from "react-native-picker-select";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SlidingButton = ({ onNewPost }) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [setRemoveModalVisible] = useState(false);
  const [showAdditionalIcons, setShowAdditionalIcons] = useState(false);
  const [rotation] = useState(new Animated.Value(0));
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [lastUploadedImageUrl, setLastUploadedImageUrl] = useState(null);

  const fileName = new Date().getTime();

  const handleToggleIcons = () => {
    setShowAdditionalIcons(!showAdditionalIcons);
    const degrees = showAdditionalIcons ? 0 : 45;
    Animated.timing(rotation, {
      toValue: degrees,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 2,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleTerminalPress = () => {
    setModalVisible(true);
  };

  const handleTerminalClosePress = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (inputText.trim() !== "") {
      // Call the onNewPost callback with the input text
      onNewPost(inputText, lastUploadedImageUrl);
      setInputText(""); // Clear the input field
      setModalVisible(false); // Close the modal
      setLastUploadedImageUrl(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "files"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  async function pickImage() {
    // Request permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need gallery permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Upload the image
      await uploadImage(result.assets[0].uri, "image");
      // Send POST request
    }
  }

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, "Stuff/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    //listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress.toFixed());
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          setLastUploadedImageUrl(downloadURL);
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
          console.log(fileName);
        });
      }
    );
  }

  async function saveRecord(fileType, url, createdAt) {
    try {
      const docRef = await addDoc(collection(db, "files"), {
        fileType,
        url,
        createdAt,
      });
      console.log("document saved correctly", docRef.id);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View>
      {showAdditionalIcons && (
        <>
          <TouchableOpacity
            onPress={() => setRemoveModalVisible(true)}
            style={{ alignItems: "center" }}
          >
            <Animatable.View
              animation="fadeInUp"
              duration={500}
              style={styles.icons}
            >
              <Icon name="battery-charging" size={hp(4)} color={COLORS.green} />
            </Animatable.View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTerminalPress}
            style={{ alignItems: "center" }}
          >
            <View>
              <Animatable.View
                animation="fadeInUp"
                duration={700}
                style={styles.icons}
              >
                <Icon name="terminal" size={hp(4)} color={COLORS.background} />
              </Animatable.View>
            </View>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={handleToggleIcons}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "-360deg"],
                }),
              },
            ],
            alignContent: "center",
          }}
        >
          <Icon name="add-circle" size={hp(9)} color={COLORS.blue} />
        </Animated.View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.terminalHeader}>
              <Text style={styles.terminalHeaderText}>Terminal</Text>
              <TouchableOpacity onPress={handleTerminalClosePress}>
                <Icon
                  name="close"
                  size={hp(3)}
                  color={COLORS.green}
                  onPress={() => {
                    setModalVisible(false);
                    setLastUploadedImageUrl(null);
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.terminalBody}>
              <ScrollView>
                {/* Terminal output goes here */}
                <Text style={styles.terminalText}>
                  Welcome to the terminal!
                </Text>
              </ScrollView>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.prompt}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter command..."
                placeholderTextColor={COLORS.white}
                autoFocus
                value={inputText}
                onChangeText={setInputText}
                returnKeyType="done"
              />
            </View>
            <ScrollView>
              {lastUploadedImageUrl && (
                <Animatable.View
                  animation={"fadeInUp"}
                  style={styles.headingContainer}
                >
                  <Image
                    source={{ uri: lastUploadedImageUrl }}
                    style={{
                      width: "100%",
                      height: "90%",
                      justifyContent: "center",
                      alignItems: "center",
                      resizeMode: "cover",
                    }}
                  />
                </Animatable.View>
              )}
              {image && <Uploading image={image} progress={progress} />}
              {!lastUploadedImageUrl && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 30,
                  }}
                >
                  <Animatable.View animation={"fadeInUp"}>
                    <TouchableOpacity
                      onPress={pickImage}
                      style={styles.uploadButton}
                    >
                      <View style={styles.buttonContainer}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "bold",
                            marginRight: 20,
                          }}
                        >
                          Upload your photo
                        </Text>
                        <Ionicons name="image" size={25} color={"white"} />
                      </View>
                    </TouchableOpacity>
                  </Animatable.View>
                </View>
              )}
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => console.log(value)}
                  items={[
                    { label: "JavaScript", value: "JavaScript" },
                    { label: "TypeScript", value: "TypeScript" },
                    { label: "Python", value: "Python" },
                    { label: "Java", value: "Java" },
                    { label: "C++", value: "C++" },
                    { label: "C", value: "C" },
                  ]}
                  style={styles.picker}
                />
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SlidingButton;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    maxWidth: wp(50),
    margin: wp(1),
  },
  icons: {
    width: wp(14),
    height: wp(14),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#222831",
    borderRadius: wp(5),
    backgroundColor: COLORS.white,
    marginBottom: hp(2),
    marginLeft: -wp(1),
  },
  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "Courier New",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#6f6",
    paddingVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingBottom: hp(20),
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    shadowColor: COLORS.background,
    shadowOffset: {
      width: 8,
      height: hp(1),
    },
    shadowOpacity: 0.3,
    shadowRadius: wp(0.5),
    elevation: 5,
  },
  terminalHeader: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  terminalHeaderText: {
    color: "#6f6",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Courier New",
  },
  terminalBody: {
    maxHeight: 200, // Adjust the maximum height of the terminal body
    marginBottom: 10,
  },
  terminalText: {
    color: "#fff",
    fontFamily: "Courier New",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prompt: {
    color: "#6f6",
    fontSize: 16,
    marginRight: 5,
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Inside your styles object
  picker: {
    inputIOS: {
      color: "white",
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      fontSize: 16,
      fontFamily: "Courier New",
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 4,
      backgroundColor: COLORS.background,
      paddingRight: 30,
      width: wp(70),
      marginBottom: 25,
    },
    inputAndroid: {
      color: "white",
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      fontSize: 16,
      fontFamily: "Courier New",
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 4,
      backgroundColor: "black",
      paddingRight: 30, // to ensure the text is never behind the icon
      width: wp(70), // Set the width of the picker
    },
    placeholder: {
      color: "white",
    },
    iconContainer: {
      top: 13,
      right: 12,
    },
  },
  submitButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.green,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: {
      width: 5,
      height: hp(0.5),
    },
    shadowOpacity: 0.3,
    shadowRadius: wp(0.5),
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontFamily: "Courier New",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#6f6",
    paddingVertical: 5,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    width: wp(70),
    height: hp(10),
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    shadowColor: COLORS.green,
    shadowOffset: {
      width: 5,
      height: hp(0.5),
    },
    shadowOpacity: 0.6,
    shadowRadius: wp(1),
    elevation: 5,
    marginBottom: hp(3),
  },
  headingContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: hp(40),
  },
});
