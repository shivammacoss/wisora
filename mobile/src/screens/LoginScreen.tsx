import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import type { ScreenProps } from '../navigation';
import { colors, radius } from '../theme';

export default function LoginScreen({ navigation }: ScreenProps<'Login'>): React.ReactElement {
  const { login, register, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      if (mode === 'login') await login(email.trim(), password);
      else await register(name.trim(), email.trim(), password);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={10}>
        <Feather name="arrow-left" size={22} color={colors.ink} />
      </Pressable>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* brand */}
          <View style={styles.brandRow}>
            <MaterialCommunityIcons name="dharmachakra" size={34} color={colors.gold} />
            <Text style={styles.brand}>Wisora</Text>
          </View>
          <Text style={styles.headline}>Ancient wisdom, one chapter at a time.</Text>
          <Text style={styles.sub}>
            Summaries of the Gita, Bible, Quran, Tao Te Ching and more — first chapter free.
          </Text>

          {/* card */}
          <View style={styles.card}>
            <View style={styles.tabs}>
              <Tab label="Log in" active={mode === 'login'} onPress={() => setMode('login')} />
              <Tab label="Sign up" active={mode === 'register'} onPress={() => setMode('register')} />
            </View>

            {mode === 'register' && (
              <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
            )}
            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
            />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              secure
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
              style={({ pressed }) => [styles.primary, (busy || pressed) && { opacity: 0.85 }]}
              onPress={submit}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryText}>{mode === 'login' ? 'Log in' : 'Create account'}</Text>
              )}
            </Pressable>

            <Pressable style={styles.ghost} onPress={continueAsGuest} disabled={busy}>
              <Text style={styles.ghostText}>Continue as guest</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>Sacred wisdom, accessible — chapter by chapter.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Tab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  secure,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'email-address' | 'default';
}): React.ReactElement {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  back: { position: 'absolute', top: 12, left: 16, zIndex: 10, padding: 6 },
  scroll: { padding: 24, paddingTop: 8, flexGrow: 1, justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  brand: { fontSize: 30, fontWeight: '800', color: colors.ink },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 32,
  },
  sub: { fontSize: 14, color: colors.body, textAlign: 'center', marginTop: 10, lineHeight: 21 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 20,
    marginTop: 26,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.creamSurface,
    borderRadius: radius.full,
    padding: 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.full },
  tabActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.muted },
  tabTextActive: { color: colors.ink },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.creamSurface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  error: { color: '#DC2626', fontSize: 13, marginTop: 12 },
  primary: {
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ghost: { alignItems: 'center', paddingVertical: 12, marginTop: 6 },
  ghostText: { color: colors.body, fontSize: 15, fontWeight: '600' },
  footer: { textAlign: 'center', color: colors.muted, fontSize: 13, marginTop: 22 },
});
