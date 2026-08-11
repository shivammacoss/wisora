import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { useCurrency } from '../currency/CurrencyContext';
import { CurrencySelector } from '../components/CurrencySelector';
import { useTheme } from '../theme/ThemeContext';
import type { ScreenProps } from '../navigation';
import { radius, SERIF, type Colors } from '../theme';

/** Explicit pixel sizing so images fit the real screen (avoids % + aspectRatio quirks). */
const SCREEN_W = Dimensions.get('window').width;
const HERO_IMG_H = Math.round(SCREEN_W / 1.6); // native 1280x800 ratio → full image, white top blends with hero bg
const ROW_IMG_W = SCREEN_W - 40; // section has 20px horizontal padding each side
const ROW_IMG_H = Math.round(ROW_IMG_W / 1.41);

const logo = require('../../assets/logo.png');
const logoDark = require('../../assets/logo_for_dark.png');
const heroBanner = require('../../assets/hero_banner1.png');
const heroBannerDark = require('../../assets/hero_banner_dark.png');
const infoCard1 = require('../../assets/info_card1.png');
const infoCard2 = require('../../assets/info_card2.png');
const infoCard3 = require('../../assets/info_card3.png');

const PRIMARY: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  desc: string;
  colors: [string, string];
}[] = [
  {
    icon: 'book-open',
    title: 'Ancient Texts',
    desc: 'Read the Gita, Bible, Quran, Tao Te Ching, Dhammapada, and more — all in one place.',
    colors: ['#FDE68A', '#FDBA74'],
  },
  {
    icon: 'heart',
    title: '5–10 Minute Chapters',
    desc: 'Bite-sized summaries designed for peace and understanding, not overload.',
    colors: ['#FBCFE8', '#F9A8D4'],
  },
  {
    icon: 'trending-up',
    title: 'Track Your Journey',
    desc: 'Build a daily reading habit. Bookmarks, progress, and streaks — all synced.',
    colors: ['#A7F3D0', '#5EEAD4'],
  },
];

const SECONDARY: { icon: keyof typeof Feather.glyphMap; title: string; desc: string }[] = [
  { icon: 'credit-card', title: 'Multi-currency', desc: '₹1, $1, €1 — pay in your local currency.' },
  { icon: 'lock', title: 'Lifetime access', desc: 'Unlock once, read forever.' },
  { icon: 'sun', title: 'Distraction-free reader', desc: 'Focus mode, dark / sepia themes.' },
];

const ROWS: { title: string; desc: string; art: number }[] = [
  {
    title: 'Read with focus, not pressure',
    desc: 'One chapter at a time. No subscriptions, no nagging notifications. Just you and the wisdom of the ages.',
    art: infoCard1,
  },
  {
    title: 'Pay only for what you read',
    desc: '₹1 per chapter. Pay in your local currency. Lifetime access — unlock once, read forever.',
    art: infoCard3,
  },
  {
    title: 'Track your spiritual journey',
    desc: 'Bookmarks, progress, streaks, and a private reading library that syncs across devices.',
    art: infoCard2,
  },
];

