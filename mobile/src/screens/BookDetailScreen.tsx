import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookBySlug, splitIntro } from '../data/books';
import type { Chapter } from '../types';
import type { ScreenProps } from '../navigation';
import { TraditionIcon } from '../components/TraditionIcon';
import { ChapterManager } from '../components/ChapterManager';
import { CurrencySelector } from '../components/CurrencySelector';
import { chaptersApi, type ManagedChapter } from '../api/chapters';
import { useAuth } from '../auth/AuthContext';
import { useCurrency } from '../currency/CurrencyContext';
import { radius, SERIF, type Colors } from '../theme';
import { useTheme } from '../theme/ThemeContext';

export default function BookDetailScreen({
  route,
  navigation,
}: ScreenProps<'BookDetail'>): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { currency, setCurrency } = useCurrency();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const book = getBookBySlug(route.params.slug);

  // Backend-managed chapter list (null → use bundled). Kept in sync by the manager.
  const [managed, setManaged] = useState<ManagedChapter[] | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  const slug = book?.slug;
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    chaptersApi
      .list(slug)
      .then((list) => {
        if (alive) setManaged(list.length > 0 ? list : null);
      })
      .catch(() => {
        /* keep bundled on any error */
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (!book) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Book not found.</Text>
      </SafeAreaView>
    );
  }

  // Chapters to show: the backend-managed list (mapped) or the bundled list.
  const displayChapters: Chapter[] = managed
    ? managed.map((m) => ({
        order: m.order,
        title: m.title,
        readingTimeMins: m.readingTimeMins,
        isFree: m.isFree,
        essence: m.essence ?? undefined,
      }))
    : book.chapters;

  // Separate the introduction (shown on its own) from the numbered chapters.
  const { intro, rest } = splitIntro(displayChapters);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={rest}
        keyExtractor={(c) => String(c.order)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.coverBox}>
              <TraditionIcon tradition={book.tradition} size={44} />
            </View>
            <Text style={styles.subtitle}>{book.subtitle.toUpperCase()}</Text>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.desc}>{book.description}</Text>

            {/* introduction — shown on its own, before the numbered chapters */}
            {intro && (
              <Pressable
                style={styles.introCard}
                onPress={() => navigation.navigate('Reader', { slug: book.slug, order: intro.order })}
              >
                <View style={styles.introIcon}>
                  <Feather name="book-open" size={20} color={colors.goldDeep} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.introKicker}>START HERE</Text>
                  <Text style={styles.introTitle}>Introduction</Text>
                </View>
              </Pressable>
            )}

            <View style={styles.sectionRow}>
              <Text style={styles.section}>
                Chapters <Text style={styles.count}>({rest.length})</Text>
              </Text>
              <View style={styles.sectionActions}>
                <CurrencySelector value={currency} onChange={setCurrency} />
                {isAdmin && (
                  <Pressable style={styles.manageBtn} onPress={() => setManageOpen(true)}>
                    <Feather name="list" size={15} color={colors.goldDeep} />
                    <Text style={styles.manageBtnText}>Manage</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <ChapterRow
            chapter={item}
            displayNumber={index + 1}
            free={index === 0 || item.isFree}
            priceLabel={`${currency.symbol}1`}
            onPress={() => navigation.navigate('Reader', { slug: book.slug, order: item.order })}
          />
        )}
      />

      {isAdmin && (
        <ChapterManager
          book={book}
          visible={manageOpen}
          onClose={() => setManageOpen(false)}
          onChanged={(list) => setManaged(list.length > 0 ? list : null)}
        />
      )}
    </SafeAreaView>
  );
}

function ChapterRow({
  chapter,
  displayNumber,
  free,
  priceLabel,
  onPress,
}: {
  chapter: Chapter;
  displayNumber: number;
  free: boolean;
  priceLabel: string;
  onPress: () => void;
}): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{displayNumber}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {chapter.title}
        </Text>
        <Text style={styles.rowMeta}>{chapter.readingTimeMins} min read</Text>
      </View>
      {free ? (
        <View style={styles.freePill}>
          <Text style={styles.freeText}>Free</Text>
        </View>
      ) : (
        <View style={styles.lockPill}>
          <Text style={styles.lockText}>🔒 {priceLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  list: { padding: 16, paddingBottom: 32 },
  missing: { padding: 24, color: colors.body },
  header: { marginBottom: 6 },
  coverBox: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    backgroundColor: colors.creamSurface,
    borderWidth: 1,
    borderColor: colors.gold + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: { fontSize: 42 },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.goldDeep,
    marginTop: 16,
  },
  title: { fontFamily: SERIF, fontSize: 32, fontWeight: '700', color: colors.ink, marginTop: 4 },
  desc: { fontSize: 15, lineHeight: 23, color: colors.body, marginTop: 10 },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.gold + '4D',
    backgroundColor: colors.gold + '14',
    borderRadius: radius.lg,
    padding: 14,
    marginTop: 22,
  },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold + '26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introKicker: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: colors.goldDeep },
  introTitle: { fontFamily: SERIF, fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: 2 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 24,
  },
  sectionActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink },
  count: { fontSize: 15, fontWeight: '400', color: colors.muted },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.gold + '55',
    backgroundColor: colors.gold + '14',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  manageBtnText: { fontSize: 13, fontWeight: '700', color: colors.goldDeep },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 14,
    marginTop: 10,
    gap: 14,
  },
  rowPressed: { opacity: 0.85 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.creamSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 16, fontWeight: '700', color: colors.goldDeep },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  rowMeta: { fontSize: 13, color: colors.muted, marginTop: 2 },
  freePill: {
    backgroundColor: '#D1FAE5',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  freeText: { fontSize: 12, fontWeight: '700', color: '#047857' },
  lockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.creamSurface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lockText: { fontSize: 13, fontWeight: '700', color: colors.ink },
});
