import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import TaskCalendar from '@/components/TaskCalendar';
import TaskList, { Task as TaskListTask } from '@/components/TaskList';
import KanbanBoard from '@/components/KanbanBoard';
import BouquetManager from '@/components/BouquetManager';
import SurpriseMoments from '@/components/SurpriseMoments';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskStatus as TaskStatusType, TaskPriority, Task as TaskInterface } from '@/lib/types';

// Definir tipos locales
type Priority = TaskPriority;
type TaskType = 'general' | 'bouquet' | 'surprise';
type TaskStatus = 'todo' | 'inProgress' | 'completed';
type FlowerType = 'rosas' | 'tulipanes' | 'lirios' | 'peonias' | 'girasoles' | 'orquideas';

// Interfaz para las tareas en esta pantalla
interface ExtendedTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Usamos string para el almacenamiento
  priority: Priority;
  status: TaskStatus;
  assignedTo: string;
  type: TaskType;
  completed: boolean;
  category?: string;
  recipient?: string;
  tableNumber?: string;
  outfitDetails?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Función para convertir ExtendedTask a TaskList.Task
function convertToTaskInterface(task: ExtendedTask): TaskListTask {
  const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
  
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    dueDate,
    priority: task.priority,
    status: task.status,
    assignedTo: task.assignedTo || '',
    type: task.type,
    completed: task.completed,
    category: task.category,
    recipient: task.recipient,
    tableNumber: task.tableNumber,
    outfitDetails: task.outfitDetails,
    notes: task.notes
  };
}

