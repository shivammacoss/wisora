import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chaptersApi, type ManagedChapter, type SeedChapter } from '../api/chapters';
import type { Book } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { radius, SERIF, type Colors } from '../theme';

function seedFromBundled(book: Book): SeedChapter[] {
  return book.chapters.map((c) => ({
    order: c.order,
    title: c.title,
    essence: c.essence,
    readingTimeMins: c.readingTimeMins,
    isFree: c.isFree,
    blocks: c.content ?? [],
  }));
}

interface Props {
  book: Book;
  visible: boolean;
  onClose: () => void;
  onChanged?: (chapters: ManagedChapter[]) => void;
}

/** Admin-only manager for a book's chapter list: add, delete, reorder. */
export function ChapterManager({ book, visible, onClose, onChanged }: Props): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [chapters, setChapters] = useState<ManagedChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const apply = (list: ManagedChapter[]): void => {
    setChapters(list);
    onChanged?.(list);
  };

  useEffect(() => {
    if (!visible) return;
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        let list = await chaptersApi.list(book.slug);
        if (list.length === 0) list = await chaptersApi.init(book.slug, seedFromBundled(book));
        if (alive) apply(list);
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, book.slug]);

  const move = (index: number, dir: -1 | 1): void => {
    const target = index + dir;
    if (target < 0 || target >= chapters.length) return;
    const ids = chapters.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setBusy(true);
    setError(null);
    chaptersApi
      .reorder(book.slug, ids)
      .then(apply)
      .catch((e) => setError((e as Error).message))
      .finally(() => setBusy(false));
  };

  const remove = (c: ManagedChapter): void => {
    Alert.alert('Delete chapter', `Delete "${c.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setBusy(true);
          setError(null);
          chaptersApi
            .remove(book.slug, c.order)
            .then(apply)
            .catch((e) => setError((e as Error).message))
            .finally(() => setBusy(false));
        },
      },
    ]);
  };

  const add = (): void => {
    const title = newTitle.trim();
    if (title.length < 1) return;
    setBusy(true);
    setError(null);
    chaptersApi
      .add(book.slug, { title })
      .then(() => chaptersApi.list(book.slug))
      .then((list) => {
        apply(list);
        setNewTitle('');
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setBusy(false));
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.title}>Manage chapters</Text>
            <Text style={styles.sub} numberOfLines={1}>
              {book.title}
            </Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
            <Feather name="x" size={22} color={colors.body} />
          </Pressable>
        </View>

        {/* add chapter */}
        <View style={styles.addRow}>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="New chapter title…"
            placeholderTextColor={colors.muted}
            style={styles.addInput}
            onSubmitEditing={add}
            returnKeyType="done"
          />
          <Pressable
            style={[styles.addBtn, (busy || newTitle.trim().length < 1) && { opacity: 0.4 }]}
            onPress={add}
            disabled={busy || newTitle.trim().length < 1}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* list */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.gold} />
            <Text style={styles.loadingText}>Loading chapters…</Text>
          </View>
        ) : (
          <FlatList
            data={chapters}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No chapters yet. Add one above.</Text>}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderText}>{item.order}</Text>
                </View>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.rowActions}>
                  <Pressable
                    disabled={busy || index === 0}
                    onPress={() => move(index, -1)}
                    style={[styles.iconBtn, (busy || index === 0) && styles.iconBtnDisabled]}
                  >
                    <Feather name="arrow-up" size={17} color={colors.body} />
                  </Pressable>
                  <Pressable
                    disabled={busy || index === chapters.length - 1}
                    onPress={() => move(index, 1)}
                    style={[styles.iconBtn, (busy || index === chapters.length - 1) && styles.iconBtnDisabled]}
                  >
                    <Feather name="arrow-down" size={17} color={colors.body} />
                  </Pressable>
                  <Pressable disabled={busy} onPress={() => remove(item)} style={[styles.iconBtn, busy && styles.iconBtnDisabled]}>
                    <Feather name="trash-2" size={16} color="#DC2626" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}

        <View style={styles.footer}>
          <Pressable style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  title: { fontFamily: SERIF, fontSize: 20, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.creamSurface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  error: { color: '#DC2626', fontSize: 13, paddingHorizontal: 18, paddingTop: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { fontSize: 14, color: colors.muted },
  list: { padding: 16, gap: 10 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  orderBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.creamSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: { fontFamily: SERIF, fontSize: 14, fontWeight: '700', color: colors.goldDeep },
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink },
  rowActions: { flexDirection: 'row', gap: 2 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDisabled: { opacity: 0.25 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
    alignItems: 'flex-end',
  },
  doneBtn: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.full,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  doneText: { fontSize: 15, fontWeight: '700', color: colors.body },
});
