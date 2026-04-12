import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';
import AppHeader from '../../components/AppHeader';

export default function DashboardScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle={t.dashboard} showLogout />
      <View style={styles.center}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
          {t.dashboard} Page
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
