import React, { useMemo, useState } from 'react';
import {
  Alert,
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
import { useAuth } from '../auth/AuthContext';
import { colors, radius } from '../theme';

const banner = require('../../assets/banner.png');

export default function LibraryScreen({ navigation }: ScreenProps<'Library'>): React.ReactElement {
  const { user, logout } = useAuth();
  const allBooks = getBooks();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [pickerOpen, setPickerOpen] = useState(false);

  const initial = (user?.name?.trim()?.[0] ?? 'G').toUpperCase();

  const onAvatarPress = (): void => {
    const buttons: Parameters<typeof Alert.alert>[2] = [{ text: 'Cancel', style: 'cancel' }];
    if (user?.role === 'admin') {
      buttons.push({ text: 'Dashboard', onPress: () => navigation.navigate('Admin') });
    }
    buttons.push({ text: 'Log out', style: 'destructive', onPress: () => void logout() });
    Alert.alert(user?.name ?? 'Account', user?.email || 'Guest session', buttons);
  };

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
        <Pressable style={styles.avatar} onPress={onAvatarPress}>
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
    </SafeAreaView>
  );
}

function BookCard({ book, onPress }: { book: Book; onPress: () => void }): React.ReactElement {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.glow} />
      <TraditionIcon tradition={book.tradition} size={30} />
      <Text style={styles.from}>FROM {book.title.toUpperCase()}</Text>
      <Text style={styles.subtitle}>{book.subtitle}</Text>
      <Text style={styles.metaMain}>
        {book.chapters.length} {book.unit}
      </Text>
      <Text style={styles.metaSub}>{book.language}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  banner: { height: 150, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'center' },
  bannerImg: { borderRadius: radius.lg },
  bannerText: { width: '52%', paddingLeft: 18 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', lineHeight: 26 },
  bannerSub: { fontSize: 13, color: '#1A1A1A', opacity: 0.7, marginTop: 4 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: colors.ink },
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
  from: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6, color: colors.muted, marginTop: 22 },
  subtitle: { fontSize: 25, fontWeight: '800', color: colors.gold, marginTop: 4 },
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
});
