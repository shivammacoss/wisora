import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBooks } from '../data/books';
import type { Book } from '../types';
import type { ScreenProps } from '../navigation';
import { TraditionIcon } from '../components/TraditionIcon';
import { FeedbackModal } from '../components/FeedbackModal';
import { useAuth } from '../auth/AuthContext';
import { radius, SERIF, type Colors } from '../theme';
import { useTheme } from '../theme/ThemeContext';

const banner = require('../../assets/banner3.png');
const BANNER_W = Dimensions.get('window').width - 32; // list has 16px padding each side
const BANNER_H = Math.round(BANNER_W / 3.559); // banner3.png native ratio (1936x544)

export default function LibraryScreen({ navigation }: ScreenProps<'Library'>): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { user, isGuest, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const allBooks = getBooks();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const initial = (user?.name?.trim()?.[0] ?? 'G').toUpperCase();

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(allBooks.map((b) => b.tradition)))],
    [allBooks],
  );

  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allBooks.filter((b) => {
      const matchesQuery =
        !q || b.title.toLowerCase().includes(q) || b.tradition.toLowerCase().includes(q);
      const matchesCat = category === 'All' || b.tradition === category;
      return matchesQuery && matchesCat;
    });
  }, [allBooks, query, category]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* topbar */}
      <View style={styles.topbar}>
        <View style={styles.search}>
          <Feather name="search" size={16} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for your next book…"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.avatar} onPress={() => setMenuOpen(true)}>
          <Text style={styles.avatarText}>{initial}</Text>
        </Pressable>
      </View>

      <FlatList
        data={books}
        keyExtractor={(b) => b.slug}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* banner */}
            <ImageBackground source={banner} style={styles.banner} imageStyle={styles.bannerImg}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Sacred wisdom, daily.</Text>
                <Text style={styles.bannerSub}>One chapter at a time.</Text>
              </View>
            </ImageBackground>

            {/* My Books header + category */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>My Books</Text>
              <Pressable style={styles.catPill} onPress={() => setPickerOpen(true)}>
                <Feather name="globe" size={14} color={colors.gold} />
                <Text style={styles.catText}>{category === 'All' ? 'All Categories' : category}</Text>
                <Feather name="chevron-down" size={14} color={colors.muted} />
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No books match your search.</Text>}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() => navigation.navigate('BookDetail', { slug: item.slug })} />
        )}
      />

      {/* category picker */}
      <Modal transparent visible={pickerOpen} animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)}>
          <View style={styles.modalCard}>
            {categories.map((c) => (
              <Pressable
                key={c}
                style={styles.modalRow}
                onPress={() => {
                  setCategory(c);
                  setPickerOpen(false);
                }}
              >
                <Text style={[styles.modalRowText, category === c && styles.modalRowActive]}>
                  {c === 'All' ? 'All Categories' : c}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* account menu */}
      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuCard}>
            <View style={styles.menuHead}>
              <View style={styles.menuAvatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.menuName} numberOfLines={1}>
                  {user?.name ?? 'Guest'}
                </Text>
                <Text style={styles.menuEmail} numberOfLines={1}>
                  {isGuest ? 'Guest session' : user?.email}
                </Text>
              </View>
            </View>
            <View style={styles.menuDivider} />

            {isAdmin && (
              <MenuItem
                icon="grid"
                label="Dashboard"
                gold
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate('Admin');
                }}
              />
            )}
            <MenuItem
              icon="user"
              label="Profile"
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate('Profile');
              }}
            />
            {!isGuest && (
              <MenuItem
                icon="message-square"
                label="Send feedback"
                onPress={() => {
                  setMenuOpen(false);
                  setFeedbackOpen(true);
                }}
              />
            )}
            <MenuItem
              icon="log-out"
              label="Sign out"
              destructive
              onPress={() => {
                setMenuOpen(false);
                void logout();
              }}
            />
          </View>
        </Pressable>
      </Modal>

      <FeedbackModal
        visible={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        subject="App feedback"
      />
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  gold,
  destructive,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  gold?: boolean;
  destructive?: boolean;
}): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const color = destructive ? '#DC2626' : gold ? colors.goldDeep : colors.body;
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Feather name={icon} size={17} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function BookCard({ book, onPress }: { book: Book; onPress: () => void }): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.glow} />
      <TraditionIcon tradition={book.tradition} size={30} />
      <Text style={styles.fromLabel}>FROM</Text>
      <Text style={styles.fromTitle}>{book.title}</Text>
      <Text style={styles.subtitle}>{book.subtitle}</Text>
      <Text style={styles.metaMain}>
        {book.chapters.length} {book.unit}
      </Text>
      <Text style={styles.metaSub}>{book.language}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.creamSurface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink, padding: 0 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { padding: 16, paddingBottom: 32 },
  banner: { width: BANNER_W, height: BANNER_H, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'center' },
  bannerImg: { borderRadius: radius.lg },
  bannerText: { width: '46%', paddingLeft: 16 },
  bannerTitle: { fontFamily: SERIF, fontSize: 18, fontWeight: '700', color: '#1A1A1A', lineHeight: 22 },
  bannerSub: { fontSize: 11, color: '#1A1A1A', opacity: 0.7, marginTop: 3 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 4,
  },
  sectionTitle: { fontFamily: SERIF, fontSize: 24, fontWeight: '700', color: colors.ink },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  catText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 20,
    marginTop: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardPressed: { opacity: 0.9, transform: [{ translateY: -2 }] },
  glow: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.gold + '18',
  },
  fromLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: colors.muted, marginTop: 22 },
  fromTitle: { fontSize: 13, fontWeight: '600', color: colors.goldDeep, marginTop: 3 },
  subtitle: { fontFamily: SERIF, fontSize: 26, fontWeight: '700', color: colors.gold, marginTop: 6 },
  metaMain: { fontSize: 14, fontWeight: '600', color: colors.ink, marginTop: 18 },
  metaSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    padding: 40,
  },
  modalCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 6 },
  modalRow: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: radius.sm },
  modalRowText: { fontSize: 15, color: colors.body },
  modalRowActive: { color: colors.goldDeep, fontWeight: '700' },
  menuBackdrop: { flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-start', alignItems: 'flex-end' },
  menuCard: {
    marginTop: 64,
    marginRight: 12,
    width: 240,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  menuHead: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, paddingVertical: 10 },
  menuAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuName: { fontSize: 15, fontWeight: '700', color: colors.ink },
  menuEmail: { fontSize: 12, color: colors.muted, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: colors.hairline, marginVertical: 6 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  menuItemText: { fontSize: 15, fontWeight: '600' },
});
