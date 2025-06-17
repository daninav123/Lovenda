import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

type Priority = 'low' | 'medium' | 'high';
type TaskType = 'general' | 'bouquet' | 'surprise';
type TaskStatus = 'todo' | 'inProgress' | 'completed';

export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
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
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onTaskPress: (task: Task) => void;
  showTaskType?: boolean;
}

export default function TaskList({ tasks, onToggleComplete, onTaskPress, showTaskType = false }: TaskListProps) {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-done" size={48} color="#E0E0E0" />
        <ThemedText style={styles.emptyText}>No hay tareas pendientes</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TouchableOpacity 
          key={task.id} 
          style={styles.taskItem}
          onPress={() => onTaskPress(task)}
        >
          <TouchableOpacity 
            style={[styles.checkbox, { borderColor: getPriorityColor(task.priority) }]}
            onPress={() => {
              if (task.id) {
                onToggleComplete(task.id);
              } else {
                console.warn('Cannot toggle complete: Task ID is missing');
              }
            }}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={20} color={getPriorityColor(task.priority)} />
            )}
          </TouchableOpacity>
          <View style={styles.taskContent}>
            <View style={styles.taskInfo}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ThemedText style={styles.taskTitle} numberOfLines={1}>
                  {task.title}
                </ThemedText>
                {showTaskType && task.type !== 'general' && (
                  <View style={[styles.taskTypeBadge, {backgroundColor: task.type === 'bouquet' ? '#F3E5F5' : '#E8F5E9'}]}>
                    <ThemedText style={[styles.taskTypeText, {color: task.type === 'bouquet' ? '#8E24AA' : '#2E7D32'}]}>
                      {task.type === 'bouquet' ? 'Ramo' : 'Sorpresa'}
                    </ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.taskDate}>
                {task.dueDate instanceof Date 
                  ? task.dueDate.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : new Date(task.dueDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
              </ThemedText>
              {task.description && (
                <ThemedText style={styles.taskDescription} numberOfLines={2}>
                  {task.description}
                </ThemedText>
              )}
            </View>
            {task.category && (
              <View style={[styles.categoryBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
                <ThemedText style={[styles.categoryText, { color: getPriorityColor(task.priority) }]}>
                  {task.category}
                </ThemedText>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  taskDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taskTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  taskTypeText: {
    fontSize: 10,
    fontWeight: '600',
    marginRight: 8,
  },
  categoryBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
