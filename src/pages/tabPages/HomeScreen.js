import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import COLORS from "../../constants/colors";
import PostCard from "../../components/PostCard";
import { useNavigation } from "@react-navigation/native";
import SlidingButton from "../../components/SlidingButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "../../../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [lastUploadedImageUrl, setLastUploadedImageUrl] = useState(null);

  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const verticalData = [
    { id: "1", title: "+", color: COLORS.green },
    { id: "2", title: "add", color: COLORS.blue },
    { id: "3", title: "technology", color: COLORS.blue },
    { id: "4", title: "trends", color: COLORS.blue },
    { id: "5", title: "topics", color: COLORS.blue },
    { id: "6", title: "for you", color: COLORS.blue },
  ];

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const savedPosts = await AsyncStorage.getItem("posts");
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const savePosts = async () => {
      try {
        await AsyncStorage.setItem("posts", JSON.stringify(posts));
      } catch (error) {
        console.error("Error saving posts:", error);
      }
    };
    savePosts();
  }, [posts]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("User doesnt exist");
        }
      });
  }, []);

  const handleNewPost = (input, uploadedImageUrl) => {
    const newPost = {
      id: posts.length + 1,
      username: name.username,
      imageUrl: uploadedImageUrl,
      likes: 0,
      comments: 0,
      postImage: uploadedImageUrl,
      caption: input,
    };
    setPosts([...posts, newPost]);
  };

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.bottomIcon}>
      <Text
        style={{
          fontWeight: "bold",
          color: item.color,
          fontSize: 14,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light-content" />
      <View style={styles.area}>
        <View style={styles.welcomeArea}>
          <Text style={styles.welcomeText}>Home</Text>
          <TouchableOpacity onPress={handleOpenDrawer}>
            <Image
              source={require("../../assets/monkey.jpg")}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: hp(10) }}>
          <FlatList
            data={verticalData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
        <ScrollView>
          <View style={styles.postContainer}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                username={post.username}
                imageUrl={post.postImage}
                likes={post.likes}
                comments={post.comments}
                caption={post.caption}
                postImage={lastUploadedImageUrl}
                onDelete={handleDeletePost}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.slidingButtonContainer}>
        <SlidingButton onNewPost={handleNewPost} />
      </View>
    </View>
  );
};

const HomeStack = createStackNavigator();

export default function HomeStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
          height: hp(15),
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#E2E7EA",
        },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: wp(3),
          },
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: wp(5), marginTop: hp(0.5) }}
              onPress={() => navigation.openDrawer()}
            >
              <Image
                source={require("../../assets/monkey.jpg")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          ),
          tabBarActiveTintColor: COLORS.blue,
          tabBarInactiveTintColor: COLORS.grey,
        }}
      />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  area: {
    flex: 1,
    marginTop: hp(8),
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeArea: {
    display: "flex",
    flexDirection: "row",
    width: wp(90),
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 42,
    color: COLORS.blue,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: Platform.OS === "ios" ? "Avenir Next" : "normal",
  },
  image: {
    width: 50,
    height: 50,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 50,
  },
  bottomIcon: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderColor: "#fff",
    justifyContent: "space-between",
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
  },
  flatListContainer: {
    marginTop: 10,
    height: hp(6),
    marginBottom: 20,
    margin: 15,
  },
  postContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  slidingButtonContainer: {
    position: "absolute",
    bottom: hp(2), // Adjust this value as needed
    right: wp(2), // Adjust this value as needed
  },
});
