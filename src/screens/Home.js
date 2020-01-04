import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  TouchableHighlight
} from "react-native";
import * as FileSystem from "expo-file-system";
import CompactEditor from "../components/CompactEditor";

function getNewNoteId() {
  return (
    "note_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

export default function Home({ navigation }) {
  const [isPopulatingNotes, setIsPopulatingNotes] = React.useState(false);
  const [notes, setNotes] = React.useState([]);

  function handleNewNote(contentsToSave) {
    const noteName = getNewNoteId();

    FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}/${noteName}.md`,
      contentsToSave
    ).then(() => {
      Alert.alert("Saved");
      populateNotesList();
    });
  }

  function handleOpenNote(noteId) {
    navigation.navigate("Note", { noteId });
  }

  function populateNotesList() {
    setIsPopulatingNotes(true);
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(files => {
        setNotes(files);
      })
      .finally(() => {
        setIsPopulatingNotes(false);
      });
  }

  function renderItem({ item, separators }) {
    return (
      <View style={styles.noteItem}>
        <TouchableHighlight
          onShowUnderlay={separators.highlight}
          onHideUnderlay={separators.unhighlight}
          onPress={() => handleOpenNote(item)}
        >
          <Text style={styles.noteText}>{item}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  React.useEffect(() => {
    populateNotesList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ItemSeparatorComponent={({ highlighted }) => (
          <View style={[styles.separator, highlighted]} />
        )}
        data={notes}
        keyExtractor={item => item}
        renderItem={renderItem}
        onRefresh={populateNotesList}
        refreshing={isPopulatingNotes}
      />
      <KeyboardAvoidingView behavior="padding" enabled>
        <CompactEditor onSubmit={handleNewNote} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between"
  },
  noteText: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignContent: "flex-start",
    backgroundColor: "white"
  },
  noteItem: {
    backgroundColor: "red",
    width: "100%"
  },
  seperator: {
    backgroundColor: "red"
  }
});
