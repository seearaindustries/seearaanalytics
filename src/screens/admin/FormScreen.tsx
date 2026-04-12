import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, KeyboardAvoidingView, Platform, Pressable, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, HelperText, SegmentedButtons, Card, useTheme, ActivityIndicator, TouchableRipple, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import { AdminTabParamList, ProductionLog, LogsStackParamList } from '../../types';
import GradientButton from '../../components/GradientButton';

type NavigationProp = BottomTabNavigationProp<AdminTabParamList, 'NewEntry'> & NativeStackNavigationProp<LogsStackParamList, 'LogsList'>;

export default function FormScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();

  // --- Form Toggle State ---
  const [isFormVisible, setIsFormVisible] = useState(false);

  // --- Form State ---
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recipe, setRecipe] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [kneader, setKneader] = useState('35L');
  const [totalOrder, setTotalOrder] = useState('');
  const [numBatches, setNumBatches] = useState('5');
  const [shift, setShift] = useState('Morning');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- History State ---
  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  
  // --- Edit State ---
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isFocused) {
      fetchLogs();
    }
  }, [isFocused]);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
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
      setLoadingLogs(false);
    }
  };

  const handleRowPress = (log: ProductionLog) => {
    if (user?.role === 'supervisor') {
      // Enter Edit Mode on the same screen
      setDate(log.date);
      setRecipe(log.recipe);
      setBatchCode(log.batch_code);
      setKneader(log.kneader);
      setTotalOrder(String(log.total_order));
      setNumBatches(String(log.num_batches));
      setShift(log.shift);
      setEditingId(log.id);
      setIsFormVisible(true);
      setErrors({ date: '', recipe: '', batchCode: '', kneader: '', totalOrder: '' });
    } else {
      // Just navigate to view
      navigation.navigate('Logs', { screen: 'BatchList', params: { log } } as any);
    }
  };
  
  // --- Validation State ---
  const [errors, setErrors] = useState({
    date: '',
    recipe: '',
    batchCode: '',
    kneader: '',
    totalOrder: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setRecipe('');
    setBatchCode('');
    setKneader('35L');
    setTotalOrder('');
    setNumBatches('5');
    setShift('Morning');
    setEditingId(null); // Clear edit mode
    setErrors({ date: '', recipe: '', batchCode: '', kneader: '', totalOrder: '' });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!date.trim()) { newErrors.date = `${t.date} ${t.required}`; isValid = false; } else { newErrors.date = ''; }
    if (!recipe.trim()) { newErrors.recipe = `${t.recipe} ${t.required}`; isValid = false; } else { newErrors.recipe = ''; }
    if (!batchCode.trim()) { newErrors.batchCode = `${t.batchCode} ${t.required}`; isValid = false; } else { newErrors.batchCode = ''; }
    if (!kneader.trim()) { newErrors.kneader = `${t.kneader} ${t.required}`; isValid = false; } else { newErrors.kneader = ''; }
    if (!totalOrder.trim()) { newErrors.totalOrder = `${t.totalOrder} ${t.required}`; isValid = false; } else if (isNaN(Number(totalOrder))) { newErrors.totalOrder = t.mustBeNumber; isValid = false; } else { newErrors.totalOrder = ''; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      date,
      recipe,
      batch_code: batchCode,
      kneader,
      total_order: totalOrder,
      num_batches: numBatches,
      shift
    };

    let errorResult;

    if (editingId) {
      const { error } = await supabase
        .from('production_logs')
        .update(payload)
        .eq('id', editingId);
      errorResult = error;
    } else {
      const { error } = await supabase
        .from('production_logs')
        .insert([payload]);
      errorResult = error;
    }

    if (errorResult) {
      Alert.alert(t.error, errorResult.message);
    } else {
      Alert.alert(t.success, editingId ? 'Entry successfully updated' : t.entrySaved);
      resetForm();
      setIsFormVisible(false);
      fetchLogs(); // Refresh history immediately
    }
    setSubmitting(false);
  };

  const onDateChange = (selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && selectedDate instanceof Date) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
      if (errors.date) setErrors({ ...errors, date: '' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader subtitle={t.newEntry} showLogout />
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Elegant Full-Width Action Banner */}
          <TouchableOpacity
            onPress={() => {
              if (isFormVisible && editingId) {
                resetForm();
              }
              setIsFormVisible(!isFormVisible);
            }}
            activeOpacity={0.9}
            style={styles.heroBannerContainer}
          >
            <LinearGradient
              colors={['#f09d51', '#ea7d2e', '#d1641a']} // Keep Premium brand orange always
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                
                {/* Left Badge */}
                <View style={styles.iconCircle}>
                  <IconButton 
                    icon={isFormVisible ? (editingId ? "pencil-off" : "close") : "plus"} 
                    iconColor="#e65c00" // Keep icon color brand orange
                    size={22}
                    style={{ margin: 0 }}
                  />
                </View>

                {/* Middle Text */}
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroText}>
                    {isFormVisible ? (editingId ? "Cancel Update" : "Close Form") : "Create New Entry"}
                  </Text>
                  <Text style={styles.heroSubText}>
                    {isFormVisible 
                      ? "Discard current progress" 
                      : "Start a new production batch log"
                    }
                  </Text>
                </View>

                {/* Right Action Chevron */}
                <IconButton 
                  icon={isFormVisible ? "chevron-up" : "chevron-down"} 
                  iconColor="rgba(255, 255, 255, 0.8)" 
                  size={24}
                  style={{ margin: 0 }}
                />

              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Collapsible Form */}
          {isFormVisible && (
            <Card style={styles.card} mode="elevated">
              {/* Form rows using compact layout */}
              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.date}:</Text>
                <Pressable onPress={() => setShowDatePicker(true)} style={styles.inputWrapper}>
                  <View pointerEvents="none">
                    <TextInput
                      dense
                      mode="outlined"
                      value={date}
                      style={styles.numericInput}
                      editable={false}
                      right={<TextInput.Icon icon="calendar-outline" />}
                      error={!!errors.date}
                    />
                  </View>
                </Pressable>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(date)}
                  mode="date"
                  display="default"
                  onValueChange={(date) => onDateChange(date)}
                  onDismiss={() => setShowDatePicker(false)}
                />
              )}
              {!!errors.date && <HelperText type="error" visible style={styles.errorText}>{errors.date}</HelperText>}
              <Divider style={{ marginHorizontal: 16 }} />

              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.recipe}:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    dense
                    mode="outlined"
                    value={recipe}
                    style={styles.numericInput}
                    onChangeText={(val) => { setRecipe(val); if(errors.recipe) setErrors({...errors, recipe: ''}) }}
                    error={!!errors.recipe}
                  />
                  {!!errors.recipe && <HelperText type="error" visible style={styles.errorTextAbs}>{errors.recipe}</HelperText>}
                </View>
              </View>
              <Divider style={{ marginHorizontal: 16 }} />

              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.batchCode}:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    dense
                    mode="outlined"
                    value={batchCode}
                    style={styles.numericInput}
                    onChangeText={(val) => { setBatchCode(val); if(errors.batchCode) setErrors({...errors, batchCode: ''}) }}
                    error={!!errors.batchCode}
                  />
                  {!!errors.batchCode && <HelperText type="error" visible style={styles.errorTextAbs}>{errors.batchCode}</HelperText>}
                </View>
              </View>
              <Divider style={{ marginHorizontal: 16 }} />

              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.kneaderCapacity}:</Text>
                <SegmentedButtons
                  value={kneader}
                  onValueChange={(val) => { setKneader(val); if(errors.kneader) setErrors({...errors, kneader: ''}) }}
                  density="compact"
                  style={styles.segmented}
                  buttons={[
                    { value: '35L', label: '35L' },
                    { value: '55L', label: '55L' },
                  ]}
                />
              </View>
              <Divider style={{ marginHorizontal: 16 }} />

              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.totalOrder}:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    dense
                    mode="outlined"
                    value={totalOrder}
                    keyboardType="numeric"
                    style={styles.numericInput}
                    onChangeText={(val) => { setTotalOrder(val); if(errors.totalOrder) setErrors({...errors, totalOrder: ''}) }}
                    error={!!errors.totalOrder}
                  />
                  {!!errors.totalOrder && <HelperText type="error" visible style={styles.errorTextAbs}>{errors.totalOrder}</HelperText>}
                </View>
              </View>
              <Divider style={{ marginHorizontal: 16 }} />

              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.noBatches}:</Text>
                <TextInput
                  dense
                  mode="outlined"
                  value={numBatches}
                  editable={false}
                  style={[styles.numericInput, { backgroundColor: theme.colors.elevation.level2 }]}
                  textColor={theme.colors.onSurfaceDisabled}
                />
              </View>
              <Divider style={{ marginHorizontal: 16 }} />

              <View style={styles.fieldRow}>
                <Text style={styles.infoLabel}>{t.shift}:</Text>
                <SegmentedButtons
                  value={shift}
                  onValueChange={setShift}
                  density="compact"
                  style={styles.segmentedSmallText}
                  buttons={[
                    { value: 'Morning', label: t.morning },
                    { value: 'Evening', label: t.evening },
                    { value: 'Night', label: t.night },
                  ]}
                />
              </View>

              <View style={{ padding: 16 }}>
                <Button 
                  mode="contained" 
                  onPress={handleSubmit} 
                  loading={submitting}
                  disabled={submitting}
                  style={styles.saveBtn}
                  labelStyle={{ fontWeight: 'bold' }}
                >
                  {editingId ? 'Update Entry' : t.submit}
                </Button>
              </View>
            </Card>
          )}

          {/* History Section */}
          <View style={styles.historyHeaderRow}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent History
            </Text>
            {loadingLogs && <ActivityIndicator size={16} color={theme.colors.primary} />}
          </View>

          <Card style={styles.listCard} mode="elevated">
            <View style={styles.tableContainer}>
              <View style={[styles.customRow, styles.customHeader, { backgroundColor: theme.colors.surfaceVariant }]}>
                <View style={styles.colDate}>
                  <Text variant="labelLarge" style={styles.headerText}>{t.date}</Text>
                </View>
                <View style={styles.colRecipe}>
                  <Text variant="labelLarge" style={styles.headerText}>{t.recipe}</Text>
                </View>
                <View style={styles.colBatches}>
                  <Text variant="labelLarge" style={styles.headerText}>{t.noBatches}</Text>
                </View>
                <View style={styles.colActions}>
                  <Text variant="labelLarge" style={[styles.headerText, { textAlign: 'center' }]}>
                    {user?.role === 'supervisor' ? t.actions : 'View'}
                  </Text>
                </View>
              </View>

              {logs.map((item) => (
                <TouchableRipple 
                  key={item.id} 
                  onPress={() => navigation.navigate('Logs', { screen: 'BatchList', params: { log: item } } as any)}
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
                    <View style={styles.colBatches}>
                      <Text variant="bodyMedium" style={[styles.dataText, styles.numBatchesText]}>
                        {item.num_batches}
                      </Text>
                    </View>
                    <View style={styles.colActions}>
                      <IconButton 
                        icon={user?.role === 'supervisor' ? "pencil-outline" : "chevron-right"} 
                        size={20} 
                        iconColor={theme.colors.primary}
                        style={styles.actionIcon}
                        onPress={() => handleRowPress(item)} 
                      />
                    </View>
                  </View>
                </TouchableRipple>
              ))}
              
              {logs.length === 0 && !loadingLogs && (
                <View style={styles.emptyState}>
                  <Text style={{ textAlign: 'center', color: theme.colors.outline }}>
                    {t.noLogs}
                  </Text>
                </View>
              )}
            </View>
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
  heroBannerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#ea7d2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  heroGradient: {
    paddingVertical: 8, // Slimmed down vertical footprint
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    width: 30, // Reduced from 44
    height: 30, // Reduced from 44
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  heroTextContainer: {
    flex: 1, // Pushes chevron to the right
    justifyContent: 'center',
  },
  heroText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSubText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  card: { marginBottom: 24, borderRadius: 12, overflow: 'hidden' },
  
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  infoLabel: {
    fontWeight: '600',
    opacity: 0.7,
    flex: 1, // Take available space left of input
  },
  inputWrapper: {
    position: 'relative',
    width: 200,
  },
  numericInput: {
    height: 40,
    width: 200, // Fixed width for right-alignment perfection
    backgroundColor: '#fff',
    fontSize: 14,
  },
  segmented: {
    width: 200,
  },
  segmentedSmallText: {
    width: 240, // Slightly wider for shift wording
    transform: [{ scale: 0.9 }],
    transformOrigin: 'right',
  },
  errorText: {
    paddingHorizontal: 16, paddingTop: 0, paddingBottom: 4
  },
  errorTextAbs: {
    position: 'absolute',
    bottom: -20,
    right: 0,
    fontSize: 10,
  },
  saveBtn: {
    borderRadius: 8,
    marginTop: 8,
  },

  historyHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },
  sectionTitle: { fontWeight: 'bold' },
  
  listCard: { overflow: 'hidden', borderRadius: 12, elevation: 1 },
  tableContainer: { width: '100%', overflow: 'hidden' },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 16,
    gap: 12,
  },
  customHeader: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },
  colDate: { flex: 0.35, paddingRight: 4 }, 
  colRecipe: { flex: 0.25 },   
  colBatches: { flex: 0.25, alignItems: 'center' },  
  colActions: { flex: 0.15, alignItems: 'center' }, 

  headerText: { fontWeight: '700', opacity: 0.8 },
  dataText: { opacity: 0.85 },
  recipeText: { fontWeight: '600', opacity: 1 }, 
  numBatchesText: { fontWeight: '600', textAlign: 'center' },
  actionIcon: { margin: 0 },
  emptyState: { padding: 32, alignItems: 'center', justifyContent: 'center' },
});
