import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AlarmSet, Alarm } from "../AlarmScreen";
import CustomPicker from "./CustomPicker";

type AlarmDetailsProps = {
  selectedSet: AlarmSet;
  updateSet: (updatedSet: AlarmSet) => void;
};

const AlarmDetails = ({ selectedSet, updateSet }: AlarmDetailsProps) => {
  const handleAddAlarm = (value: string) => {
    if (!value) return;

    const newAlarm: Alarm = {
      id: Date.now(),
      time: value,
    };

    const updatedAlarms = [...selectedSet.alarms, newAlarm].sort((a, b) =>
      a.time.localeCompare(b.time)
    );
    updateSet({ ...selectedSet, alarms: updatedAlarms });
  };

  const handleDeleteAlarm = (alarmId: number) => {
    const updatedAlarms = selectedSet.alarms.filter(
      (alarm) => alarm.id !== alarmId
    );
    updateSet({ ...selectedSet, alarms: updatedAlarms });
  };

  return (
    <>
      <Text style={styles.selectedSetTitle}>Alarms for {selectedSet.name}</Text>
      <CustomPicker handleAddAlarm={handleAddAlarm} />
      <FlatList
        data={selectedSet.alarms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alarmItem}>
            <Text style={styles.alarmText}>{item.time}</Text>
            <TouchableOpacity onPress={() => handleDeleteAlarm(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No alarms in this set yet.</Text>
        )}
        style={styles.flatList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  selectedSetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F5EFE6",
    marginBottom: 10,
  },
  flatList: {
    marginTop: 20,
  },
  alarmItem: {
    backgroundColor: "#4F443F",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  alarmText: {
    color: "#F5EFE6",
  },
  deleteButton: {
    color: "#E65A4B",
  },
  emptyText: {
    color: "#BCA37F",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AlarmDetails;