export default function HomeScreen({ navigation }: ScreenProps<'Home'>): React.ReactElement {
  const { colors, isDark, toggle } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { continueAsGuest } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [email, setEmail] = useState('');

  const goLogin = (): void => navigation.navigate('Login');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Hero (surface bg) with book-shelf illustration ── */}
        <View style={styles.heroWrap}>
          {/* brand + theme toggle */}
          <View style={styles.brandRow}>
            <Image source={isDark ? logoDark : logo} style={styles.logo} resizeMode="contain" />
            <Pressable style={styles.themeBtn} hitSlop={8} onPress={toggle}>
              <Feather name={isDark ? 'sun' : 'moon'} size={17} color={colors.muted} />
            </Pressable>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.headline}>Ancient wisdom,{'\n'}one chapter{'\n'}at a time.</Text>
            <Text style={styles.subcopy}>
              Read summaries of the <Text style={styles.scripture}>Gita</Text>,{' '}
              <Text style={styles.scripture}>Bible</Text>, <Text style={styles.scripture}>Quran</Text>,{' '}
              <Text style={styles.scripture}>Tao Te Ching</Text>, and more — in just 5 minutes a day.
              First chapter free. ₹1 per chapter for lifetime access.
            </Text>

            <Pressable style={({ pressed }) => [styles.goldBtn, pressed && styles.pressed]} onPress={goLogin}>
              <Feather name="user-plus" size={18} color="#fff" />
              <Text style={styles.goldBtnText}>Sign Up</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed]}
              onPress={goLogin}
            >
              <Text style={styles.outlineBtnText}>Explore Library</Text>
              <Feather name="arrow-right" size={18} color={colors.ink} />
            </Pressable>
          </View>

          {/* book-shelf banner anchored at bottom */}
          <Image source={isDark ? heroBannerDark : heroBanner} style={styles.heroImg} resizeMode="contain" />
        </View>

        {/* ── "A calmer way to read sacred texts" ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A calmer way to{'\n'}read sacred texts</Text>
          <Text style={styles.sectionSub}>Designed for reflection, not rush.</Text>

          {/* primary gradient cards */}
          <View style={styles.cardStack}>
            {PRIMARY.map((c) => (
              <LinearGradient
                key={c.title}
                colors={c.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradCard}
              >
                <View style={styles.gradIcon}>
                  <Feather name={c.icon} size={22} color="#1A1A1A" />
                </View>
                <Text style={styles.gradTitle}>{c.title}</Text>
                <Text style={styles.gradDesc}>{c.desc}</Text>
              </LinearGradient>
            ))}
          </View>

          {/* secondary cream cards */}
          <View style={[styles.cardStack, { marginTop: 14 }]}>
            {SECONDARY.map((c) => (
              <View key={c.title} style={styles.secRow}>
                <View style={styles.secIcon}>
                  <Feather name={c.icon} size={18} color={colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.secTitle}>{c.title}</Text>
                  <Text style={styles.secDesc}>{c.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Feature rows (illustration + text) ── */}
        <View style={styles.rowsSection}>
          {ROWS.map((row) => (
            <View key={row.title} style={styles.featureRow}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowDesc}>{row.desc}</Text>
              <Image source={row.art} style={styles.rowArt} resizeMode="cover" />
            </View>
          ))}
        </View>

        {/* ── Pricing card ── */}
        <View style={styles.section}>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>One Coin, One Chapter</Text>
            <Text style={styles.pricingSub}>First chapter free from every scripture.</Text>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <CurrencySelector value={currency} onChange={setCurrency} />
            </View>

            <Text style={styles.price}>{currency.symbol}1</Text>
            <Text style={styles.priceUnit}>per chapter — lifetime access</Text>

            <Pressable style={({ pressed }) => [styles.goldBtn, styles.pricingBtn, pressed && styles.pressed]} onPress={goLogin}>
              <Text style={styles.goldBtnText}>Start with the free chapter</Text>
            </Pressable>
            <Text style={styles.pricingNote}>No subscription. No hidden fees. Ever.</Text>
          </View>
        </View>

        {/* ── Final CTA ── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Begin your daily{'\n'}wisdom practice.</Text>
          <Text style={styles.ctaSub}>
            Join readers around the world rediscovering ancient texts — five minutes at a time.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.goldBtn, { alignSelf: 'stretch', marginTop: 22 }, pressed && styles.pressed]}
            onPress={continueAsGuest}
          >
            <Text style={styles.goldBtnText}>Continue as Guest</Text>
          </Pressable>

          <View style={styles.magicRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.magicInput}
            />
            <Pressable
              style={({ pressed }) => [styles.darkBtn, pressed && styles.pressed]}
              onPress={continueAsGuest}
            >
              <Text style={styles.darkBtnText}>Send magic link</Text>
            </Pressable>
          </View>

          <Text style={styles.ctaNote}>
            Login to sync your progress, bookmarks &amp; reading history across devices.
          </Text>
        </View>

        <Text style={styles.footer}>
          Ancient wisdom accessible, chapter by chapter, in a simple, gentle, and affordable way.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },

  /* hero */
  heroWrap: { backgroundColor: colors.surface, paddingBottom: 0, overflow: 'hidden' },
  brandRow: { alignItems: 'center', justifyContent: 'center', paddingTop: 12, paddingHorizontal: 20 },
  logo: { height: 96, width: 112 },
  themeBtn: {
    position: 'absolute',
    right: 18,
    top: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: { alignItems: 'center', paddingHorizontal: 24, marginTop: 18 },
  headline: {
    fontFamily: SERIF,
    fontSize: 37,
    fontWeight: '700',
    lineHeight: 44,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subcopy: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.body,
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 360,
  },
  scripture: { color: colors.goldDeep, fontWeight: '600' },
  heroImg: { width: SCREEN_W, height: HERO_IMG_H, marginTop: -4 },

  /* buttons */
  goldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingVertical: 15,
    paddingHorizontal: 32,
    marginTop: 24,
    alignSelf: 'stretch',
  },
  goldBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: 15,
    marginTop: 12,
    alignSelf: 'stretch',
  },
  outlineBtnText: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.9 },

  /* sections */
  section: { paddingHorizontal: 20, paddingTop: 48 },
  sectionTitle: {
    fontFamily: SERIF,
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 36,
  },
  sectionSub: { fontSize: 16, color: colors.body, textAlign: 'center', marginTop: 12 },

  cardStack: { gap: 16, marginTop: 26 },
  gradCard: { borderRadius: 24, padding: 24, minHeight: 200 },
  gradIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradTitle: { fontFamily: SERIF, fontSize: 21, fontWeight: '700', color: '#1A1A1A', marginTop: 'auto' },
  gradDesc: { fontSize: 14.5, lineHeight: 21, color: '#1A1A1ACC', marginTop: 8 },

  secRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.creamSurface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: 16,
  },
  secIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },
  secDesc: { fontSize: 13, lineHeight: 19, color: colors.body, marginTop: 3 },

  /* feature rows */
  rowsSection: { backgroundColor: colors.creamSurface + '99', paddingHorizontal: 20, paddingTop: 20, marginTop: 48 },
  featureRow: { paddingVertical: 24 },
  rowTitle: { fontFamily: SERIF, fontSize: 28, fontWeight: '700', color: colors.ink, lineHeight: 34 },
  rowDesc: { fontSize: 15.5, lineHeight: 24, color: colors.body, marginTop: 12 },
  rowArt: { width: ROW_IMG_W, height: ROW_IMG_H, borderRadius: 24, marginTop: 20, backgroundColor: '#1A1A1A' },

  /* pricing */
  pricingCard: {
    backgroundColor: colors.creamSurface,
    borderWidth: 1,
    borderColor: colors.gold + '40',
    borderRadius: radius.lg,
    padding: 26,
    alignItems: 'center',
  },
  pricingTitle: { fontFamily: SERIF, fontSize: 26, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  pricingSub: { fontSize: 15, color: colors.body, textAlign: 'center', marginTop: 8 },
  price: { fontFamily: SERIF, fontSize: 64, fontWeight: '700', color: colors.gold, marginTop: 18 },
  priceUnit: { fontSize: 13, fontWeight: '600', color: colors.muted, marginTop: 4 },
  pricingBtn: { alignSelf: 'stretch', marginTop: 20 },
  pricingNote: { fontSize: 13, color: colors.muted, marginTop: 16, textAlign: 'center' },

  /* final cta */
  ctaSection: { paddingHorizontal: 24, paddingTop: 48, alignItems: 'center' },
  ctaTitle: { fontFamily: SERIF, fontSize: 32, fontWeight: '700', color: colors.ink, textAlign: 'center', lineHeight: 38 },
  ctaSub: { fontSize: 15, lineHeight: 23, color: colors.body, textAlign: 'center', marginTop: 12, maxWidth: 340 },
  magicRow: { alignSelf: 'stretch', gap: 12, marginTop: 16 },
  magicInput: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.ink,
  },
  darkBtn: {
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    paddingVertical: 15,
    alignItems: 'center',
  },
  darkBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  ctaNote: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 16, lineHeight: 20 },

  footer: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 20,
    paddingHorizontal: 24,
  },
});