// Datos de ejemplo
export default function TareasScreen() {
  console.log('TareasScreen renderizado');
  console.log('Ruta actual:', '/tareas');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'kanban'>('calendar');
  const [showBouquetManager, setShowBouquetManager] = useState(false);
  const [showSurpriseMoments, setShowSurpriseMoments] = useState(false);
  const [tasks, setTasks] = useState<ExtendedTask[]>([
    {
      id: '1',
      title: 'Confirmar catering',
      description: 'Llamar al proveedor de catering para confirmar menú',
      dueDate: '2025-06-20T14:00:00',
      priority: 'high',
      status: 'todo',
      assignedTo: 'yo',
      type: 'general',
      category: 'Comida',
      completed: false,
    },
    {
      id: '2',
      title: 'Elegir flores',
      description: 'Reunión con la florista para seleccionar arreglos',
      dueDate: '2025-06-22T11:00:00',
      priority: 'medium',
      status: 'inProgress',
      assignedTo: 'yo',
      type: 'bouquet',
      category: 'Decoración',
      completed: false,
    },
    {
      id: '3',
      title: 'Sesión de fotos pre-boda',
      description: 'Sesión de fotos en el parque',
      dueDate: '2025-06-25T16:30:00',
      priority: 'high',
      status: 'todo',
      assignedTo: 'ambos',
      type: 'general',
      completed: false,
    },
    {
      id: '4',
      title: 'Confirmar invitados',
      description: 'Llamar a los invitados pendientes de confirmación',
      dueDate: '2025-06-15T10:00:00',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'yo',
      type: 'general',
      completed: true,
    },
  ]);

  const [bouquet, setBouquet] = useState({
    flowers: ['rosas', 'peonias'] as FlowerType[],
    style: 'ramo' as 'ramo' | 'centro' | 'ramillete',
    colors: ['#E91E63', '#9C27B0'],
    notes: 'Me gustaría que predominen los tonos rosas y morados',
  });

  const [moments, setMoments] = useState([
    {
      id: '1',
      type: 'baile' as const,
      title: 'Baile sorpresa',
      description: 'Baile preparado por los amigos de la pareja',
      time: '21:30',
      responsible: 'Mejor amigo del novio',
      notes: 'Preparar pista de baile y luces especiales',
    },
  ]);

  // Filtrar tareas por fecha seleccionada
  const filteredTasks = useMemo<ExtendedTask[]>(() => {
    return tasks.filter((task: ExtendedTask) => {
      try {
        const taskDate = new Date(task.dueDate).toDateString();
        const selectedDateStr = selectedDate.toDateString();
        return taskDate === selectedDateStr;
      } catch (e) {
        console.error('Error al filtrar tareas por fecha:', e);
        return false;
      }
    });
  }, [tasks, selectedDate]);

  // Filtrar tareas por estado para el Kanban
  const todoTasks = useMemo(() => taskListTasks.filter(task => task.status === 'todo'), [taskListTasks]);
  const inProgressTasks = useMemo(() => taskListTasks.filter(task => task.status === 'inProgress'), [taskListTasks]);
  const completedTasks = useMemo(() => taskListTasks.filter(task => task.status === 'completed'), [taskListTasks]);

  // Función para manejar el cambio de estado de una tarea
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // Implementar la lógica para actualizar el estado de la tarea
    console.log(`Cambiando estado de la tarea ${taskId} a ${newStatus}`);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        status: !task.completed ? 'completed' : 'todo' as TaskStatus
      } : task
    ));
  };

  const handleAddTask = (status: TaskStatus) => {
    const newTask: ExtendedTask = {
      id: Date.now().toString(),
      title: 'Nueva tarea',
      description: 'Descripción de la tarea',
      dueDate: new Date().toISOString(),
      priority: 'medium',
      status,
      assignedTo: 'yo',
      type: 'general',
      completed: false,
      // Add any other required fields with default values
      recipient: '',
      tableNumber: '',
      outfitDetails: '',
      notes: '',
    };
    setTasks([...tasks, newTask]);
  };

  const handleSaveBouquet = (newBouquet: {
    flowers: FlowerType[];
    style: 'ramo' | 'centro' | 'ramillete';
    colors: string[];
    notes: string;
  }) => {
    setBouquet(newBouquet);
    setShowBouquetManager(false);
  };

  const handleSaveMoment = (momentData: any) => {
    if (momentData.id) {
      setMoments(moments.map(m => 
        m.id === momentData.id ? { ...momentData } : m
      ));
    } else {
      setMoments([...moments, { ...momentData, id: Date.now().toString() }]);
    }
    setShowSurpriseMoments(false);
  };

  const handleDeleteMoment = (id: string) => {
    setMoments(moments.filter(m => m.id !== id));
  };

  const handleTaskPress = (task: TaskListTask) => {
    console.log('Tarea seleccionada:', task);
    // Aquí puedes convertir de vuelta a ExtendedTask si es necesario
    const extendedTask: ExtendedTask = {
      ...task,
      id: task.id || Date.now().toString(), // Asegurar que siempre hay un ID
      dueDate: task.dueDate.toISOString()
    };
    console.log('Tarea convertida:', extendedTask);
  };

  console.log('Renderizando contenido de TareasScreen');
  
  try {
    return (
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {format(selectedDate, 'EEEE d', { locale: es })}
          <ThemedText style={styles.lightText}>
            {' '}{format(selectedDate, 'MMMM yyyy', { locale: es })}
          </ThemedText>
        </ThemedText>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
            onPress={() => setViewMode('calendar')}
          >
            <Ionicons 
              name="calendar" 
              size={20} 
              color={viewMode === 'calendar' ? '#8B5CF6' : '#9E9E9E'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? '#8B5CF6' : '#9E9E9E'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'kanban' && styles.activeToggle]}
            onPress={() => setViewMode('kanban')}
          >
            <Ionicons 
              name="grid" 
              size={20} 
              color={viewMode === 'kanban' ? '#8B5CF6' : '#9E9E9E'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {viewMode === 'calendar' && (
          <>
            <TaskCalendar 
              tasks={taskListTasks.map(t => ({
                id: t.id,
                dueDate: new Date(t.dueDate), // Convert to Date object for TaskCalendar
                priority: t.priority
              }))}
              selectedDate={selectedDate.toISOString().split('T')[0]}
              onDayPress={(date) => setSelectedDate(new Date(date))}
            />
            <TaskList 
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onTaskPress={handleTaskPress}
              showTaskType={true}
            />
          </>
        )}

        {viewMode === 'list' && (
          <TaskList 
            tasks={taskListTasks}
            onToggleComplete={handleToggleComplete}
            onTaskPress={(task) => console.log('Task pressed', task)}
          />
        )}

        {viewMode === 'kanban' && (
          <KanbanBoard 
            tasks={taskListTasks}
            onTaskPress={handleTaskPress}
            onStatusChange={handleStatusChange}
            onAddTask={handleAddTask}
          />
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Ramo de Novia</ThemedText>
            <TouchableOpacity onPress={() => setShowBouquetManager(true)}>
              <ThemedText style={styles.seeAll}>Editar</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.bouquetPreview}>
            <View style={styles.bouquetIcon}>
              <Ionicons name="flower" size={24} color="#E91E63" />
            </View>
            <View style={styles.bouquetInfo}>
              <ThemedText style={styles.bouquetTitle}>
                {bouquet.flowers.length} tipos de flores seleccionados
              </ThemedText>
              <ThemedText style={styles.bouquetStyle}>
                Estilo: {bouquet.style}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Momentos Especiales</ThemedText>
            <TouchableOpacity onPress={() => setShowSurpriseMoments(true)}>
              <ThemedText style={styles.seeAll}>Ver todos</ThemedText>
            </TouchableOpacity>
          </View>
          {moments.length > 0 ? (
            <View style={styles.momentsPreview}>
              {moments.slice(0, 2).map((moment, index) => (
                <View key={moment.id} style={styles.momentItem}>
                  <View style={[
                    styles.momentIcon,
                    { backgroundColor: '#F3E5F5' }
                  ]}>
                    <Ionicons 
                      name="gift" 
                      size={20} 
                      color="#9C27B0" 
                    />
                  </View>
                  <ThemedText style={styles.momentText}>
                    {moment.title} • {moment.time}
                  </ThemedText>
                </View>
              ))}
              {moments.length > 2 && (
                <ThemedText style={styles.moreMoments}>
                  +{moments.length - 2} momentos más
                </ThemedText>
              )}
            </View>
          ) : (
            <View style={styles.emptyMoments}>
              <Ionicons name="gift" size={24} color="#E0E0E0" />
              <ThemedText style={styles.emptyMomentsText}>
                Añade momentos especiales para tu boda
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => console.log('Add new task')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modales */}
      <Modal
        visible={showBouquetManager}
        animationType="slide"
        onRequestClose={() => setShowBouquetManager(false)}
      >
        <BouquetManager 
          onSave={handleSaveBouquet}
          initialData={bouquet}
        />
      </Modal>

      <Modal
        visible={showSurpriseMoments}
        animationType="slide"
        onRequestClose={() => setShowSurpriseMoments(false)}
      >
        <SurpriseMoments 
          moments={moments}
          onSave={handleSaveMoment}
          onDelete={handleDeleteMoment}
        />
      </Modal>
      </SafeAreaView>
    );
  } catch (error) {
    console.error('Error en TareasScreen:', error);
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9C4'}}>
        <Text>Se produjo un error al cargar la pantalla de tareas.</Text>
        <Text>Por favor, inténtalo de nuevo más tarde.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9C4',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF9C4',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5D4037',
  },
  lightText: {
    fontWeight: '400',
    color: '#9E9E9E',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  bouquetPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
  },
  bouquetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bouquetInfo: {
    flex: 1,
  },
  bouquetTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333333',
  },
  bouquetStyle: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  momentsPreview: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 8,
  },
  momentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  momentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  momentText: {
    fontSize: 14,
    color: '#666666',
  },
  moreMoments: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    padding: 8,
  },
  emptyMoments: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyMomentsText: {
    marginTop: 8,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
