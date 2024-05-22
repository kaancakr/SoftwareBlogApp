import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  ScrollView,
} from "react-native";

export default function InputPage() {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState([]);

  const handleInputSubmit = () => {
    // Process the input value here
    setOutput((prevOutput) => [...prevOutput, inputValue]);
    setInputValue("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.outputContainer}>
        {output.map((item, index) => (
          <Text key={index} style={styles.outputText}>
            {item}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>$</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleInputSubmit}
          placeholder="Enter command..."
          placeholderTextColor="#999"
          autoFocus
          returnKeyType="send"
          blurOnSubmit={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
  },
  outputContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  outputText: {
    color: "#fff",
    fontFamily: "Courier New",
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  prompt: {
    color: "#6f6",
    fontSize: 16,
    marginRight: 5,
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
});
