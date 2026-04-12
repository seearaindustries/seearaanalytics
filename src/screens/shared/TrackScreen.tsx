import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, useTheme, ProgressBar, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';

const DUMMY_TRACKING_DATA = [
  { id: '1', recipe: 'Recipe A', batch: 'B001', stage: 'Kneader', progress: 0.5, operator: 'John Doe' },
  { id: '2', recipe: 'Recipe B', batch: 'B042', stage: 'Weighing', progress: 0.2, operator: 'Jane Smith' },
  { id: '3', recipe: 'Recipe C', batch: 'B015', stage: 'Packing', progress: 0.9, operator: 'Mike Johnson' },
  { id: '4', recipe: 'Recipe A', batch: 'B002', stage: 'Mixing', progress: 0.75, operator: 'Sarah Williams' },
];

export default function TrackScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle="Production Tracking" showLogout />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Active Batches</Text>
        
        {DUMMY_TRACKING_DATA.map((item) => (
          <Card key={item.id} style={styles.card} mode="elevated">
            <Card.Content>
              <View style={styles.cardHeader}>
                <View>
                  <Text variant="titleMedium" style={{ fontWeight: '700' }}>{item.recipe}</Text>
                  <Text variant="bodySmall" style={{ opacity: 0.6 }}>Batch: {item.batch}</Text>
                </View>
                <Avatar.Icon size={40} icon="factory" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>{item.stage}</Text>
                  <Text variant="labelMedium">{Math.round(item.progress * 100)}%</Text>
                </View>
                <ProgressBar progress={item.progress} color={theme.colors.primary} style={styles.progressBar} />
              </View>

              <View style={styles.footer}>
                <Text variant="bodySmall" style={{ opacity: 0.7 }}>Operator: {item.operator}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  }
});
