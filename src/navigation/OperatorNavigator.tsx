import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OperatorStackParamList } from '../types';
import LogsScreen from '../screens/shared/LogsScreen';
import LogDetailScreen from '../screens/shared/LogDetailScreen';
import BatchListScreen from '../screens/shared/BatchListScreen';
import BatchStagesScreen from '../screens/shared/BatchStagesScreen';

const Stack = createNativeStackNavigator<OperatorStackParamList>();

export default function OperatorNavigator() {
  return (
    <Stack.Navigator id="OperatorStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="LogsList"
        component={LogsScreen}
        options={{ title: 'Recent Logs' }}
      />
      <Stack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ title: 'Log Detail' }}
      />
      <Stack.Screen
        name="BatchList"
        component={BatchListScreen}
        options={{ title: 'Batches' }}
      />
      <Stack.Screen
        name="BatchStages"
        component={BatchStagesScreen}
        options={{ title: 'Batch Data Entry' }}
      />
    </Stack.Navigator>
  );
}
