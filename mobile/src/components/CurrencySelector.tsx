import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CURRENCIES, type CurrencyOption } from '../currency/CurrencyContext';
import { radius, type Colors } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  value: CurrencyOption;
  onChange: (c: CurrencyOption) => void;
}

/** Pill-shaped currency dropdown (Globe + code + symbol + chevron), web-matched. */
export function CurrencySelector({ value, onChange }: Props): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.pill} onPress={() => setOpen(true)}>
        <Feather name="globe" size={15} color={colors.gold} />
        <Text style={styles.pillText}>
          {value.code} {value.symbol}
        </Text>
        <Feather name="chevron-down" size={15} color={colors.muted} />
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {CURRENCIES.map((c) => {
              const selected = c.code === value.code;
              return (
                <Pressable
                  key={c.code}
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.symbol}>{c.symbol}</Text>
                    <Text style={styles.label}>{c.label}</Text>
                  </View>
                  <Text style={styles.code}>{c.code}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  pillText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  backdrop: { flex: 1, backgroundColor: '#00000055', justifyContent: 'center', padding: 36 },
  menu: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  rowSelected: { backgroundColor: colors.creamSurface },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  symbol: { width: 26, fontSize: 15, fontWeight: '700', color: colors.gold },
  label: { fontSize: 15, color: colors.body },
  code: { fontSize: 12, fontWeight: '600', color: colors.muted },
});
