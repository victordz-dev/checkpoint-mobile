import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskStackParamList } from '../../types/navigation';
import { TaskStatus, TaskPriority } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../hooks/useTheme';
import { fetchCategories } from '../../services/api';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';

type TaskFormRouteProp = RouteProp<TaskStackParamList, 'TaskForm'>;
type TaskFormNavigationProp = NativeStackNavigationProp<TaskStackParamList, 'TaskForm'>;

interface Category {
  id: number;
  name: string;
  icon: string;
}

const STATUS_OPTIONS: TaskStatus[] = ['pendente', 'em_andamento', 'concluida'];
const PRIORITY_OPTIONS: TaskPriority[] = ['baixa', 'media', 'alta'];

export default function TaskFormScreen() {
  const navigation = useNavigation<TaskFormNavigationProp>();
  const route = useRoute<TaskFormRouteProp>();
  const { taskId } = route.params ?? {};

  const { addTask, updateTask, getTaskById } = useTasks();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const isEditing = !!taskId;
  const existingTask = taskId ? getTaskById(taskId) : undefined;

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status ?? 'pendente');
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority ?? 'media');
  const [category, setCategory] = useState(existingTask?.category ?? '');
  const [categoryIcon, setCategoryIcon] = useState(existingTask?.categoryIcon ?? '');

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState('');

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    loadCategories();
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

  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      // falha silenciosa — usuário pode digitar categoria manualmente
    } finally {
      setCategoriesLoading(false);
    }
  }

  function selectCategory(cat: Category) {
    setCategory(cat.name);
    setCategoryIcon(cat.icon);
  }

  async function handleSave() {
    if (!title.trim()) {
      setTitleError('O título é obrigatório.');
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && taskId) {
        await updateTask(taskId, { title, description, status, priority, category, categoryIcon });
      } else {
        await addTask({ title, description, status, priority, category, categoryIcon });
      }
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Animated.ScrollView style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top + 16, 24) }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: theme.text }]}>
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </Text>
      </View>

      {/* Título */}
      <Text style={[styles.label, { color: theme.muted }]}>Título *</Text>
      <CustomInput
        placeholder="Ex: Estudar React Native"
        value={title}
        onChangeText={(text) => { setTitle(text); setTitleError(''); }}
      />
      {titleError !== '' && <Text style={styles.errorText}>{titleError}</Text>}

      {/* Descrição */}
      <Text style={[styles.label, { color: theme.muted }]}>Descrição</Text>
      <CustomInput
        placeholder="Descreva a tarefa..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Status */}
      <Text style={[styles.label, { color: theme.muted }]}>Status</Text>
      <View style={styles.optionRow}>
        {STATUS_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.optionChip,
              { backgroundColor: theme.card, borderColor: theme.border },
              status === s && [styles.optionChipActive, { backgroundColor: theme.primary, borderColor: theme.primary }]
            ]}
            onPress={() => setStatus(s)}
          >
            <Text style={[
              styles.optionChipText,
              { color: theme.muted },
              status === s && styles.optionChipTextActive
            ]}>
              {s.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prioridade */}
      <Text style={[styles.label, { color: theme.muted }]}>Prioridade</Text>
      <View style={styles.optionRow}>
        {PRIORITY_OPTIONS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.optionChip,
              { backgroundColor: theme.card, borderColor: theme.border },
              priority === p && [styles.optionChipActive, { backgroundColor: theme.primary, borderColor: theme.primary }]
            ]}
            onPress={() => setPriority(p)}
          >
            <Text style={[
              styles.optionChipText,
              { color: theme.muted },
              priority === p && styles.optionChipTextActive
            ]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categoria */}
      <Text style={[styles.label, { color: theme.muted }]}>Categoria</Text>
      {categoriesLoading ? (
        <ActivityIndicator color={theme.primary} style={styles.loader} />
      ) : (
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                { backgroundColor: theme.card, borderColor: theme.border },
                category === cat.name && [styles.optionChipActive, { backgroundColor: theme.primary, borderColor: theme.primary }]
              ]}
              onPress={() => selectCategory(cat)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[
                styles.optionChipText,
                { color: theme.muted },
                category === cat.name && styles.optionChipTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <CustomButton
        label={isSaving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar tarefa'}
        onPress={handleSave}
        disabled={isSaving}
      />
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
    gap: 8,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionChipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
  optionChipTextActive: {
    color: '#fff',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryIcon: {
    fontSize: 16,
  },
  loader: {
    marginVertical: 12,
  },
});