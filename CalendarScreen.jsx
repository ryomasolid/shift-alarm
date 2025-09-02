import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 通知が鳴ったときの動作を設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const getFormattedDate = (year, month, day) => {
  const m = (month + 1).toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}`;
};

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [schedules, setSchedules] = useState({});

  useEffect(() => {
    // 通知の権限をリクエスト
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "通知の許可が必要です",
          "設定画面から通知を有効にしてください。"
        );
      }
    };
    requestPermissions();

    const loadData = async () => {
      const storedSets = await AsyncStorage.getItem("alarmSets");
      if (storedSets) {
        setAlarms(JSON.parse(storedSets));
      }
      const storedCalendar = await AsyncStorage.getItem("calendarSchedules");
      if (storedCalendar) {
        setSchedules(JSON.parse(storedCalendar));
      }
    };
    loadData();
  }, []);

  const handleDayPress = (day) => {
    const formattedDate = getFormattedDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(formattedDate);
    const assignedSet = schedules[formattedDate] || null;
    setSelectedSet(assignedSet);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ id: `empty-${i}`, day: "" });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ id: `day-${i}`, day: i });
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Text style={styles.navButton}>&lt;</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.navButton}>&gt;</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekdays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>
        <FlatList
          data={calendarDays}
          keyExtractor={(item) => item.id}
          numColumns={7}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayContainer,
                selectedDate === getFormattedDate(year, month, item.day) &&
                  styles.selectedDay,
              ]}
              onPress={() => item.day && handleDayPress(item.day)}
            >
              <Text style={styles.dayText}>{item.day}</Text>
              {schedules[getFormattedDate(year, month, item.day)] && (
                <Text style={styles.assignedSetName}>
                  {schedules[
                    getFormattedDate(year, month, item.day)
                  ].name.substring(0, 5) + "..."}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const handleAssignSet = async (set) => {
    const newSchedules = { ...schedules, [selectedDate]: set };
    setSchedules(newSchedules);
    await AsyncStorage.setItem(
      "calendarSchedules",
      JSON.stringify(newSchedules)
    );
    setSelectedSet(set);

    if (set.alarms && set.alarms.length > 0) {
      scheduleAlarms(set.alarms, set.name);
    }
  };

  const handleUnassignSet = async () => {
    const newSchedules = { ...schedules };
    delete newSchedules[selectedDate];
    setSchedules(newSchedules);
    await AsyncStorage.setItem(
      "calendarSchedules",
      JSON.stringify(newSchedules)
    );
    setSelectedSet(null);
  };

  const scheduleAlarms = async (alarmsToSchedule, assignedSetName) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const formattedDate = new Date(selectedDate);

    for (const alarm of alarmsToSchedule) {
      const [hour, minute] = alarm.time.split(":").map(Number);

      const trigger = new Date(
        formattedDate.getFullYear(),
        formattedDate.getMonth(),
        formattedDate.getDate(),
        hour,
        minute,
        0
      );

      // 通知のスケジュール
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Shift Alarm",
          body: `It's time for your ${assignedSetName} shift!`,
          sound: true,
          vibration: [0, 250, 250, 250],
        },
        trigger: {
          date: trigger,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Alarm Calendar</Text>
      {renderCalendar()}

      {selectedDate && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.selectedDateText}>Selected: {selectedDate}</Text>
          {selectedSet ? (
            <View style={styles.assignedSetView}>
              <Text style={styles.assignedSetInfoText}>
                Assigned Set: {selectedSet.name}
              </Text>
              <TouchableOpacity onPress={handleUnassignSet}>
                <Text style={styles.unassignButton}>Unassign</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.instructionText}>
                Select an alarm set to assign:
              </Text>
              <FlatList
                data={alarms}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleAssignSet(item)}
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
                ListEmptyComponent={() => (
                  <Text style={styles.emptyText}>
                    No alarm sets found. Please create one on the other screen.
                  </Text>
                )}
              />
            </>
          )}
        </View>
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
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 20,
  },
  calendarContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#34495e",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  navButton: {
    color: "#ecf0f1",
    fontSize: 24,
  },
  monthText: {
    color: "#ecf0f1",
    fontSize: 20,
    fontWeight: "bold",
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  weekdayText: {
    color: "#bdc3c7",
    fontWeight: "bold",
  },
  dayContainer: {
    width: `${100 / 7}%`,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 5,
  },
  selectedDay: {
    borderColor: "#3498db",
    backgroundColor: "#1f2937",
  },
  dayText: {
    color: "#ecf0f1",
    fontSize: 16,
  },
  assignedSetName: {
    color: "#2ecc71",
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  scheduleContainer: {
    width: "100%",
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#34495e",
  },
  selectedDateText: {
    color: "#3498db",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    color: "#bdc3c7",
    marginBottom: 10,
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
  emptyText: {
    color: "#bdc3c7",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  assignedSetView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  assignedSetInfoText: {
    color: "#ecf0f1",
    fontSize: 16,
  },
  unassignButton: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
});

export default CalendarScreen;
