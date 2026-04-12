import React, { useState, useCallback } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Appbar, Text, useTheme, Menu, Divider } from 'react-native-paper';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AppHeaderProps {
  /** Optional screen-level subtitle shown below app title */
  subtitle?: string;
  /** Show the logout button (authenticated screens only) */
  showLogout?: boolean;
  /** Show back button (stack screens) */
  showBack?: boolean;
  onBack?: () => void;
}

/**
 * Production-grade AppHeader with memoization for stability and 
 * robust menu interaction handling.
 */
const AppHeader = ({
  subtitle,
  showLogout = false,
  showBack = false,
  onBack,
}: AppHeaderProps) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { lang, toggleLang, t } = useLanguage();
  const { signOut } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const handleToggleLang = useCallback(() => {
    // Instantly close the menu and toggle language in the same tick.
    // Conditional rendering of the Menu ensures it unmounts atomicaly.
    setMenuVisible(false);
    toggleLang();
  }, [toggleLang]);

  const handleSignOut = useCallback(() => {
    setMenuVisible(false);
    signOut();
  }, [signOut]);

  return (
    <Appbar.Header
      style={[
        styles.header, 
        { 
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.elevation.level2,
        }
      ]}
      elevated={false}
      statusBarHeight={0} // Removes double padding caused by SafeAreaView
    >
      <View style={styles.titleBlock}>
        {showBack && (
          <Appbar.Action 
            icon="chevron-left" 
            onPress={onBack} 
            color={theme.colors.primary} 
            size={30}
            style={styles.backButton}
          />
        )}
        
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Appbar.Content
          title={t.appTitle}
          subtitle={subtitle}
          titleStyle={[styles.appName, { color: theme.colors.onSurface }]}
          subtitleStyle={styles.subtitle}
          style={styles.contentBody}
        />
      </View>

      <View style={styles.actions}>
        <Appbar.Action
          icon="menu"
          color={theme.colors.onSurfaceVariant}
          onPress={openMenu}
          accessibilityLabel="Open settings menu"
        />
        {menuVisible && (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={{ x: width - 8, y: 64 }}
            contentStyle={[
              styles.menuContent,
              { backgroundColor: theme.colors.elevation.level3 },
            ]}
          >
            {/* Header-like section for info/branding */}
            <View style={styles.menuHeader}>
               <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                 {t.appTitle}
               </Text>
            </View>
            <Divider />

            {/* Combined Language Toggle as a single Toggle item or two clear items */}
            <Menu.Item
              onPress={handleToggleLang}
              title={lang === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
              leadingIcon="translate"
              trailingIcon={lang === 'hi' ? 'check' : undefined}
            />

            {showLogout && (
              <>
                <Divider />
                <Menu.Item
                  onPress={handleSignOut}
                  title={t.signOut}
                  leadingIcon="logout"
                  titleStyle={{ color: theme.colors.error }}
                />
              </>
            )}
          </Menu>
        )}
      </View>
    </Appbar.Header>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  titleBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -14,
  },
  logo: {
    width: 68,
    height: 68,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginLeft: -4,
    marginRight: -10,
  },
  contentBody: {
    marginLeft: -10,
  },
  appName: {
    fontWeight: '800',
    letterSpacing: 0.2,
    fontSize: 18,
  },
  subtitle: {
    marginTop: -4,
    fontWeight: '600',
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuContent: {
    borderRadius: 12,
    minWidth: 180,
  },
  divider: {
    marginHorizontal: 0,
  },
});
