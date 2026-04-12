import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, IconButton, useTheme, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import { LogsStackParamList, ProductionLog } from '../../types';

type NavigationProp = NativeStackNavigationProp<LogsStackParamList, 'LogsList'>;

export default function LogsScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused(); // To refresh data when tab is focused

  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchLogs();
    }
  }, [isFocused]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('production_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching logs:', error.message);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.log('Exception in fetchLogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowPress = (log: ProductionLog) => {
    navigation.navigate('LogDetail', { log });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle={t.logs} showLogout />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text variant="titleMedium" style={[styles.listHeader, { color: theme.colors.secondary }]}>
            Work Order
          </Text>
          {loading && <ActivityIndicator size={16} color={theme.colors.primary} />}
        </View>
        
        <Card style={styles.listCard} mode="elevated">
          <View style={styles.tableContainer}>
            {/* Custom Grid Header */}
            <View style={[styles.customRow, styles.customHeader, { backgroundColor: theme.colors.surfaceVariant }]}>
              <View style={styles.colDate}>
                <Text variant="labelLarge" style={styles.headerText}>{t.date}</Text>
              </View>
              <View style={styles.colRecipe}>
                <Text variant="labelLarge" style={styles.headerText}>{t.recipe}</Text>
              </View>
              <View style={styles.colOrder}>
                <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>Order</Text>
              </View>
              <View style={styles.colBatches}>
                <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>{t.noBatches}</Text>
              </View>
            </View>

            {/* Custom Grid Rows */}
            {logs.map((item) => (
              <TouchableRipple 
                key={item.id} 
                onPress={() => navigation.navigate('BatchList', { log: item })}
                rippleColor="rgba(0, 0, 0, .05)"
              >
                <View style={styles.customRow}>
                  <View style={styles.colDate}>
                    <Text variant="bodyMedium" style={styles.dataText}>{item.date}</Text>
                  </View>
                  <View style={styles.colRecipe}>
                    <Text variant="bodyMedium" numberOfLines={1} style={[styles.dataText, styles.recipeText]}>
                      {item.recipe}
                    </Text>
                  </View>
                  <View style={styles.colOrder}>
                    <Text variant="bodyMedium" style={[styles.dataText, { textAlign: 'center' }]}>
                      {item.total_order}
                    </Text>
                  </View>
                  <View style={styles.colBatches}>
                    <Text variant="bodyMedium" style={[styles.dataText, styles.numBatchesText, { textAlign: 'center' }]}>
                      {item.num_batches}
                    </Text>
                  </View>
                </View>
              </TouchableRipple>
            ))}
            
            {logs.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Text style={{ textAlign: 'center', color: theme.colors.outline }}>
                  {t.noLogs}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingLeft: 4,
    paddingRight: 4,
  },
  listHeader: { fontWeight: 'bold' },
  listCard: { overflow: 'hidden', borderRadius: 12, elevation: 1 },
  tableContainer: { width: '100%', overflow: 'hidden' },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56, // Industry standard comfortable row height
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 16,
    gap: 12, // Perfect gutting between cols manually
  },
  customHeader: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  // Exact column sizing using fixed Flex percentages
  colDate: { flex: 0.35 },     
  colRecipe: { flex: 0.32 },   
  colOrder: { flex: 0.23, alignItems: 'center' },
  colBatches: { flex: 0.23 },  

  headerText: { fontWeight: '700', opacity: 0.8 },
  dataText: { opacity: 0.85 },
  recipeText: { fontWeight: '600', opacity: 1 }, // Highlighted text
  numBatchesText: { fontWeight: '600' },
  actionIcon: { margin: 0 },
  emptyState: { padding: 32, alignItems: 'center', justifyContent: 'center' },
});
