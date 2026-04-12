import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Keyboard } from 'react-native';
import { Text, Card, useTheme, TextInput, Button, Portal, Dialog, Divider } from 'react-native-paper';
import GradientButton from '../../components/GradientButton';

const DUMMY_OPERATORS = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Williams',
  'David Brown',
];

interface PackingTabProps {
  onSave: (data: { piece: string; bins: string; dumpWt: string; hardness: string }) => void;
}

export default function PackingTab({ onSave }: PackingTabProps) {
  const theme = useTheme();

  const [piece, setPiece] = useState('');
  const [bins, setBins] = useState('');
  const [dumpWt, setDumpWt] = useState('');
  const [hardness, setHardness] = useState('');
  const [operator, setOperator] = useState<string>('');
  const [operatorMenuVisible, setOperatorMenuVisible] = useState(false);

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
    onSave({ piece, bins, dumpWt, hardness });
  };

  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (val: string) => {
     if (/^\d*\.?\d*$/.test(val)) setter(val);
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

      {/* Unified Packing Data Card */}
      <Card style={styles.formCard} mode="elevated">
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

        {/* Piece Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Piece:</Text>
          <TextInput
            mode="outlined"
            dense
            value={piece}
            placeholder="0"
            onChangeText={handleNumericInput(setPiece)}
            keyboardType="numeric"
            style={styles.numericInput}
            contentStyle={{ fontWeight: 'bold', textAlign: 'center' }}
          />
        </View>

        <Divider style={{ marginHorizontal: 16 }} />

        {/* Bins Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Bins:</Text>
          <TextInput
            mode="outlined"
            dense
            value={bins}
            placeholder="0"
            onChangeText={handleNumericInput(setBins)}
            keyboardType="numeric"
            style={styles.numericInput}
            contentStyle={{ fontWeight: 'bold', textAlign: 'center' }}
          />
        </View>

        <Divider style={{ marginHorizontal: 16 }} />

        {/* Dump Wt Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Dump Wt:</Text>
          <TextInput
            mode="outlined"
            dense
            value={dumpWt}
            placeholder="0.0"
            onChangeText={handleNumericInput(setDumpWt)}
            keyboardType="numeric"
            style={styles.numericInput}
            contentStyle={{ fontWeight: 'bold', textAlign: 'center' }}
          />
        </View>

        <Divider style={{ marginHorizontal: 16 }} />

        {/* Hardness Row */}
        <View style={styles.fieldRow}>
          <Text style={styles.infoLabel}>Hardness:</Text>
          <TextInput
            mode="outlined"
            dense
            value={hardness}
            placeholder="0.0"
            onChangeText={handleNumericInput(setHardness)}
            keyboardType="numeric"
            style={styles.numericInput}
            contentStyle={{ fontWeight: 'bold', textAlign: 'center' }}
          />
        </View>
      </Card>

      <GradientButton 
        text="Save Packing Data"
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
  numericInput: {
    height: 36,
    width: 150,
    backgroundColor: '#fff',
    fontSize: 14,
  }
});
