import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text, TextInput, Button, HelperText, SegmentedButtons, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import { LogsStackParamList } from '../../types';

type DetailRouteProp = RouteProp<LogsStackParamList, 'LogDetail'>;

import GradientButton from '../../components/GradientButton';

export default function LogDetailScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<DetailRouteProp>();
  const log = route.params.log;

  const isSupervisor = user?.role === 'supervisor';

  // --- Form State initialized with passed log data ---
  const [date, setDate] = useState(log.date);
  const [recipe, setRecipe] = useState(log.recipe);
  const [batchCode, setBatchCode] = useState(log.batch_code);
  const [kneader, setKneader] = useState(log.kneader);
  const [totalOrder, setTotalOrder] = useState<string>(log.total_order.toString());
  const [numBatches, setNumBatches] = useState<string>(log.num_batches.toString());
  const [shift, setShift] = useState(log.shift);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate instanceof Date) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
      if (errors.date) setErrors({ ...errors, date: '' });
    }
  };
  
  const [errors, setErrors] = useState({
    date: '', recipe: '', batchCode: '', kneader: '', totalOrder: '',
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!date.trim()) { newErrors.date = t.required; isValid = false; } else newErrors.date = '';
    if (!recipe.trim()) { newErrors.recipe = t.required; isValid = false; } else newErrors.recipe = '';
    if (!batchCode.trim()) { newErrors.batchCode = t.required; isValid = false; } else newErrors.batchCode = '';
    if (!totalOrder.trim()) { newErrors.totalOrder = t.required; isValid = false; }
    else if (isNaN(Number(totalOrder))) { newErrors.totalOrder = t.mustBeNumber; isValid = false; }
    else newErrors.totalOrder = '';

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      date, recipe, batch_code: batchCode, kneader, total_order: totalOrder, num_batches: numBatches, shift
    };

    const { error } = await supabase
      .from('production_logs')
      .update(payload)
      .eq('id', log.id);

    if (error) {
      Alert.alert(t.error, error.message);
    } else {
      Alert.alert(t.success, t.entryUpdated);
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert(t.deleteTitle, t.deleteMessage, [
      { text: t.cancelBtn, style: "cancel" },
      { 
        text: t.delete, 
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          const { error } = await supabase.from('production_logs').delete().eq('id', log.id);
          setLoading(false);
          if (error) Alert.alert(t.error, error.message);
          else navigation.goBack();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle={isSupervisor ? t.editEntry : t.logDetail} showBack onBack={() => navigation.goBack()} showLogout />
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card} mode="elevated">
            <Card.Content style={styles.formContent}>
              
              <Pressable onPress={() => isSupervisor && setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <TextInput
                    label={t.date}
                    value={date}
                    mode="outlined"
                    style={styles.input}
                    editable={false}
                    left={<TextInput.Icon icon="calendar-outline" />}
                    error={!!errors.date}
                  />
                </View>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(date)}
                  mode="date"
                  display="default"
                  onValueChange={(date) => onDateChange(date)}
                  onDismiss={() => setShowDatePicker(false)}
                />
              )}
              {!!errors.date && <HelperText type="error" visible>{errors.date}</HelperText>}

              <View style={styles.row}>
                 <View style={styles.col}>
                   <TextInput
                    label={t.recipe}
                    value={recipe}
                    mode="outlined"
                    style={styles.input}
                    editable={isSupervisor}
                    onChangeText={(val) => { setRecipe(val); if(errors.recipe) setErrors({...errors, recipe: ''}) }}
                    error={!!errors.recipe}
                   />
                   {!!errors.recipe && <HelperText type="error" visible>{errors.recipe}</HelperText>}
                 </View>
                 <View style={styles.colSpace} />
                 <View style={styles.col}>
                   <TextInput
                    label={t.batchCode}
                    value={batchCode}
                    mode="outlined"
                    style={styles.input}
                    editable={isSupervisor}
                    onChangeText={(val) => { setBatchCode(val); if(errors.batchCode) setErrors({...errors, batchCode: ''}) }}
                    error={!!errors.batchCode}
                   />
                   {!!errors.batchCode && <HelperText type="error" visible>{errors.batchCode}</HelperText>}
                 </View>
              </View>

              <Text style={[styles.label, { color: theme.colors.secondary }]}>{t.kneaderCapacity}</Text>
              <SegmentedButtons
                value={kneader}
                onValueChange={(val) => { setKneader(val); if(errors.kneader) setErrors({...errors, kneader: ''}) }}
                buttons={[
                  { value: '35L', label: '35L', disabled: !isSupervisor },
                  { value: '55L', label: '55L', disabled: !isSupervisor },
                ]}
                style={styles.segment}
              />

              <View style={styles.row}>
                 <View style={styles.col}>
                   <TextInput
                    label={t.totalOrder}
                    value={totalOrder}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                    editable={isSupervisor}
                    onChangeText={(val) => { setTotalOrder(val); if(errors.totalOrder) setErrors({...errors, totalOrder: ''}) }}
                    error={!!errors.totalOrder}
                   />
                   {!!errors.totalOrder && <HelperText type="error" visible>{errors.totalOrder}</HelperText>}
                 </View>
                 <View style={styles.colSpace} />
                 <View style={styles.col}>
                   <TextInput
                    label={t.noBatches}
                    value={numBatches}
                    mode="outlined"
                    editable={false}
                    style={[styles.input, { backgroundColor: theme.colors.elevation.level2 }]} 
                    textColor={theme.colors.onSurfaceDisabled}
                   />
                 </View>
              </View>

              <Text style={[styles.label, { color: theme.colors.secondary }]}>{t.shift}</Text>
              <SegmentedButtons
                value={shift}
                onValueChange={setShift}
                buttons={[
                  { value: 'Morning', label: t.morning, disabled: !isSupervisor },
                  { value: 'Evening', label: t.evening, disabled: !isSupervisor },
                  { value: 'Night', label: t.night, disabled: !isSupervisor },
                ]}
                style={styles.segment}
              />

              {isSupervisor && (
                <View style={styles.actionButtons}>
                  <GradientButton 
                    text={t.update}
                    onPress={handleUpdate} 
                    loading={loading}
                    disabled={loading}
                  />
                  <Button 
                    mode="outlined" 
                    onPress={handleDelete} 
                    textColor={theme.colors.error}
                    style={styles.deleteBtn}
                    disabled={loading}
                  >
                    {t.delete}
                  </Button>
                </View>
              )}

            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { padding: 16, paddingBottom: 50 },
  card: { marginBottom: 20 },
  formContent: { paddingTop: 10 },
  input: { marginBottom: 4 },
  label: { marginBottom: 8, marginTop: 4, fontWeight: '500' },
  segment: { marginBottom: 20 },
  actionButtons: { marginTop: 16, gap: 12 },
  updateBtn: { borderRadius: 8, paddingVertical: 4 },
  deleteBtn: { borderRadius: 8, borderColor: 'transparent' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  col: { flex: 1 },
  colSpace: { width: 12 },
});
