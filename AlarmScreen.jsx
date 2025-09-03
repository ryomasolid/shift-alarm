import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AlarmScreen = () => {
  const [sets, setSets] = useState([]);
  const [currentSetName, setCurrentSetName] = useState("");
  const [selectedSet, setSelectedSet] = useState(null);

  // Pickerで使用する新しい状態変数
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // 時刻の選択肢を生成
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // AsyncStorageからデータをロード
  useEffect(() => {
    const loadSets = async () => {
      try {
        const storedSets = await AsyncStorage.getItem("alarmSets");
        if (storedSets) {
          setSets(JSON.parse(storedSets));
        }
      } catch (e) {
        console.error("Failed to load sets from AsyncStorage", e);
      }
    };

    loadSets();
  }, []);

  // setsが変更されるたびにデータを保存
  useEffect(() => {
    const saveSets = async () => {
      try {
        await AsyncStorage.setItem("alarmSets", JSON.stringify(sets));
      } catch (e) {
        console.error("Failed to save sets to AsyncStorage", e);
      }
    };

    saveSets();
  }, [sets]);

  const handleAddAlarm = () => {
    if (!selectedSet) {
      // alert("Please select a set.");
      return;
    }

    const newAlarm = {
      id: Date.now(),
      time: `${selectedHour}:${selectedMinute}`,
    };

    setSets((prevSets) =>
      prevSets.map((set) =>
        set.id === selectedSet.id
          ? {
              ...set,
              alarms: [...set.alarms, newAlarm].sort((a, b) =>
                a.time.localeCompare(b.time)
              ),
            }
          : set
      )
    );
  };

  const handleDeleteAlarm = (alarmId) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.id === selectedSet.id
          ? {
              ...set,
              alarms: set.alarms.filter((alarm) => alarm.id !== alarmId),
            }
          : set
      )
    );
  };

  const handleAddSet = () => {
    if (!currentSetName) {
      // alert("Please enter a name for the alarm set.");
      return;
    }

    const newSet = {
      id: Date.now(),
      name: currentSetName,
      alarms: [],
    };

    setSets((prevSets) => [...prevSets, newSet]);
    setCurrentSetName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Alarm</Text>

      {/* Alarm Set Management */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Alarm Set Name"
          placeholderTextColor="#aaa"
          value={currentSetName}
          onChangeText={setCurrentSetName}
        />
        <Button title="Create Set" onPress={handleAddSet} />
      </View>

      {/* Display and select alarm sets */}
      <View style={styles.setListContainer}>
        {sets.length > 0 && (
          <FlatList
            data={sets}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedSet(item)}
                style={[
                  styles.setButton,
                  selectedSet &&
                    selectedSet.id === item.id &&
                    styles.selectedSetButton,
                ]}
              >
                <Text style={styles.setButtonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Alarm Management for selected set */}
      {selectedSet && (
        <>
          <Text style={styles.selectedSetTitle}>
            Alarms for {selectedSet.name}
          </Text>
          <View style={[styles.formContainer, { justifyContent: "center" }]}>
            {/* Hour Picker */}
            <Picker
              style={styles.picker}
              selectedValue={selectedHour}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
            >
              {hours.map((hour) => (
                <Picker.Item key={hour} label={hour} value={hour} />
              ))}
            </Picker>

            {/* Separator */}
            <Text style={styles.separator}>:</Text>

            {/* Minute Picker */}
            <Picker
              style={styles.picker}
              selectedValue={selectedMinute}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            >
              {minutes.map((minute) => (
                <Picker.Item key={minute} label={minute} value={minute} />
              ))}
            </Picker>
          </View>
          <Button title="Add Alarm" onPress={handleAddAlarm} />

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
          />
        </>
      )}
      {!selectedSet && sets.length > 0 && (
        <Text style={styles.emptyText}>Select a set to manage alarms.</Text>
      )}

      {!selectedSet && sets.length === 0 && (
        <Text style={styles.emptyText}>
          Create a new alarm set to get started.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 20,
  },
  formContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#34495e",
    color: "#ecf0f1",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  setListContainer: {
    marginBottom: 20,
    width: "100%",
  },
  setButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedSetButton: {
    backgroundColor: "#2980b9",
  },
  setButtonText: {
    color: "#ecf0f1",
    fontWeight: "bold",
  },
  selectedSetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 10,
  },
  alarmItem: {
    backgroundColor: "#34495e",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  alarmText: {
    color: "#ecf0f1",
  },
  deleteButton: {
    color: "#e74c3c",
  },
  emptyText: {
    color: "#bdc3c7",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: "#34495e",
    color: "#ecf0f1",
  },
  separator: {
    fontSize: 24,
    color: "#ecf0f1",
    marginHorizontal: 5,
  },
});

export default AlarmScreen;
