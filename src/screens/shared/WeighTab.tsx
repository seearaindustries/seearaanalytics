import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import { Text, Card, useTheme, TextInput, Button, Portal, Dialog, Divider } from 'react-native-paper';

// Dummy data for Raw Materials
const DUMMY_RM_DATA = [
  { id: '1', name: 'RM1', std: '50' },
  { id: '2', name: 'RM2', std: '20' },
  { id: '3', name: 'RM3', std: '15' },
];

const DUMMY_OPERATORS = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Williams',
  'David Brown',
];

import GradientButton from '../../components/GradientButton';

interface WeighTabProps {
  onSave: (weights: Record<string, string>) => void;
}

export default function WeighTab({ onSave }: WeighTabProps) {
  const theme = useTheme();

  // Local state to store actual weights input by user
  const [actualWeights, setActualWeights] = useState<Record<string, string>>({});
  
  // Operator state
  const [operator, setOperator] = useState<string>('');
  const [operatorMenuVisible, setOperatorMenuVisible] = useState(false);

  // Stable callbacks for Portal Dialog
  const openOperatorMenu = useCallback(() => {
    Keyboard.dismiss();
    setOperatorMenuVisible(true);
  }, []);
  const closeOperatorMenu = useCallback(() => setOperatorMenuVisible(false), []);

  const handleSelectOperator = useCallback((op: string) => {
    setOperator(op);
    setOperatorMenuVisible(false);
  }, []);

  const handleInputChange = (id: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setActualWeights(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
      
      {/* Operator Selection */}
      <Card style={styles.operatorCard} mode="elevated">
        <View style={styles.operatorRow}>
          <Text style={styles.infoLabel}>Operator:</Text>
          <Button 
            mode="outlined" 
            onPress={openOperatorMenu}
            icon="chevron-down"
            contentStyle={{ flexDirection: 'row-reverse', paddingHorizontal: 4, height: 36 }}
            style={{ borderColor: theme.colors.outline, borderRadius: 8, minWidth: 150 }}
            labelStyle={{ marginVertical: 0 }}
            textColor={operator ? theme.colors.onSurface : theme.colors.onSurfaceVariant}
            compact
          >
            {operator || "Select"}
          </Button>
        </View>
      </Card>

      <Portal>
        <Dialog 
          visible={operatorMenuVisible} 
          onDismiss={closeOperatorMenu}
          style={{ backgroundColor: theme.colors.surface, borderRadius: 12 }}
        >
          <Dialog.Title style={{ color: theme.colors.secondary }}>Select Operator</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 300 }}>
              {DUMMY_OPERATORS.map((op, index) => (
                <React.Fragment key={op}>
                  <Button 
                    mode="text" 
                    onPress={() => handleSelectOperator(op)}
                    textColor={operator === op ? theme.colors.primary : theme.colors.onSurface}
                    contentStyle={{ justifyContent: 'flex-start', paddingVertical: 2 }}
                    labelStyle={{ fontSize: 14, fontWeight: operator === op ? 'bold' : 'normal' }}
                  >
                    {op}
                  </Button>
                  {index < DUMMY_OPERATORS.length - 1 && <Divider style={{ marginVertical: 2 }} />}
                </React.Fragment>
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeOperatorMenu} textColor={theme.colors.onSurfaceVariant}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Card style={styles.tableCard} mode="elevated">
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.customRow, styles.customHeader, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={styles.colName}>
              <Text variant="labelLarge" style={styles.headerText}>Material</Text>
            </View>
            <View style={styles.colStd}>
              <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>STD</Text>
            </View>
            <View style={styles.colAct}>
              <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>ACT</Text>
            </View>
          </View>

          {/* Table Rows */}
          {DUMMY_RM_DATA.map((item, index) => {
             const isLast = index === DUMMY_RM_DATA.length - 1;
             return (
              <View key={item.id} style={[styles.customRow, isLast && { borderBottomWidth: 0 }]}>
                <View style={styles.colName}>
                  <Text variant="bodyMedium" style={styles.dataText}>{item.name}</Text>
                </View>
                <View style={styles.colStd}>
                  <Text variant="bodyLarge" style={[styles.dataText, styles.stdText, { color: theme.colors.outline }]}>
                    {item.std}
                  </Text>
                </View>
                <View style={styles.colAct}>
                  <TextInput
                    mode="outlined"
                    dense
                    keyboardType="numeric"
                    placeholder="0.0"
                    value={actualWeights[item.id] || ''}
                    onChangeText={(val) => handleInputChange(item.id, val)}
                    style={styles.inputBox}
                    contentStyle={{ textAlign: 'center', fontWeight: 'bold' }}
                  />
                </View>
              </View>
             );
          })}
        </View>
      </Card>

      <GradientButton 
        text="Save Weighment"
        onPress={() => onSave(actualWeights)} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingTop: 0, paddingBottom: 50 },
  infoLabel: {
    fontWeight: '600',
    opacity: 0.7,
  },
  operatorCard: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tableCard: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
  },
  tableContainer: { width: '100%', overflow: 'hidden' },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 16,
    gap: 12,
  },
  customHeader: {
    minHeight: 48,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  colName: { flex: 0.4 },
  colStd: { flex: 0.25, alignItems: 'center' },
  colAct: { flex: 0.35, alignItems: 'center' },
  headerText: { fontWeight: '700', opacity: 0.8 },
  dataText: { opacity: 0.85, fontWeight: '600' },
  stdText: { fontSize: 16 },
  inputBox: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
  },
});
