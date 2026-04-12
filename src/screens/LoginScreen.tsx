import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AppHeader from '../components/AppHeader';

import GradientButton from '../components/GradientButton';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError(t.emailRequired);
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <AppHeader />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
              {t.signIn}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label={t.email}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
            />
            <TextInput
              label={t.password}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={secureText}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={secureText ? 'eye-off-outline' : 'eye-outline'}
                  onPress={() => setSecureText((v) => !v)}
                />
              }
              style={styles.input}
            />

            {!!error && (
              <HelperText type="error" visible>
                {error}
              </HelperText>
            )}

            <GradientButton
              text={t.signIn}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
  },
  form: { gap: 8 },
  input: { marginBottom: 4 },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
