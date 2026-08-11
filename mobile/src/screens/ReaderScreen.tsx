import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookBySlug } from '../data/books';
import { fetchChapterOverride } from '../api';
import { submitFeedback } from '../api/feedback';
import { ContentBlocks } from '../components/ContentBlocks';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import type { ScreenProps } from '../navigation';
import { radius, SERIF, type Colors } from '../theme';

export default function ReaderScreen({
  route,
  navigation,
}: ScreenProps<'Reader'>): React.ReactElement {
  const { colors, isDark, toggle } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { isGuest } = useAuth();
  const { slug, order } = route.params;
  const book = getBookBySlug(slug);
  const chapter = book?.chapters.find((c) => c.order === order);

  // Admin-authored override fetched from the live backend (falls back to bundled).
  const [override, setOverride] = useState<{
    title: string | null;
    essence: string | null;
    blocks: string[];
  } | null>(null);

  const [liked, setLiked] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const likeKey = `wisora.like.${slug}.${order}`;

  useEffect(() => {
    let alive = true;
    setOverride(null);
    fetchChapterOverride(slug, order).then((r) => alive && setOverride(r));
    return () => {
      alive = false;
    };
  }, [slug, order]);

  // Load persisted like state for this chapter.
  useEffect(() => {
    let alive = true;
    setLiked(false);
    AsyncStorage.getItem(likeKey).then((v) => alive && setLiked(v === '1'));
    return () => {
      alive = false;
    };
  }, [likeKey]);

  const toggleLike = (): void => {
    setLiked((prev) => {
      const nv = !prev;
      void AsyncStorage.setItem(likeKey, nv ? '1' : '0');
      return nv;
    });
  };

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
  const subject = `${book.title} — Chapter ${chapter.order}: ${view.title}`;

  const openFeedback = (): void => {
    if (isGuest) {
      Alert.alert('Log in required', 'Please log in to send feedback on this chapter.');
      return;
    }
    setFeedbackOpen(true);
  };

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

      {/* ── floating action bar: prev · like · feedback · theme · next ── */}
      <View style={styles.actionBar}>
        <ToolbarButton disabled={!prev} onPress={() => prev && navigation.replace('Reader', { slug, order: prev.order })}>
          <Feather name="chevron-left" size={22} color={prev ? colors.ink : colors.muted} />
        </ToolbarButton>

        <View style={styles.actionGroup}>
          <ToolbarButton onPress={toggleLike}>
            <MaterialCommunityIcons
              name={liked ? 'heart' : 'heart-outline'}
              size={23}
              color={liked ? colors.gold : colors.muted}
            />
          </ToolbarButton>
          <ToolbarButton onPress={openFeedback}>
            <Feather name="message-square" size={21} color={colors.muted} />
          </ToolbarButton>
          <ToolbarButton onPress={toggle}>
            <Feather name={isDark ? 'sun' : 'moon'} size={21} color={isDark ? colors.gold : colors.muted} />
          </ToolbarButton>
        </View>

        <ToolbarButton onPress={() => (next ? navigation.replace('Reader', { slug, order: next.order }) : navigation.goBack())}>
          <Feather name="chevron-right" size={22} color={colors.ink} />
        </ToolbarButton>
      </View>

      <FeedbackModal
        visible={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        subject={subject}
      />
    </SafeAreaView>
  );
}

function ToolbarButton({
  children,
  onPress,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.toolBtn, pressed && !disabled && styles.toolBtnPressed, disabled && styles.toolBtnDisabled]}
      hitSlop={6}
    >
      {children}
    </Pressable>
  );
}

function FeedbackModal({
  visible,
  onClose,
  subject,
}: {
  visible: boolean;
  onClose: () => void;
  subject: string;
}): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const send = (): void => {
    if (message.trim().length < 3) return;
    setBusy(true);
    submitFeedback(subject, message.trim())
      .then(() => {
        setBusy(false);
        setMessage('');
        onClose();
        Alert.alert('Thank you', 'Your feedback has been sent.');
      })
      .catch((e) => {
        setBusy(false);
        Alert.alert('Could not send', (e as Error).message);
      });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.fbBackdrop} onPress={onClose}>
        <Pressable style={styles.fbSheet} onPress={() => undefined}>
          <View style={styles.fbHandle} />
          <Text style={styles.fbTitle}>Send feedback</Text>
          <Text style={styles.fbSubject} numberOfLines={2}>
            {subject}
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Share your thoughts on this chapter…"
            placeholderTextColor={colors.muted}
            multiline
            style={styles.fbInput}
            autoFocus
          />
          <View style={styles.fbActions}>
            <Pressable style={styles.fbCancel} onPress={onClose}>
              <Text style={styles.fbCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.fbSend, (busy || message.trim().length < 3) && { opacity: 0.4 }]}
              onPress={send}
              disabled={busy || message.trim().length < 3}
            >
              {busy ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="send" size={15} color="#fff" />
                  <Text style={styles.fbSendText}>Send</Text>
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 28 },
  missing: { padding: 24, color: colors.body },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4, color: colors.gold },
  title: { fontFamily: SERIF, fontSize: 28, fontWeight: '700', color: colors.ink, marginTop: 6, lineHeight: 34 },
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
    fontFamily: SERIF,
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

  /* action bar */
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  toolBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnPressed: { backgroundColor: colors.creamSurface },
  toolBtnDisabled: { opacity: 0.3 },

  /* feedback modal */
  fbBackdrop: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  fbSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    paddingBottom: 34,
  },
  fbHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.hairline,
    marginBottom: 14,
  },
  fbTitle: { fontFamily: SERIF, fontSize: 20, fontWeight: '700', color: colors.ink },
  fbSubject: { fontSize: 13, color: colors.muted, marginTop: 4 },
  fbInput: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.creamSurface,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    color: colors.ink,
    minHeight: 110,
    textAlignVertical: 'top',
    marginTop: 14,
  },
  fbActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  fbCancel: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: radius.full },
  fbCancelText: { fontSize: 15, fontWeight: '600', color: colors.body },
  fbSend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radius.full,
  },
  fbSendText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
