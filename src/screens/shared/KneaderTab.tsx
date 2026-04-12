import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import { Text, Card, useTheme, TextInput, Button, Portal, Dialog, Divider, IconButton } from 'react-native-paper';
import GradientButton from '../../components/GradientButton';

// Dummy data for Kneader Steps
const DUMMY_KNEADER_DATA = [
  { id: '1', name: 'S1', std: '10' },
  { id: '2', name: 'S2', std: '5' },
];

const DUMMY_OPERATORS = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Williams',
  'David Brown',
];

// Helper to format seconds into MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface StepTimerRowProps {
  item: typeof DUMMY_KNEADER_DATA[0];
  isLast: boolean;
  value: string;
  onChange: (val: string) => void;
  theme: any;
}

function StepTimerRow({ item, isLast, value, onChange, theme }: StepTimerRowProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    if (isRunning) {
      // Stopping
      onChange(formatTime(elapsed));
      setIsRunning(false);
    } else {
      // Starting
      setElapsed(0);
      setIsRunning(true);
    }
  };

  const handleTextChange = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/[^0-9]/g, '');
    
    // Limit to 4 digits
    const limited = cleaned.slice(0, 4);
    
    // Format as MM:SS
    let formatted = limited;
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}:${limited.slice(2)}`;
    }
    
    onChange(formatted);
  };

  return (
    <View style={[styles.customRow, isLast && { borderBottomWidth: 0 }]}>
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
          placeholder="00:00"
          value={isRunning ? formatTime(elapsed) : value}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          style={styles.timerInput}
          contentStyle={{ textAlign: 'center', fontWeight: 'bold' }}
          editable={!isRunning}
          right={
            <TextInput.Icon 
              icon={isRunning ? "stop-circle" : "play-circle"} 
              color={isRunning ? theme.colors.error : theme.colors.primary}
              onPress={toggleTimer}
            />
          }
        />
      </View>
    </View>
  );
}

interface KneaderTabProps {
  onSave: (data: any) => void;
}

export default function KneaderTab({ onSave }: KneaderTabProps) {
  const theme = useTheme();

  const [actualValues, setActualValues] = useState<Record<string, string>>({});
  const [dumpTemp, setDumpTemp] = useState('');
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
    setActualValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave({
      operator,
      dumpTemperature: dumpTemp,
      stepValues: actualValues,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
      
      {/* Operator & Temp Card */}
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
        <Divider style={{ marginHorizontal: 16 }} />
        <View style={styles.tempRow}>
          <Text style={styles.infoLabel}>Dump Temp (°C):</Text>
          <TextInput
            mode="outlined"
            dense
            keyboardType="numeric"
            placeholder="0.0"
            value={dumpTemp}
            onChangeText={(val) => { if (/^\d*\.?\d*$/.test(val)) setDumpTemp(val); }}
            style={styles.tempInput}
            contentStyle={{ fontWeight: 'bold' }}
          />
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
              <Text variant="labelLarge" style={styles.headerText}>Steps</Text>
            </View>
            <View style={styles.colStd}>
              <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>STD</Text>
            </View>
            <View style={styles.colAct}>
              <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>ACT</Text>
            </View>
          </View>

          {/* Table Rows with Timer Logic */}
          {DUMMY_KNEADER_DATA.map((item, index) => (
            <StepTimerRow
              key={item.id}
              item={item}
              isLast={index === DUMMY_KNEADER_DATA.length - 1}
              value={actualValues[item.id] || ''}
              onChange={(val) => handleInputChange(item.id, val)}
              theme={theme}
            />
          ))}
        </View>
      </Card>

      <GradientButton 
        text="Save Kneader Data"
        onPress={handleSave} 
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
    marginBottom: 12,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tempCard: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 16,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tempInput: {
    height: 36,
    width: 100,
    backgroundColor: '#fff',
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
  colName: { flex: 0.35 },
  colStd: { flex: 0.2, alignItems: 'center' },
  colAct: { flex: 0.45, alignItems: 'center' },
  headerText: { fontWeight: '700', opacity: 0.8 },
  dataText: { opacity: 0.85, fontWeight: '600' },
  stdText: { fontSize: 16 },
  
  timerInput: {
    height: 36,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 14,
  }
});
