import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

/** Gold tradition glyph per book — mirrors the web app's line icons. */
const MAP: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  Hinduism: 'flower-outline',
  Christianity: 'bird',
  Islam: 'star-crescent',
  Taoism: 'yin-yang',
  Buddhism: 'dharmachakra',
  Sikhism: 'fire',
};

export function TraditionIcon({
  tradition,
  size = 26,
  color = colors.gold,
}: {
  tradition: string;
  size?: number;
  color?: string;
}): React.ReactElement {
  return <MaterialCommunityIcons name={MAP[tradition] ?? 'book-open-variant'} size={size} color={color} />;
}
