import React from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";

export default function CompactEditor({ onSubmit }) {
  const [contents, setContents] = React.useState("");

  function submitNote() {
    onSubmit(contents);
    setContents("");
  }

  return (
    <View style={styles.entryContainer}>
      <TextInput
        value={contents}
        onChangeText={setContents}
        placeholder="Writes"
        multiline
        style={styles.textEntry}
      />
      <Button
        title="save"
        onPress={submitNote}
        disabled={contents.trim().length === 0}
        style={styles.textSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  entryContainer: {
    marginBottom: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    maxHeight: 350
  },
  textSubmit: {
    width: 50
  },
  textEntry: {
    flex: 1,
    height: "100%"
  }
});
