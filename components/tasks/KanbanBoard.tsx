import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { TaskCard } from './TaskCard';
import { Task } from './TaskForm';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Status = 'todo' | 'inProgress' | 'completed';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onStatusChange: (taskId: string, status: Status) => void;
  onAddTask: (status: Status) => void;
}

const statusConfig = {
  todo: {
    title: 'Pendientes',
    icon: 'ellipse-outline',
    color: '#FFA000',
    bgColor: '#FFF3E0',
  },
  inProgress: {
    title: 'En Progreso',
    icon: 'time-outline',
    color: '#1976D2',
    bgColor: '#E3F2FD',
  },
  completed: {
    title: 'Completadas',
    icon: 'checkmark-circle',
    color: '#388E3C',
    bgColor: '#E8F5E9',
  },
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskPress,
  onStatusChange,
  onAddTask,
}) => {
  const { width } = Dimensions.get('window');
  const scrollX = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      scrollX.value = -event.translationX;
    })
    .onEnd((event) => {
      // Handle swipe end if needed
    });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(-scrollX.value, { damping: 15 }) }],
    };
  });

  const renderColumn = (status: Status) => {
    const config = statusConfig[status];
    const filteredTasks = tasks.filter(task => task.status === status);
    
    return (
      <View key={status} style={[styles.column, { width: width - 32 }]}>
        <View style={[styles.columnHeader, { backgroundColor: config.bgColor }]}>
          <View style={styles.columnTitleContainer}>
            <Ionicons name={config.icon as any} size={18} color={config.color} />
            <ThemedText style={[styles.columnTitle, { color: config.color, marginLeft: 8 }]}>
              {config.title}
            </ThemedText>
            <View style={[styles.countBadge, { backgroundColor: config.color }]}>
              <ThemedText style={styles.countText}>{filteredTasks.length}</ThemedText>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddTask(status)}
          >
            <Ionicons name="add" size={20} color={config.color} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.tasksContainer}
          contentContainerStyle={styles.tasksContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onPress={() => onTaskPress(task)}
                onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name={status === 'completed' ? 'checkmark-done-circle' : 'document-text'} 
                size={48} 
                color="#E0E0E0" 
              />
              <ThemedText style={styles.emptyStateText}>
                {status === 'completed' 
                  ? 'No hay tareas completadas' 
                  : 'No hay tareas en esta sección'}
              </ThemedText>
              <TouchableOpacity 
                style={[styles.addTaskButton, { borderColor: config.color }]}
                onPress={() => onAddTask(status)}
              >
                <Ionicons name="add" size={16} color={config.color} />
                <ThemedText style={[styles.addTaskButtonText, { color: config.color }]}>
                  Añadir tarea
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.scrollContent, animatedStyle]}>
          <View style={styles.columnsContainer}>
            {(['todo', 'inProgress', 'completed'] as Status[]).map(renderColumn)}
          </View>
        </Animated.View>
      </GestureDetector>
      
      {/* Scroll indicators */}
      <View style={styles.scrollIndicators}>
        {[0, 1, 2].map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.indicator, 
              { 
                backgroundColor: scrollX.value / (width - 32) < index + 0.5 && 
                              scrollX.value / (width - 32) > index - 1.5 
                  ? '#8B5CF6' 
                  : '#E0E0E0' 
              }
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  scrollContent: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  column: {
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  countBadge: {
    marginLeft: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 4,
  },
  tasksContainer: {
    flex: 1,
  },
  tasksContent: {
    padding: 12,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    marginTop: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 16,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addTaskButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});
