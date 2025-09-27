import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import AlarmDetails from "./components/AlarmDetails";
import AlarmSetList from "./components/AlarmSetList";

export type Alarm = {
  id: number;
  time: string;
};

export type AlarmSet = {
  id: number;
  name: string;
  alarms: Alarm[];
};

const AlarmScreen = () => {
  const [currentSetName, setCurrentSetName] = useState<string>("");
  const [sets, setSets] = useState<AlarmSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<AlarmSet | null>(null);

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

  const handleAddSet = () => {
    if (!currentSetName) return;

    const newSet: AlarmSet = {
      id: Date.now(),
      name: currentSetName,
      alarms: [],
    };
    setSets((prevSets) => [...prevSets, newSet]);
    setCurrentSetName("");
  };

  const updateSet = (updatedSet: AlarmSet) => {
    setSets((prevSets) =>
      prevSets.map((set) => (set.id === updatedSet.id ? updatedSet : set))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Alarm</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Alarm Set Name"
          placeholderTextColor="#aaa"
          value={currentSetName}
          onChangeText={setCurrentSetName}
        />
        <TouchableOpacity style={styles.warmButton} onPress={handleAddSet}>
          <Text style={styles.warmButtonText}>Create Set</Text>
        </TouchableOpacity>
      </View>
      <AlarmSetList
        sets={sets}
        selectedSet={selectedSet}
        onSelectSet={setSelectedSet}
      />
      {selectedSet && (
        <AlarmDetails selectedSet={selectedSet} updateSet={updateSet} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#362F2D",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F5EFE6",
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
    backgroundColor: "#4F443F",
    color: "#F5EFE6",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  warmButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  warmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AlarmScreen;
