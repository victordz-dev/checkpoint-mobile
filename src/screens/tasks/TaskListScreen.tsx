import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskStackParamList } from '../../types/navigation';
import { TaskStatus } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { FilterBar } from '../../components/FilterBar';
import { EmptyState } from '../../components/EmptyState';

type TaskListNavigationProp = NativeStackNavigationProp<TaskStackParamList, 'TaskList'>;

type FilterOption = TaskStatus | 'todas';

export default function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigationProp>();
  const { tasks, isLoading } = useTasks();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todas');

  const filteredTasks =
    activeFilter === 'todas'
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />

      <FilterBar
        active={activeFilter}
        onChange={(filter) => setActiveFilter(filter as FilterOption)}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          filteredTasks.length === 0 && styles.listEmpty,
        ]}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message={
              isLoading
                ? 'Carregando tarefas...'
                : activeFilter === 'todas'
                ? 'Nenhuma tarefa criada ainda.'
                : `Nenhuma tarefa com status "${activeFilter}".`
            }
          />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
        onPress={() => navigation.navigate('TaskForm', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
});