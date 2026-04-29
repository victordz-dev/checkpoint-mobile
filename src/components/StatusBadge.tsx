import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStatus } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; background: string }> = {
  pendente:     { label: 'Pendente',     color: '#f59e0b', background: '#451a03' },
  em_andamento: { label: 'Em andamento', color: '#38bdf8', background: '#0c4a6e' },
  concluida:    { label: 'Concluída',    color: '#22c55e', background: '#052e16' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.background }]}>
      <Text style={[styles.label, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});