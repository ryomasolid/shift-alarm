import React, { useEffect } from "react";
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
  sets: AlarmSet[];
  selectedSet: AlarmSet;
  updateSet: (updatedSet: AlarmSet) => void;
  onSelectSet: (set: AlarmSet) => void;
};

const AlarmDetails = ({
  sets,
  selectedSet,
  updateSet,
  onSelectSet,
}: AlarmDetailsProps) => {
  // アラーム追加ボタン押下処理
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

  useEffect(() => {
    onSelectSet({ ...selectedSet });
  }, [sets]);

  return (
    <>
      <Text style={styles.selectedSetTitle}>Alarms for {selectedSet.name}</Text>

      {/* アラーム追加 */}
      <CustomPicker handleAddAlarm={handleAddAlarm} />

      {/* アラーム一覧 */}
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
