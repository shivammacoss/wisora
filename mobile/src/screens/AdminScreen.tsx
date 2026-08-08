import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adminApi, type AdminFeedback, type AdminPayment, type AdminUser } from '../api/admin';
import { getBooks } from '../data/books';
import { useAuth } from '../auth/AuthContext';
import type { ScreenProps } from '../navigation';
import { colors, radius } from '../theme';

type Section = 'overview' | 'users' | 'payments' | 'feedback' | 'books';

const NAV: { key: Section; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid' },
  { key: 'users', label: 'Users', icon: 'users' },
  { key: 'payments', label: 'Payments', icon: 'credit-card' },
  { key: 'feedback', label: 'Feedback', icon: 'message-square' },
  { key: 'books', label: 'Books', icon: 'book-open' },
];

const CURRENCY_SYMBOL: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' };

export default function AdminScreen({ navigation }: ScreenProps<'Admin'>): React.ReactElement {
  const { user, logout } = useAuth();
  const [section, setSection] = useState<Section>('overview');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="shield-check" size={22} color={colors.gold} />
          <View>
            <Text style={styles.headerTitle}>Wisora Admin</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {user?.email || 'Signed in'}
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.exitBtn}
          onPress={() => navigation.navigate('Library')}
        >
          <Feather name="log-out" size={16} color={colors.body} />
        </Pressable>
      </View>

      {/* section pills */}
      <View style={styles.pillsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          {NAV.map((item) => {
            const active = section === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setSection(item.key)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Feather name={item.icon} size={13} color={active ? colors.goldDeep : colors.muted} />
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.body}>
        {section === 'overview' && <OverviewSection onGo={setSection} />}
        {section === 'users' && <UsersSection currentAdminId={user?.id} />}
        {section === 'payments' && <PaymentsSection />}
        {section === 'feedback' && <FeedbackSection />}
        {section === 'books' && <BooksSection />}
      </View>
    </SafeAreaView>
  );
}

/* ───────── data helper ───────── */

function useFetch<T>(fn: () => Promise<T>): {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fn()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError((e as Error).message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);
  return { data, loading, error, reload };
}

function StateWrap({
  loading,
  error,
  empty,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  if (error) return <Text style={styles.errText}>{error}</Text>;
  if (empty) return <Text style={styles.emptyText}>Nothing here yet.</Text>;
  return <>{children}</>;
}

/* ───────── Overview ───────── */

function OverviewSection({ onGo }: { onGo: (s: Section) => void }): React.ReactElement {
  const users = useFetch(adminApi.users.list);
  const feedback = useFetch(adminApi.feedback.list);
  const payments = useFetch(adminApi.payments.history);

  const stats: { label: string; value: string; go: Section; icon: keyof typeof Feather.glyphMap }[] = [
    { label: 'Total users', value: users.data ? String(users.data.length) : '—', go: 'users', icon: 'users' },
    {
      label: 'Open feedback',
      value: feedback.data ? String(feedback.data.filter((f) => f.status === 'open').length) : '—',
      go: 'feedback',
      icon: 'message-square',
    },
    { label: 'Payments', value: payments.data ? String(payments.data.length) : '—', go: 'payments', icon: 'credit-card' },
    { label: 'Books', value: String(getBooks().length), go: 'books', icon: 'book-open' },
  ];

  const anyError = users.error ?? feedback.error ?? payments.error;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {anyError && <Text style={styles.errBanner}>{anyError} — data below may be incomplete.</Text>}
      <View style={styles.statGrid}>
        {stats.map((s) => (
          <Pressable key={s.label} style={styles.statCard} onPress={() => onGo(s.go)}>
            <View style={styles.statIcon}>
              <Feather name={s.icon} size={18} color={colors.goldDeep} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.bodyText}>
          Welcome to the Wisora admin panel. Use the tabs above to manage users, review payments,
          respond to reader feedback, and browse the book catalog.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ───────── Users ───────── */

function UsersSection({ currentAdminId }: { currentAdminId?: string }): React.ReactElement {
  const { data, loading, error, reload } = useFetch(adminApi.users.list);
  const [busy, setBusy] = useState<string | null>(null);

  const toggleRole = (u: AdminUser): void => {
    setBusy(u.id);
    adminApi.users
      .updateRole(u.id, u.role === 'admin' ? 'user' : 'admin')
      .then(reload)
      .catch((e) => Alert.alert('Error', (e as Error).message))
      .finally(() => setBusy(null));
  };

  const remove = (u: AdminUser): void => {
    Alert.alert('Delete user', `Delete ${u.email}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setBusy(u.id);
          adminApi.users
            .remove(u.id)
            .then(reload)
            .catch((e) => Alert.alert('Error', (e as Error).message))
            .finally(() => setBusy(null));
        },
      },
    ]);
  };

  return (
    <StateWrap loading={loading} error={error} empty={data?.length === 0}>
      <FlatList
        data={data ?? []}
        keyExtractor={(u) => u.id}
        contentContainerStyle={styles.scroll}
        renderItem={({ item: u }) => {
          const isSelf = u.id === currentAdminId;
          const disabled = isSelf || busy === u.id;
          return (
            <View style={styles.rowCard}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.rowTop}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {u.name}
                  </Text>
                  <View style={[styles.rolePill, u.role === 'admin' ? styles.rolePillAdmin : styles.rolePillUser]}>
                    <Text style={[styles.rolePillText, u.role === 'admin' && styles.rolePillTextAdmin]}>
                      {u.role}
                    </Text>
                  </View>
                </View>
                <Text style={styles.rowSub} numberOfLines={1}>
                  {u.email}
                </Text>
                <Text style={styles.rowMeta}>Joined {new Date(u.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable
                  disabled={disabled}
                  onPress={() => toggleRole(u)}
                  style={[styles.iconBtn, disabled && styles.iconBtnDisabled]}
                >
                  <Feather name={u.role === 'admin' ? 'shield-off' : 'shield'} size={16} color={colors.body} />
                </Pressable>
                <Pressable
                  disabled={disabled}
                  onPress={() => remove(u)}
                  style={[styles.iconBtn, disabled && styles.iconBtnDisabled]}
                >
                  <Feather name="trash-2" size={16} color="#DC2626" />
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </StateWrap>
  );
}

/* ───────── Payments ───────── */

function PaymentsSection(): React.ReactElement {
  const { data, loading, error } = useFetch(adminApi.payments.history);
  return (
    <StateWrap loading={loading} error={error} empty={data?.length === 0}>
      <FlatList
        data={data ?? []}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.scroll}
        renderItem={({ item: p }: { item: AdminPayment }) => {
          const paid = p.status === 'paid';
          const failed = p.status === 'failed';
          return (
            <View style={styles.rowCard}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.rowName}>
                  {(CURRENCY_SYMBOL[p.currency] ?? '')}
                  {(p.amount / 100).toFixed(2)} · Chapter #{p.chapterOrder}
                </Text>
                <Text style={styles.rowSub} numberOfLines={1}>
                  {p.provider} · {new Date(p.createdAt).toLocaleString()}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  paid ? styles.statusPaid : failed ? styles.statusFailed : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    paid ? styles.statusTextPaid : failed ? styles.statusTextFailed : styles.statusTextPending,
                  ]}
                >
                  {p.status}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </StateWrap>
  );
}

/* ───────── Feedback ───────── */

function FeedbackSection(): React.ReactElement {
  const { data, loading, error, reload } = useFetch(adminApi.feedback.list);
  return (
    <StateWrap loading={loading} error={error} empty={data?.length === 0}>
      <FlatList
        data={data ?? []}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.scroll}
        renderItem={({ item }) => <FeedbackCard item={item} onReplied={reload} />}
      />
    </StateWrap>
  );
}

function FeedbackCard({ item, onReplied }: { item: AdminFeedback; onReplied: () => void }): React.ReactElement {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const send = (): void => {
    if (reply.trim().length < 1) return;
    setSending(true);
    setErr(null);
    adminApi.feedback
      .reply(item.id, reply.trim())
      .then(onReplied)
      .catch((e) => {
        setErr((e as Error).message);
        setSending(false);
      });
  };

  return (
    <View style={styles.card}>
      <View style={styles.fbHead}>
        <Text style={styles.rowName} numberOfLines={1}>
          {item.subject}
        </Text>
        <View style={[styles.statusPill, item.status === 'replied' ? styles.statusPaid : styles.statusPending]}>
          <Text style={[styles.statusText, item.status === 'replied' ? styles.statusTextPaid : styles.statusTextPending]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.rowMeta}>
        {item.userName} · {item.userEmail}
      </Text>
      <Text style={styles.fbMessage}>{item.message}</Text>

      {item.reply ? (
        <View style={styles.replyBox}>
          <Text style={styles.replyLabel}>YOUR REPLY</Text>
          <Text style={styles.bodyText}>{item.reply}</Text>
        </View>
      ) : (
        <View style={{ marginTop: 12 }}>
          <TextInput
            value={reply}
            onChangeText={setReply}
            placeholder="Write a reply to this reader…"
            placeholderTextColor={colors.muted}
            multiline
            style={styles.replyInput}
          />
          {err && <Text style={styles.errText}>{err}</Text>}
          <Pressable
            onPress={send}
            disabled={sending || reply.trim().length < 1}
            style={[styles.sendBtn, (sending || reply.trim().length < 1) && { opacity: 0.4 }]}
          >
            <Feather name="send" size={14} color="#fff" />
            <Text style={styles.sendText}>{sending ? 'Sending…' : 'Send reply'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ───────── Books ───────── */

function BooksSection(): React.ReactElement {
  const books = getBooks();
  return (
    <FlatList
      data={books}
      keyExtractor={(b) => b.slug}
      contentContainerStyle={styles.scroll}
      renderItem={({ item: b }) => (
        <View style={styles.card}>
          <Text style={styles.bookTradition}>{b.tradition.toUpperCase()}</Text>
          <Text style={styles.bookTitle}>{b.title}</Text>
          <Text style={styles.rowMeta}>
            {b.chapters.length} {b.unit} · {b.language}
          </Text>
          <Text style={styles.bodyText} numberOfLines={2}>
            {b.description}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  headerSub: { fontSize: 12, color: colors.muted },
  exitBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillsWrap: { borderBottomWidth: 1, borderBottomColor: colors.hairline, backgroundColor: colors.surface },
  pills: { gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
  },
  pillActive: { backgroundColor: colors.gold + '22' },
  pillText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  pillTextActive: { color: colors.goldDeep },
  body: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32, gap: 12 },
  center: { paddingVertical: 40, alignItems: 'center' },
  errText: { color: '#DC2626', fontSize: 13, marginTop: 8 },
  errBanner: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  emptyText: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.gold + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 30, fontWeight: '800', color: colors.ink, marginTop: 12 },
  statLabel: { fontSize: 13, color: colors.muted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: 16,
  },
  bodyText: { fontSize: 14, color: colors.body, lineHeight: 21, marginTop: 4 },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: 14,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowName: { fontSize: 15, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  rowSub: { fontSize: 13, color: colors.body, marginTop: 2 },
  rowMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  rowActions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDisabled: { opacity: 0.3 },
  rolePill: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  rolePillAdmin: { backgroundColor: colors.gold + '26' },
  rolePillUser: { backgroundColor: colors.creamSurface },
  rolePillText: { fontSize: 11, fontWeight: '700', color: colors.muted },
  rolePillTextAdmin: { color: colors.goldDeep },
  statusPill: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusPaid: { backgroundColor: '#D1FAE5' },
  statusFailed: { backgroundColor: '#FEE2E2' },
  statusPending: { backgroundColor: colors.creamSurface },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  statusTextPaid: { color: '#059669' },
  statusTextFailed: { color: '#DC2626' },
  statusTextPending: { color: colors.muted },
  fbHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  fbMessage: { fontSize: 14, color: colors.body, lineHeight: 21, marginTop: 10 },
  replyBox: {
    marginTop: 14,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold + '80',
    backgroundColor: colors.creamSurface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  replyLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: colors.goldDeep },
  replyInput: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.creamSurface,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginTop: 10,
  },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  bookTradition: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: colors.goldDeep },
  bookTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginTop: 3 },
});
