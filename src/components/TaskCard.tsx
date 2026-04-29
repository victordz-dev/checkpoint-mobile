import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Task, TaskPriority } from '../types/task';
import { useTheme } from '../hooks/useTheme';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/formatDate';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  baixa: { label: 'Baixa', color: '#22c55e' },
  media: { label: 'Média', color: '#f59e0b' },
  alta:  { label: 'Alta',  color: '#ef4444' },
};

export function TaskCard({ task, onPress }: TaskCardProps) {
  const { theme } = useTheme();
  const priority = PRIORITY_CONFIG[task.priority];

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
      {/* Linha superior: ícone + título */}
      <View style={styles.topRow}>
        {task.categoryIcon ? (
          <Text style={styles.categoryIcon}>{task.categoryIcon}</Text>
        ) : null}
        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {task.title}
        </Text>
      </View>

      {/* Categoria */}
      {task.category ? (
        <Text style={[styles.category, { color: theme.muted }]}>
          {task.category}
        </Text>
      ) : null}

      {/* Badges: status + prioridade */}
      <View style={styles.badgeRow}>
        <StatusBadge status={task.status} />
        <View style={[styles.priorityBadge, { borderColor: priority.color }]}>
          <Text style={[styles.priorityText, { color: priority.color }]}>
            ▲ {priority.label}
          </Text>
        </View>
      </View>

      {/* Datas */}
      <View style={styles.dateRow}>
        <Text style={[styles.dateText, { color: theme.muted }]}>
          Criada {formatDate(task.createdAt)}
        </Text>
        {task.updatedAt !== task.createdAt && (
          <Text style={[styles.dateText, { color: theme.muted }]}>
            · Atualizada {formatDate(task.updatedAt)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  category: {
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 12,
  },
});