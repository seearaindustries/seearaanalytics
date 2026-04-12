import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AdminNavigator from './AdminNavigator';
import OperatorNavigator from './OperatorNavigator';

/**
 * RootNavigator — the single source of truth for which navigator is shown.
 *
 * Flow:
 *  loading  → full-screen spinner (session hydration)
 *  no user  → AuthStack (Login)
 *  supervisor → AdminNavigator (Dashboard + New Entry + Logs)
 *  operator   → OperatorNavigator (Logs + LogDetail, read-only)
 */
export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'supervisor' ? (
        <AdminNavigator />
      ) : (
        <OperatorNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
