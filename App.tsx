import { StatusBar } from 'expo-status-bar';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import RootNavigator from './src/navigation/RootNavigator';

// ─── Professional MD3 Theme — MUI-inspired palette ────────────────────────────

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary — Vibrant Orange
    primary: '#ea7d2e',
    onPrimary: '#ffffff',
    primaryContainer: '#a65111',
    onPrimaryContainer: '#ffecd9',
    // Secondary — Slate
    secondary: '#94a3b8',
    onSecondary: '#1e293b',
    secondaryContainer: '#334155',
    onSecondaryContainer: '#cbd5e1',
    // Error
    error: '#f87171',
    onError: '#7f1d1d',
    // Backgrounds & surfaces
    background: '#0f172a',       // slate-900
    onBackground: '#f1f5f9',
    surface: '#1e293b',          // slate-800
    onSurface: '#f1f5f9',
    surfaceVariant: '#334155',   // slate-700
    onSurfaceVariant: '#94a3b8',
    outline: '#475569',
    elevation: {
      level0: '#0f172a',
      level1: '#1e293b',
      level2: '#263244',
      level3: '#2e3c52',
      level4: '#344460',
      level5: '#3b4d6e',
    },
  },
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary — Vibrant Orange
    primary: '#ea7d2e',
    onPrimary: '#ffffff',
    primaryContainer: '#fcead9',
    onPrimaryContainer: '#8a4009',
    // Secondary — Slate
    secondary: '#475569',
    onSecondary: '#ffffff',
    secondaryContainer: '#e2e8f0',
    onSecondaryContainer: '#0f172a',
    // Error
    error: '#dc2626',
    onError: '#ffffff',
    // Backgrounds & surfaces
    background: '#f8fafc',       // slate-50
    onBackground: '#0f172a',
    surface: '#ffffff',
    onSurface: '#0f172a',
    surfaceVariant: '#f1f5f9',
    onSurfaceVariant: '#475569',
    outline: '#cbd5e1',
    elevation: {
      level0: '#f8fafc',
      level1: '#ffffff',
      level2: '#f1f5f9',
      level3: '#e2e8f0',
      level4: '#cbd5e1',
      level5: '#b6c5d4',
    },
  },
};

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme as any}>
        <LanguageProvider>
          <AuthProvider>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <RootNavigator />
          </AuthProvider>
        </LanguageProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
