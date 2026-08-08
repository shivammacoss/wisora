import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookBySlug } from '../data/books';
import type { Chapter } from '../types';
import type { ScreenProps } from '../navigation';
import { TraditionIcon } from '../components/TraditionIcon';
import { colors, radius } from '../theme';

export default function BookDetailScreen({
  route,
  navigation,
}: ScreenProps<'BookDetail'>): React.ReactElement {
  const book = getBookBySlug(route.params.slug);

  if (!book) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Book not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={book.chapters}
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
            <Text style={styles.section}>
              Chapters <Text style={styles.count}>({book.chapters.length})</Text>
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChapterRow
            chapter={item}
            onPress={() => navigation.navigate('Reader', { slug: book.slug, order: item.order })}
          />
        )}
      />
    </SafeAreaView>
  );
}

function ChapterRow({
  chapter,
  onPress,
}: {
  chapter: Chapter;
  onPress: () => void;
}): React.ReactElement {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{chapter.order}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {chapter.title}
        </Text>
        <Text style={styles.rowMeta}>{chapter.readingTimeMins} min read</Text>
      </View>
      {chapter.isFree ? (
        <View style={styles.freePill}>
          <Text style={styles.freeText}>Free</Text>
        </View>
      ) : (
        <View style={styles.lockPill}>
          <Text style={styles.lockText}>🔒 ₹1</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  title: { fontSize: 30, fontWeight: '800', color: colors.ink, marginTop: 4 },
  desc: { fontSize: 15, lineHeight: 23, color: colors.body, marginTop: 10 },
  section: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 24 },
  count: { fontSize: 15, fontWeight: '400', color: colors.muted },
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
