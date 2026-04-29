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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskStackParamList } from '../../types/navigation';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatDate';

type TaskDetailRouteProp = RouteProp<TaskStackParamList, 'TaskDetail'>;
type TaskDetailNavigationProp = NativeStackNavigationProp<TaskStackParamList, 'TaskDetail'>;

const PRIORITY_COLORS: Record<string, string> = {
  baixa: '#22c55e',
  media: '#f59e0b',
  alta: '#ef4444',
};

export default function TaskDetailScreen() {
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params;

  const { getTaskById, removeTask } = useTasks();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const task = getTaskById(taskId);

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

  if (!task) {
    return (
      <View style={[styles.notFound, { backgroundColor: theme.background }]}>
        <Text style={styles.notFoundText}>Tarefa não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleDelete() {
    Alert.alert(
      'Excluir tarefa',
      `Tem certeza que deseja excluir "${task!.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await removeTask(taskId);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <Animated.ScrollView style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 16, 24) }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Cabeçalho da tarefa */}
      <View style={styles.taskHeader}>
        {task.categoryIcon ? (
          <Text style={styles.categoryIcon}>{task.categoryIcon}</Text>
        ) : null}
        <Text style={[styles.title, { color: theme.text }]}>{task.title}</Text>
        <StatusBadge status={task.status} />
      </View>

      {/* Descrição */}
      {task.description ? (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>Descrição</Text>
          <Text style={[styles.description, { color: theme.text }]}>{task.description}</Text>
        </View>
      ) : null}

      {/* Detalhes */}
      <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Categoria</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{task.category || '—'}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Prioridade</Text>
          <Text style={[styles.detailValue, { color: PRIORITY_COLORS[task.priority] }]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Criada em</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(task.createdAt)}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.muted }]}>Atualizada em</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(task.updatedAt)}</Text>
        </View>
      </View>

      {/* Ações */}
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
      >
        <Text style={styles.editButtonText}>✏️ Editar tarefa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.card, borderColor: theme.error }]} onPress={handleDelete}>
        <Text style={[styles.deleteButtonText, { color: theme.error }]}>🗑️ Excluir tarefa</Text>
      </TouchableOpacity>

    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  notFound: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  notFoundText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  backLink: {
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
    padding: 4,
  },
  taskHeader: {
    gap: 8,
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f8fafc',
    lineHeight: 32,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
  },
  editButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 16,
  },
});