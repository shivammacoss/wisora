import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import type { ScreenProps } from '../navigation';
import { colors, radius } from '../theme';

const PRIMARY: { icon: keyof typeof Feather.glyphMap; title: string; desc: string }[] = [
  {
    icon: 'book-open',
    title: 'Ancient Texts',
    desc: 'Read the Gita, Bible, Quran, Tao Te Ching, Dhammapada, and more — all in one place.',
  },
  {
    icon: 'heart',
    title: '5–10 Minute Chapters',
    desc: 'Bite-sized summaries designed for peace and understanding, not overload.',
  },
  {
    icon: 'trending-up',
    title: 'Track Your Journey',
    desc: 'Build a daily reading habit. Bookmarks, progress, and streaks — all synced.',
  },
];

const SECONDARY: { icon: keyof typeof Feather.glyphMap; title: string; desc: string }[] = [
  { icon: 'credit-card', title: 'Multi-currency', desc: '₹1, $1, €1 — pay in your local currency.' },
  { icon: 'lock', title: 'Lifetime access', desc: 'Unlock once, read forever.' },
  { icon: 'sun', title: 'Distraction-free reader', desc: 'Focus mode, clean typography.' },
];

export default function HomeScreen({ navigation }: ScreenProps<'Home'>): React.ReactElement {
  const { continueAsGuest } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* brand */}
        <View style={styles.brandRow}>
          <MaterialCommunityIcons name="dharmachakra" size={30} color={colors.gold} />
          <Text style={styles.brand}>Wisora</Text>
        </View>

        {/* hero */}
        <View style={styles.hero}>
          <Text style={styles.headline}>Ancient wisdom,{'\n'}one chapter at a time.</Text>
          <Text style={styles.subcopy}>
            Read summaries of the Gita, Bible, Quran, Tao Te Ching, and more — in just 5 minutes a
            day. First chapter free. ₹1 per chapter for lifetime access.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Feather name="log-in" size={18} color="#fff" />
            <Text style={styles.primaryText}>Log in</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.7 }]}
            onPress={continueAsGuest}
          >
            <Text style={styles.outlineText}>Explore Library</Text>
            <Feather name="arrow-right" size={18} color={colors.ink} />
          </Pressable>
        </View>

        {/* section heading */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionSub}>Designed for reflection, not rush.</Text>
          <Text style={styles.sectionTitle}>A calmer way to read sacred texts</Text>
        </View>

        {/* primary feature cards */}
        <View style={styles.cardStack}>
          {PRIMARY.map((c) => (
            <View key={c.title} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name={c.icon} size={22} color={colors.goldDeep} />
              </View>
              <Text style={styles.featureTitle}>{c.title}</Text>
              <Text style={styles.featureDesc}>{c.desc}</Text>
            </View>
          ))}
        </View>

        {/* secondary rows */}
        <View style={styles.cardStack}>
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

        {/* pricing */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingLabel}>SIMPLE PRICING</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹1</Text>
            <Text style={styles.priceUnit}>/ chapter</Text>
          </View>
          <Text style={styles.pricingDesc}>First chapter free. Unlock any chapter once, read it forever.</Text>
          <Pressable style={styles.pricingBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.pricingBtnText}>Start free</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Ancient wisdom accessible, chapter by chapter, in a simple, gentle, and affordable way.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', paddingVertical: 18 },
  brand: { fontSize: 28, fontWeight: '800', color: colors.ink },
  hero: { alignItems: 'center', marginTop: 8 },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    color: colors.ink,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subcopy: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.body,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 340,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 28,
    alignSelf: 'stretch',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
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
  outlineText: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  sectionHead: { alignItems: 'center', marginTop: 44 },
  sectionSub: { fontSize: 13, fontWeight: '700', letterSpacing: 1, color: colors.gold, textTransform: 'uppercase' },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 30,
  },
  cardStack: { gap: 14, marginTop: 20 },
  featureCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.gold + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 14 },
  featureDesc: { fontSize: 14, lineHeight: 21, color: colors.body, marginTop: 6 },
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
  pricingCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold + '55',
    borderRadius: radius.lg,
    padding: 24,
    marginTop: 28,
    alignItems: 'center',
  },
  pricingLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, color: colors.gold },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 10 },
  price: { fontSize: 44, fontWeight: '800', color: colors.ink },
  priceUnit: { fontSize: 16, color: colors.muted, marginBottom: 8 },
  pricingDesc: { fontSize: 14, color: colors.body, textAlign: 'center', marginTop: 6, lineHeight: 21 },
  pricingBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingVertical: 13,
    paddingHorizontal: 44,
    marginTop: 18,
  },
  pricingBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  footer: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 32, lineHeight: 20, paddingHorizontal: 16 },
});
