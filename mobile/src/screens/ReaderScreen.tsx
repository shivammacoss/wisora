import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookBySlug } from '../data/books';
import { fetchChapterOverride } from '../api';
import { ContentBlocks } from '../components/ContentBlocks';
import type { ScreenProps } from '../navigation';
import { colors, radius } from '../theme';

export default function ReaderScreen({
  route,
  navigation,
}: ScreenProps<'Reader'>): React.ReactElement {
  const { slug, order } = route.params;
  const book = getBookBySlug(slug);
  const chapter = book?.chapters.find((c) => c.order === order);

  // Admin-authored override fetched from the live backend (falls back to bundled).
  const [override, setOverride] = useState<{
    title: string | null;
    essence: string | null;
    blocks: string[];
  } | null>(null);

  useEffect(() => {
    let alive = true;
    setOverride(null);
    fetchChapterOverride(slug, order).then((r) => alive && setOverride(r));
    return () => {
      alive = false;
    };
  }, [slug, order]);

  const view = useMemo(() => {
    if (!chapter) return null;
    const blocks = override?.blocks?.length ? override.blocks : (chapter.content ?? []);
    const title = override?.title ?? chapter.title;
    const essence = override?.essence ?? chapter.essence ?? blocks[0];
    const hasDedicatedEssence = Boolean(override?.essence || chapter.essence);
    const body = hasDedicatedEssence ? blocks : blocks.slice(1);
    return { blocks, title, essence, body };
  }, [chapter, override]);

  if (!book || !chapter || !view) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Chapter not found.</Text>
      </SafeAreaView>
    );
  }

  const prev = book.chapters.find((c) => c.order === order - 1);
  const next = book.chapters.find((c) => c.order === order + 1);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>
          {book.title.toUpperCase()} · CHAPTER {chapter.order}
        </Text>
        <Text style={styles.title}>{view.title}</Text>
        <Text style={styles.readtime}>{chapter.readingTimeMins} min read</Text>

        {view.essence ? (
          <View style={styles.essenceBox}>
            <Text style={styles.essenceLabel}>ESSENCE</Text>
            <Text style={styles.essenceText}>{view.essence}</Text>
          </View>
        ) : null}

        <Text style={styles.reflectionLabel}>REFLECTION</Text>
        <ContentBlocks blocks={view.body} />
      </ScrollView>

      {/* prev / next */}
      <View style={styles.navBar}>
        <NavBtn
          label="‹ Prev"
          disabled={!prev}
          onPress={() => prev && navigation.replace('Reader', { slug, order: prev.order })}
        />
        <NavBtn
          label={next ? 'Next ›' : 'Chapters'}
          primary
          onPress={() =>
            next ? navigation.replace('Reader', { slug, order: next.order }) : navigation.goBack()
          }
        />
      </View>
    </SafeAreaView>
  );
}

function NavBtn({
  label,
  onPress,
  disabled,
  primary,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.navBtn,
        primary && styles.navBtnPrimary,
        disabled && styles.navBtnDisabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.navBtnText, primary && styles.navBtnTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 28 },
  missing: { padding: 24, color: colors.body },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: colors.gold },
  title: { fontSize: 28, fontWeight: '800', color: colors.ink, marginTop: 6, lineHeight: 34 },
  readtime: { fontSize: 13, color: colors.muted, marginTop: 8 },
  essenceBox: {
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    backgroundColor: colors.creamSurface,
    borderRadius: radius.md,
    padding: 16,
    marginTop: 18,
  },
  essenceLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: colors.goldDeep },
  essenceText: {
    fontSize: 16.5,
    lineHeight: 26,
    fontStyle: 'italic',
    color: colors.ink,
    marginTop: 8,
  },
  reflectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.muted,
    marginTop: 26,
    marginBottom: 4,
  },
  navBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  navBtnPrimary: { backgroundColor: colors.gold, borderColor: colors.gold },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  navBtnTextPrimary: { color: '#fff' },
});
