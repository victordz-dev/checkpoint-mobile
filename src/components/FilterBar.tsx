import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TaskStatus } from '../types/task';
import { useTheme } from '../hooks/useTheme';

type FilterOption = TaskStatus | 'todas';

interface FilterBarProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
}

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'Todas',        value: 'todas' },
  { label: 'Pendente',     value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Concluída',    value: 'concluida' },
];

export function FilterBar({ active, onChange }: FilterBarProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrapper, { borderBottomColor: theme.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {FILTERS.map((filter) => {
          const isActive = active === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.chip,
                { borderColor: theme.border, backgroundColor: theme.card },
                isActive && [styles.chipActive, { backgroundColor: theme.primary, borderColor: theme.primary }],
              ]}
              onPress={() => onChange(filter.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: theme.muted },
                  isActive && styles.chipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});