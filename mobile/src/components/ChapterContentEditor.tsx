import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chaptersApi } from '../api/chapters';
import type { Book, Chapter } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { radius, SERIF, type Colors } from '../theme';

export interface SavedChapter {
  blocks: string[];
  title?: string;
  essence?: string;
}

/** Content blocks ↔ a single editable text value (one block per line). */
function blocksFromText(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
function textFromBlocks(blocks: string[]): string {
  return blocks.join('\n');
}

interface Props {
  book: Book;
  chapter: Chapter;
  visible: boolean;
  onClose: () => void;
  onSaved?: (saved: SavedChapter) => void;
}

/** Admin-only editor for a chapter's reading content (title / essence / body). */
export function ChapterContentEditor({ book, chapter, visible, onClose, onSaved }: Props): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [title, setTitle] = useState('');
  const [essence, setEssence] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let alive = true;
    setLoading(true);
    setError(null);
    chaptersApi
      .getContent(book.slug, chapter.order)
      .then((content) => {
        if (!alive) return;
        const blocks = content?.blocks ?? chapter.content ?? [];
        setText(textFromBlocks(blocks));
        setTitle(content?.title ?? chapter.title ?? '');
        setEssence(content?.essence ?? chapter.essence ?? '');
      })
      .catch(() => alive && setError('Could not load existing content.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [visible, book.slug, chapter.order, chapter.content, chapter.title, chapter.essence]);

  const save = (): void => {
    setSaving(true);
    setError(null);
    const blocks = blocksFromText(text);
    const trimmedTitle = title.trim();
    const trimmedEssence = essence.trim();
    chaptersApi
      .saveContent(book.slug, chapter.order, {
        blocks,
        title: trimmedTitle || undefined,
        essence: trimmedEssence || undefined,
      })
      .then(() => {
        onSaved?.({
          blocks,
          title: trimmedTitle || undefined,
          essence: trimmedEssence || undefined,
        });
        onClose();
      })
      .catch((e) => {
        setError((e as Error).message);
        setSaving(false);
      });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.hTitle}>Edit chapter content</Text>
            <Text style={styles.hSub} numberOfLines={1}>
              {book.title} · {chapter.title}
            </Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose} disabled={saving} hitSlop={8}>
            <Feather name="x" size={22} color={colors.body} />
          </Pressable>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.gold} />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>CHAPTER TITLE</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Arjuna's Dilemma"
                placeholderTextColor={colors.muted}
                style={styles.input}
              />

              <Text style={styles.label}>ESSENCE</Text>
              <TextInput
                value={essence}
                onChangeText={setEssence}
                placeholder="A one- or two-sentence distilled summary."
                placeholderTextColor={colors.muted}
                multiline
                style={[styles.input, styles.essenceInput]}
              />

              <Text style={styles.label}>REFLECTION (BODY)</Text>
              <Text style={styles.hint}>
                One block per line. Formatting: ## heading, {'>'} verse, - bullet, --- divider. Plain
                lines become paragraphs.
              </Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder={'Write the chapter here — one block per line.'}
                placeholderTextColor={colors.muted}
                multiline
                style={[styles.input, styles.bodyInput]}
                autoCapitalize="sentences"
              />

              {error && <Text style={styles.error}>{error}</Text>}
            </ScrollView>
          )}

          {/* footer */}
          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.saveBtn, (saving || loading) && { opacity: 0.5 }]} onPress={save} disabled={saving || loading}>
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="check" size={16} color="#fff" />
                  <Text style={styles.saveText}>Save content</Text>
                </>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  hTitle: { fontFamily: SERIF, fontSize: 18, fontWeight: '700', color: colors.ink },
  hSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  closeBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 18, paddingBottom: 30 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: colors.muted, marginBottom: 6, marginTop: 14 },
  hint: { fontSize: 12, color: colors.muted, marginBottom: 8, lineHeight: 17 },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  essenceInput: { minHeight: 72, textAlignVertical: 'top', fontStyle: 'italic' },
  bodyInput: { minHeight: 240, textAlignVertical: 'top', fontSize: 14, lineHeight: 21 },
  error: { color: '#DC2626', fontSize: 13, marginTop: 14 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: colors.body },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  saveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
