import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { TabParamList } from '../../types/navigation';
import { fetchMotivationalQuote } from '../../services/api';

type HomeNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface Quote {
  content: string;
  author: string;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<HomeNavigationProp>();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadQuote();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function loadQuote() {
    setQuoteLoading(true);
    setQuoteError(false);
    try {
      const data = await fetchMotivationalQuote();
      setQuote(data);
    } catch {
      setQuoteError(true);
    } finally {
      setQuoteLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={[styles.greeting, { color: theme.text }]}>
          Olá, {user?.name} 👋
        </Text>
        <Text style={[styles.subGreeting, { color: theme.muted }]}>
          Pronto para ser produtivo hoje?
        </Text>

        <View style={[styles.quoteCard, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
          <Text style={[styles.quoteLabel, { color: theme.primary }]}>💡 Frase do dia</Text>

          {quoteLoading && (
            <ActivityIndicator color="#6366f1" style={styles.loader} />
          )}

          {quoteError && !quoteLoading && (
            <View>
              <Text style={styles.quoteError}>
                Não foi possível carregar a frase.
              </Text>
              <TouchableOpacity onPress={loadQuote}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}

          {quote && !quoteLoading && (
            <>
              <Text style={[styles.quoteContent, { color: theme.text }]}>"{quote.content}"</Text>
              <Text style={[styles.quoteAuthor, { color: theme.muted }]}>— {quote.author}</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Text style={styles.ctaText}>Ver minhas tarefas →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 8,
  },
  subGreeting: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: -8,
  },
  quoteCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  quoteLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loader: {
    marginVertical: 12,
  },
  quoteContent: {
    fontSize: 16,
    color: '#e2e8f0',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'right',
  },
  quoteError: {
    color: '#f87171',
    fontSize: 14,
    marginBottom: 6,
  },
  retryText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  ctaButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});