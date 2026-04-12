import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import { Text, Card, useTheme, TextInput, Button, Portal, Dialog, Divider, IconButton, SegmentedButtons } from 'react-native-paper';
import GradientButton from '../../components/GradientButton';

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

interface MixingTabProps {
  onSave: (data: any) => void;
}

export default function MixingTab({ onSave }: MixingTabProps) {
  const theme = useTheme();

  const [mill, setMill] = useState('mill1');
  const [time, setTime] = useState('');
  const [sheet, setSheet] = useState('');
  const [operator, setOperator] = useState<string>('');
  const [operatorMenuVisible, setOperatorMenuVisible] = useState(false);

  // Timer state
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
      setTime(formatTime(elapsed));
      setIsRunning(false);
    } else {
      setElapsed(0);
      setIsRunning(true);
    }
  };

  const handleTimeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const limited = cleaned.slice(0, 4);
    let formatted = limited;
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}:${limited.slice(2)}`;
    }
    setTime(formatted);
  };

  const openOperatorMenu = useCallback(() => {
    Keyboard.dismiss();
    setOperatorMenuVisible(true);
  }, []);
  const closeOperatorMenu = useCallback(() => setOperatorMenuVisible(false), []);

  const handleSelectOperator = useCallback((op: string) => {
    setOperator(op);
    setOperatorMenuVisible(false);
  }, []);

  const handleSave = () => {
    onSave({ mill, time, sheet, operator });
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
      
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

      {/* Unified Mixing Data Card */}
      <Card style={styles.formCard} mode="elevated">
        {/* Mill Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Mill:</Text>
          <SegmentedButtons
            value={mill}
            onValueChange={setMill}
            density="compact"
            style={styles.segmented}
            buttons={[
              { value: 'mill1', label: 'Mill 1' },
              { value: 'mill2', label: 'Mill 2' },
            ]}
          />
        </View>

        <Divider style={{ marginHorizontal: 16 }} />

        {/* Operator Row */}
        <View style={styles.fieldRow}>
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

        {/* Time Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <TextInput
            mode="outlined"
            dense
            placeholder="00:00"
            value={isRunning ? formatTime(elapsed) : time}
            onChangeText={handleTimeChange}
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

        <Divider style={{ marginHorizontal: 16 }} />

        {/* Sheet Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Sheet:</Text>
          <TextInput
            mode="outlined"
            dense
            value={sheet}
            placeholder="0.0"
            onChangeText={(val) => {
              if (/^\d*\.?\d*$/.test(val)) setSheet(val);
            }}
            keyboardType="numeric"
            style={styles.sheetInput}
            contentStyle={{ fontWeight: 'bold', textAlign: 'center' }}
          />
        </View>
      </Card>

      <GradientButton 
        text="Save Mixing Data"
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
  choiceCard: {
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 12,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  segmented: {
    maxWidth: 180,
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
  formCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  timerInput: {
    height: 36,
    width: 150,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  sheetInput: {
    height: 36,
    width: 150,
    backgroundColor: '#fff',
    fontSize: 14,
  }
});
