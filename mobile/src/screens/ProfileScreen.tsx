import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBooks } from '../data/books';
import { useAuth } from '../auth/AuthContext';
import { useCurrency } from '../currency/CurrencyContext';
import { CurrencySelector } from '../components/CurrencySelector';
import type { ScreenProps } from '../navigation';
import { radius, SERIF, type Colors } from '../theme';
import { useTheme } from '../theme/ThemeContext';

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'G'
  );
}

export default function ProfileScreen({ navigation }: ScreenProps<'Profile'>): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { user, isGuest, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [likedCount, setLikedCount] = useState(0);

  const name = user?.name ?? 'Guest';
  const isAdmin = user?.role === 'admin';
  const totalBooks = getBooks().length;

  useEffect(() => {
    let alive = true;
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiGet(keys.filter((k) => k.startsWith('wisora.like.'))))
      .then((entries) => {
        if (alive) setLikedCount(entries.filter(([, v]) => v === '1').length);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const stats = [
    { icon: 'book-open' as const, label: 'Books', value: String(totalBooks) },
    { icon: 'heart' as const, label: 'Liked', value: String(likedCount) },
    { icon: 'globe' as const, label: 'Currency', value: currency.code },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <Feather name="arrow-left" size={18} color={colors.muted} />
          <Text style={styles.backText}>Library</Text>
        </Pressable>

        {/* identity card */}
        <View style={styles.card}>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name)}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email} numberOfLines={1}>
                {isGuest ? 'Browsing as a guest' : user?.email}
              </Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Feather name="shield" size={11} color={colors.goldDeep} />
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              )}
              {isGuest && (
                <View style={styles.guestBadge}>
                  <Text style={styles.guestBadgeText}>Guest — sign up to save progress</Text>
                </View>
              )}
            </View>
          </View>

          {/* stats */}
          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.stat}>
                <Feather name={s.icon} size={18} color={colors.gold} />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* currency */}
        <Text style={styles.sectionLabel}>DISPLAY CURRENCY</Text>
        <View style={styles.currencyRow}>
          <CurrencySelector value={currency} onChange={setCurrency} />
        </View>

        {/* legal */}
        <Text style={styles.sectionLabel}>LEGAL</Text>
        <View style={styles.legalCard}>
          <Pressable
            style={styles.legalRow}
            onPress={() => void Linking.openURL('https://wisora.org/privacy-policy').catch(() => undefined)}
          >
            <Feather name="shield" size={16} color={colors.goldDeep} />
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Feather name="external-link" size={15} color={colors.muted} />
          </Pressable>
          <View style={styles.legalDivider} />
          <Pressable
            style={styles.legalRow}
            onPress={() => void Linking.openURL('https://wisora.org/terms-of-service').catch(() => undefined)}
          >
            <Feather name="file-text" size={16} color={colors.goldDeep} />
            <Text style={styles.legalText}>Terms of Service</Text>
            <Feather name="external-link" size={15} color={colors.muted} />
          </Pressable>
        </View>

        {/* actions */}
        <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate('Library')}>
          <Feather name="book-open" size={16} color="#fff" />
          <Text style={styles.primaryText}>Back to reading</Text>
        </Pressable>
        <Pressable style={styles.outlineBtn} onPress={() => void logout()}>
          <Feather name="log-out" size={16} color="#DC2626" />
          <Text style={styles.outlineText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  backText: { fontSize: 14, fontWeight: '600', color: colors.muted },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    marginTop: 12,
    overflow: 'hidden',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.creamSurface,
    padding: 20,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  name: { fontFamily: SERIF, fontSize: 24, fontWeight: '700', color: colors.ink },
  email: { fontSize: 14, color: colors.body, marginTop: 2 },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.gold + '26',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  adminBadgeText: { fontSize: 11, fontWeight: '700', color: colors.goldDeep },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gold + '1A',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 6,
  },
  guestBadgeText: { fontSize: 11, fontWeight: '600', color: colors.goldDeep },
  statsRow: { flexDirection: 'row' },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: colors.hairline,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.ink, marginTop: 6 },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: colors.muted, marginTop: 24, marginBottom: 10 },
  currencyRow: { flexDirection: 'row' },
  legalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  legalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  legalText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink },
  legalDivider: { height: 1, backgroundColor: colors.hairline, marginLeft: 16 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingVertical: 14,
    marginTop: 26,
  },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: 14,
    marginTop: 12,
  },
  outlineText: { color: '#DC2626', fontSize: 15, fontWeight: '700' },
});
