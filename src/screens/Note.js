import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  View,
  Button,
  KeyboardAvoidingView,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Share
} from "react-native";
import Markdown from "react-native-simple-markdown";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";

function Note({ noteId }) {
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
        <ScrollView centerContent>
          <TextInput
            value={contents}
            onChangeText={setContents}
            multiline
            style={styles.textEntry}
            autoFocus
          />
        </ScrollView>
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

async function shareNote(noteId) {
  try {
    const result = await Share.share({
      message: `Note "${noteId}"`,
      url: `${FileSystem.documentDirectory}/${noteId}`
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
}

export default class NotePage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("noteId", "Note"),
      headerRight: () => (
        <FontAwesome.Button
          name="ellipsis-h"
          backgroundColor="white"
          color="black"
          onPress={() => shareNote(navigation.getParam("noteId"))}
        />
      )
    };
  };

  render() {
    const noteId = this.props.navigation.getParam("noteId");

    return <Note noteId={noteId} />;
  }
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
