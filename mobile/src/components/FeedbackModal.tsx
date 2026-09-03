import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { submitFeedback } from '../api/feedback';
import { useTheme } from '../theme/ThemeContext';
import { radius, SERIF, type Colors } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Prefilled subject line (e.g. a chapter reference or "App feedback"). */
  subject: string;
}

/** Bottom-sheet feedback form → POST /feedback (auth required). */
export function FeedbackModal({ visible, onClose, subject }: Props): React.ReactElement {
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
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.handle} />
          <Text style={styles.title}>Send feedback</Text>
          <Text style={styles.subject} numberOfLines={2}>
            {subject}
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Share your thoughts…"
            placeholderTextColor={colors.muted}
            multiline
            style={styles.input}
            autoFocus
          />
          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.send, (busy || message.trim().length < 3) && { opacity: 0.4 }]}
              onPress={send}
              disabled={busy || message.trim().length < 3}
            >
              {busy ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Feather name="send" size={15} color="#fff" />
                  <Text style={styles.sendText}>Send</Text>
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
  backdrop: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    paddingBottom: 34,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.hairline,
    marginBottom: 14,
  },
  title: { fontFamily: SERIF, fontSize: 20, fontWeight: '700', color: colors.ink },
  subject: { fontSize: 13, color: colors.muted, marginTop: 4 },
  input: {
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
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 },
  cancel: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: radius.full },
  cancelText: { fontSize: 15, fontWeight: '600', color: colors.body },
  send: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radius.full,
  },
  sendText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
