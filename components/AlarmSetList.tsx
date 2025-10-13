import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AlarmSet } from "../AlarmScreen";

type AlarmSetListProps = {
  sets: AlarmSet[];
  selectedSet: AlarmSet | null;
  onSelectSet: (set: AlarmSet) => void;
};

const AlarmSetList = ({
  sets,
  selectedSet,
  onSelectSet,
}: AlarmSetListProps) => {
  return (
    <View style={styles.container}>
      {sets.length > 0 && (
        <FlatList
          data={sets}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectSet(item)}
              style={[
                styles.setButton,
                selectedSet?.id === item.id && styles.selectedSetButton,
              ]}
            >
              <Text style={styles.setButtonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  setButton: {
    backgroundColor: "#E67451",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedSetButton: {
    backgroundColor: "#C04222",
  },
  setButtonText: {
    color: "#F5EFE6",
    fontWeight: "bold",
  },
});

export default AlarmSetList;
