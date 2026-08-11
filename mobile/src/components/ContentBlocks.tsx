import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type Colors } from '../theme';
import { useTheme } from '../theme/ThemeContext';

/** Render **bold** / *italic* inline spans within a block. */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((p) => p.length > 0);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <Text key={i} style={{ fontWeight: '700' }}>
          {p.slice(2, -2)}
        </Text>
      );
    }
    if (p.startsWith('*') && p.endsWith('*')) {
      return (
        <Text key={i} style={{ fontStyle: 'italic' }}>
          {p.slice(1, -1)}
        </Text>
      );
    }
    return <Text key={i}>{p}</Text>;
  });
}

/**
 * Renders a chapter's content blocks (light-markdown subset) as native views.
 * Matches the web reader: headings, verse, transliteration, quotes, bullets.
 */
export function ContentBlocks({ blocks }: { blocks: string[] }): React.ReactElement {
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <View>
      {blocks.map((raw, i) => {
        const b = raw.trim();
        if (b === '---') return <View key={i} style={styles.divider} />;
        if (b.startsWith('### ')) return <Text key={i} style={styles.h3}>{b.slice(4)}</Text>;
        if (b.startsWith('## ')) return <Text key={i} style={styles.h2}>{b.slice(3)}</Text>;
        if (b.startsWith('>> '))
          return <Text key={i} style={styles.verse}>{b.slice(3)}</Text>;
        if (b.startsWith('~ '))
          return <Text key={i} style={styles.translit}>{b.slice(2)}</Text>;
        if (b.startsWith('> '))
          return (
            <View key={i} style={styles.quoteWrap}>
              <Text style={styles.quote}>{renderInline(b.slice(2))}</Text>
            </View>
          );
        if (b.startsWith('- '))
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{renderInline(b.slice(2))}</Text>
            </View>
          );
        return <Text key={i} style={styles.p}>{renderInline(b)}</Text>;
      })}
    </View>
  );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.hairline,
    marginVertical: 20,
    alignSelf: 'center',
    width: 64,
  },
  h2: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 22,
    marginBottom: 8,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.goldDeep,
    marginTop: 18,
    marginBottom: 6,
  },
  verse: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.gold,
    marginVertical: 10,
  },
  translit: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    color: colors.goldDeep,
    marginBottom: 12,
  },
  quoteWrap: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    backgroundColor: colors.creamSurface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  quote: {
    fontSize: 17,
    lineHeight: 27,
    fontStyle: 'italic',
    color: colors.ink,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 6, paddingRight: 8 },
  bulletDot: { color: colors.gold, fontSize: 16, marginRight: 8, lineHeight: 26 },
  bulletText: { flex: 1, fontSize: 16, lineHeight: 26, color: colors.body },
  p: { fontSize: 16.5, lineHeight: 28, color: colors.body, marginBottom: 14 },
});
