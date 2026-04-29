import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { UserTreatment } from '../../types/user';
import { Header } from '../../components/Header';

const TREATMENT_OPTIONS: UserTreatment[] = ['Sr.', 'Sra.', 'Srta.'];

export default function SettingsScreen() {
  const { user, logout, updateTreatment } = useAuth();
  const { theme, toggleTheme } = useTheme();

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  }

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.ScrollView
      style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={styles.content}
    >
      <Header />

      {/* Perfil */}
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Perfil</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user?.treatment ? `${user.treatment} ${user.name}` : user?.name}
            </Text>
            <Text style={[styles.profileUsername, { color: theme.muted }]}>
              @{user?.username}
            </Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: user?.role === 'admin' ? '#6366f1' : '#334155' }]}>
            <Text style={styles.roleBadgeText}>{user?.role}</Text>
          </View>
        </View>
      </View>

      {/* Preferência de tratamento */}
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Tratamento</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardLabel, { color: theme.muted }]}>
          Como prefere ser chamado?
        </Text>
        <View style={styles.optionRow}>
          {TREATMENT_OPTIONS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.optionChip,
                { borderColor: theme.border, backgroundColor: theme.card },
                user?.treatment === t && [styles.optionChipActive, { backgroundColor: theme.primary, borderColor: theme.primary }],
              ]}
              onPress={() => updateTreatment(t)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  { color: theme.muted },
                  user?.treatment === t && styles.optionChipTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tema */}
      <Text style={[styles.sectionTitle, { color: theme.primary }]}>Aparência</Text>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.themeRow}>
          <View>
            <Text style={[styles.cardLabel, { color: theme.text }]}>Tema</Text>
            <Text style={[styles.themeSubLabel, { color: theme.muted }]}>
              {theme.mode === 'dark' ? '🌙 Modo escuro ativo' : '☀️ Modo claro ativo'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.mode === 'dark' ? '#6366f1' : '#e2e8f0' }]}
            onPress={toggleTheme}
          >
            <View
              style={[
                styles.themeToggleThumb,
                { transform: [{ translateX: theme.mode === 'dark' ? 24 : 2 }] },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.card }]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  card: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileUsername: {
    fontSize: 13,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionChipTextActive: {
    color: '#fff',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeSubLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  themeToggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  themeToggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
});