import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Card, useTheme, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { LogsStackParamList } from '../../types';

import WeighTab from './WeighTab';
import KneaderTab from './KneaderTab';
import MixingTab from './MixingTab';
import PackingTab from './PackingTab';

type BatchStagesRouteProp = RouteProp<LogsStackParamList, 'BatchStages'>;

export default function BatchStagesScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<BatchStagesRouteProp>();
  const { log, batchNumber, initialStage = 'weigh' } = route.params;

  const [activeStage, setActiveStage] = useState<string>(initialStage);

  const handleSaveWeigh = (data: any) => {
    console.log("Weigh Saved:", data);
    setActiveStage('kneader'); // Auto-advance
  };

  const handleSaveKneader = (data: any) => {
    console.log("Kneader Saved:", data);
    setActiveStage('mixing'); // Auto-advance
  };

  const handleSaveMixing = (data: any) => {
    console.log("Mixing Saved:", data);
    setActiveStage('packing'); // Auto-advance
  };

  const handleSavePacking = (data: any) => {
    console.log("Packing Saved:", data);
    navigation.goBack(); // Finished flow
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle={`Batch ${batchNumber}`} showBack onBack={() => navigation.goBack()} showLogout />
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.fixedHeader}>
          {/* Master Tab Bar */}
          <SegmentedButtons
            value={activeStage}
            onValueChange={setActiveStage}
            buttons={[
              { value: 'weigh', label: 'Weigh' },
              { value: 'kneader', label: 'Kneader' },
              { value: 'mixing', label: 'Mix' },
              { value: 'packing', label: 'Pack' },
            ]}
            style={styles.tabs}
          />

          {/* Header Information Card - Rendered exactly once for all tabs! */}
          <Card style={styles.infoCard} mode="elevated">
            <Card.Content>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date:</Text>
                <Text style={styles.infoValue}>{log.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Recipe:</Text>
                <Text style={styles.infoValue}>{log.recipe}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Batch Code:</Text>
                <Text style={styles.infoValue}>{log.batch_code}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                <Text style={styles.infoLabel}>Kneader:</Text>
                <Text style={styles.infoValue}>{log.kneader}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Dynamic Tab Rendering */}
        <View style={styles.tabContentContainer}>
           {activeStage === 'weigh' && <WeighTab onSave={handleSaveWeigh} />}
           {activeStage === 'kneader' && <KneaderTab onSave={handleSaveKneader} />}
           {activeStage === 'mixing' && <MixingTab onSave={handleSaveMixing} />}
           {activeStage === 'packing' && <PackingTab onSave={handleSavePacking} />}
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  fixedHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontWeight: '600',
    opacity: 0.7,
  },
  infoValue: {
    fontWeight: '700',
  },
  tabs: {
    marginBottom: 16,
  },
  tabContentContainer: {
    flex: 1,
  }
});
