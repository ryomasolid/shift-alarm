import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AlarmScreen from "./AlarmScreen";
import CalendarScreen from "./CalendarScreen";
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Alarms"
        screenOptions={{
          // アクティブなタブの色をオレンジに
          tabBarActiveTintColor: "#ff7f50", // Coral
          // 非アクティブなタブの色を少し暗めのオレンジに
          tabBarInactiveTintColor: "#a52a2a", // Brown
          tabBarStyle: {
            // タブバーの背景色を暖色系の暗い色に
            backgroundColor: "#2e2e2e",
            // タブバーの上の境界線を暖色系の色に
            borderTopColor: "#b22222", // Firebrick
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Alarms"
          component={AlarmScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="bell" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
