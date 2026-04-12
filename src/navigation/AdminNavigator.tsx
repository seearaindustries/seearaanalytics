import React from 'react';
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminTabParamList, LogsStackParamList } from '../types';
import DashboardScreen from '../screens/admin/DashboardScreen';
import FormScreen from '../screens/admin/FormScreen';
import LogsScreen from '../screens/shared/LogsScreen';
import TrackScreen from '../screens/shared/TrackScreen';
import LogDetailScreen from '../screens/shared/LogDetailScreen';
import BatchListScreen from '../screens/shared/BatchListScreen';
import BatchStagesScreen from '../screens/shared/BatchStagesScreen';

// Using react-native-paper's MaterialCommunityIcon names via tabBarIcon
const ICONS: Record<string, { focused: string; default: string }> = {
  Dashboard: { focused: 'view-dashboard', default: 'view-dashboard-outline' },
  NewEntry: { focused: 'plus-circle', default: 'plus-circle-outline' },
  Track: { focused: 'chart-line', default: 'chart-line-variant' },
  Logs: { focused: 'clipboard-list', default: 'clipboard-list-outline' },
};

const Tab = createBottomTabNavigator<AdminTabParamList>();
const LogsStack = createNativeStackNavigator<LogsStackParamList>();

// Logs tab is its own stack so LogDetail can be pushed inside the tab
function LogsTabStack() {
  return (
    <LogsStack.Navigator id="LogsStack" screenOptions={{ headerShown: false }}>
      <LogsStack.Screen
        name="LogsList"
        component={LogsScreen}
        options={{ title: 'Recent Logs' }}
      />
      <LogsStack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ title: 'Log Detail' }}
      />
      <LogsStack.Screen
        name="BatchList"
        component={BatchListScreen}
        options={{ title: 'Batches' }}
      />
      <LogsStack.Screen
        name="BatchStages"
        component={BatchStagesScreen}
        options={{ title: 'Batch Data Entry' }}
      />
    </LogsStack.Navigator>
  );
}

export default function AdminNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      id="AdminTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused 
            ? ICONS[route.name].focused 
            : ICONS[route.name].default;
          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="NewEntry" component={FormScreen} options={{ title: 'New Entry' }} />
      <Tab.Screen name="Track" component={TrackScreen} options={{ title: 'Track' }} />
      <Tab.Screen 
        name="Logs" 
        component={LogsTabStack} 
        options={{ title: 'Logs' }} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Force navigation to the top-level screen of the stack
            navigation.navigate('Logs', { screen: 'LogsList' });
          },
        })}
      />
    </Tab.Navigator>
  );
}
