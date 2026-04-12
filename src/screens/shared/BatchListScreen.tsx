import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import AppHeader from '../../components/AppHeader';
import { LogsStackParamList, ProductionLog } from '../../types';

type BatchRouteProp = RouteProp<LogsStackParamList, 'BatchList'>;

export default function BatchListScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const route = useRoute<BatchRouteProp>();
  const log = route.params.log;

  const numBatches = parseInt(log.num_batches, 10) || 0;
  const batches = Array.from({ length: numBatches }, (_, i) => i + 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle={`Batches: ${log.recipe}`} showBack onBack={() => navigation.goBack()} showLogout />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerInfo}>
           <Text variant="titleMedium" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
             {log.date}
           </Text>
           <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
             Total Batches: {numBatches}
           </Text>
        </View>

        {batches.map((batchNumber) => (
          <Card 
            key={batchNumber} 
            style={styles.card} 
            mode="elevated"
            onPress={() => {
              // MOCK LOGIC: Simulate smart resumption.
              // If it's Batch 1, assume Weighment is done and open Kneader.
              // Everything else opens on Weighment.
              const initialStage = batchNumber === 1 ? 'kneader' : 'weigh';
              navigation.navigate('BatchStages', { log, batchNumber, initialStage });
            }}
          >
            <LinearGradient
              colors={[theme.colors.primary + '1A', theme.colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Card.Content style={styles.cardContent}>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Batch {batchNumber}
                </Text>
                <Text variant="bodyMedium" style={{ opacity: 0.7, marginTop: 4 }}>
                  {t.recipe}: {log.recipe}
                </Text>
              </Card.Content>
            </LinearGradient>
          </Card>
        ))}

        {batches.length === 0 && (
          <View style={styles.emptyState}>
             <Text style={{ opacity: 0.6 }}>No batches recorded for this log.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  headerInfo: {
    marginBottom: 20,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  card: { 
    marginBottom: 12,
    borderRadius: 12,
  },
  gradient: {
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 12,
  },
  cardTitle: {
    fontWeight: '700',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center'
  }
});
