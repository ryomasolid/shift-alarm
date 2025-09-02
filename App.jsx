import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AlarmScreen from "./AlarmScreen";
import CalendarScreen from "./CalendarScreen";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Alarms"
        screenOptions={{
          tabBarActiveTintColor: "#3498db",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#2c3e50",
            borderTopColor: "#34495e",
          },
          headerShown: false, // Hide the header to provide more screen space
        }}
      >
        <Tab.Screen name="Alarms" component={AlarmScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
