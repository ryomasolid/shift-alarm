import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import AppButton from "./AppButton";

type Props = {
  handleAddAlarm: (value: string) => void;
};

export default function CustomPicker({ handleAddAlarm }: Props) {
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // 時刻の選択肢を生成
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <>
      <View style={styles.formContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedHour}
            onValueChange={(val) => setSelectedHour(val)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {hours.map((hour) => (
              <Picker.Item key={hour} label={hour} value={hour} color="#000" />
            ))}
          </Picker>
        </View>

        <Text style={styles.separator}>:</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMinute}
            onValueChange={(val) => setSelectedMinute(val)}
            style={styles.picker}
            itemStyle={styles.pickerItem} // iOS用
          >
            {minutes.map((minute) => (
              <Picker.Item
                key={minute}
                label={minute}
                value={minute}
                color="#000"
              />
            ))}
          </Picker>
        </View>
      </View>

      <AppButton
        title="Add Alarm"
        onPress={() => handleAddAlarm(selectedHour + ":" + selectedMinute)}
        style={undefined}
      />
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  pickerWrapper: {
    flex: 1,
  },
  picker: {
    width: "100%",
    color: "#F5EFE6",
  },
  pickerItem: {
    fontSize: 32,
    color: "#F5EFE6",
  },
  separator: {
    fontSize: 40,
    color: "#E67451",
  },
});
