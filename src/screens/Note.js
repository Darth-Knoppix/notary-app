import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  View,
  Button,
  KeyboardAvoidingView,
  TouchableHighlight,
  ScrollView,
  TextInput
} from "react-native";
import Markdown from "react-native-simple-markdown";
import * as FileSystem from "expo-file-system";

export default function Note({ navigation }) {
  const noteId = navigation.getParam("noteId");
  const notePath = `${FileSystem.documentDirectory}/${noteId}`;
  const [contents, setContents] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  function handleFinishEditing() {
    FileSystem.writeAsStringAsync(notePath, contents).then(() => {
      setIsEditing(false);
    });
  }

  function handleStartEditing() {
    setIsEditing(true);
  }

  React.useEffect(() => {
    setIsLoading(true);
    FileSystem.readAsStringAsync(notePath)
      .then(text => {
        setContents(text);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [noteId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <TextInput
          value={contents}
          onChangeText={setContents}
          multiline
          style={styles.textEntry}
          autoFocus
        />
        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={styles.actionsContainer}>
            <Button onPress={handleFinishEditing} title="Save" />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView centerContent>
        <View style={styles.contentContainer}>
          <TouchableHighlight onPress={handleStartEditing}>
            <View style={styles.markdownWrapper}>
              <Markdown style={styles.markdown}>{contents}</Markdown>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    flex: 1,
    width: "100%"
  },
  markdown: {},
  markdownWrapper: {
    padding: 20
  },
  textEntry: {
    padding: 20,
    flex: 1,
    minHeight: 430
  },
  actionsContainer: {
    marginBottom: 50,
    paddingBottom: 50
  }
});
