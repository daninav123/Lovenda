import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from './TaskForm';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width * 0.8;
const SPACING = 16;

interface KanbanBoardProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

export default function KanbanBoard({ 
  tasks, 
  onTaskPress, 
  onStatusChange,
  onAddTask 
}: KanbanBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const columns: { status: TaskStatus; title: string; icon: string }[] = [
    { status: 'todo', title: 'Por hacer', icon: 'list' },
    { status: 'inProgress', title: 'En progreso', icon: 'time' },
    { status: 'completed', title: 'Completadas', icon: 'checkmark-done' },
  ];

  const filteredTasks = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / COLUMN_WIDTH);
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * COLUMN_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Handle horizontal swipes to change columns
        if (Math.abs(gestureState.dx) > 10) {
          scrollViewRef.current?.setNativeProps({
            scrollEnabled: false,
          });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        scrollViewRef.current?.setNativeProps({
          scrollEnabled: true,
        });
        
        // If the swipe was significant enough, change the column
        if (Math.abs(gestureState.dx) > 50) {
          const direction = gestureState.dx > 0 ? -1 : 1;
          const newIndex = Math.max(0, Math.min(columns.length - 1, currentIndex + direction));
          scrollToIndex(newIndex);
        }
      },
    })
  ).current;

  // Animated indicators for the column selector
  const position = Animated.divide(scrollX, COLUMN_WIDTH);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Column selector */}
      <View style={styles.selectorContainer}>
        {columns.map((column, index) => {
          const opacity = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          
          const scale = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.9, 1.1, 0.9],
            extrapolate: 'clamp',
          });
          
          return (
            <TouchableOpacity
              key={column.status}
              style={styles.selectorTab}
              onPress={() => scrollToIndex(index)}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.selectorContent, { opacity, transform: [{ scale }] }]}>
                <Ionicons 
                  name={column.icon as any} 
                  size={16} 
                  color={currentIndex === index ? '#8B5CF6' : '#9E9E9E'} 
                  style={styles.selectorIcon}
                />
                <ThemedText 
                  style={[
                    styles.selectorText,
                    currentIndex === index && styles.selectorTextActive
                  ]}
                >
                  {column.title}
                </ThemedText>
                <View 
                  style={[
                    styles.selectorIndicator,
                    currentIndex === index && styles.selectorIndicatorActive
                  ]} 
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Kanban columns */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {columns.map((column) => (
          <View key={column.status} style={styles.column}>
            <View style={styles.columnHeader}>
              <ThemedText style={styles.columnTitle}>
                {column.title} ({filteredTasks(column.status).length})
              </ThemedText>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => onAddTask(column.status)}
              >
                <Ionicons name="add" size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.taskList}
              contentContainerStyle={styles.taskListContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredTasks(column.status).map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onPress={() => onTaskPress(task)}
                  onStatusChange={(status) => onStatusChange(task.id, status)}
                />
              ))}
              
              {filteredTasks(column.status).length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons 
                    name={column.status === 'completed' ? 'checkmark-circle' : 'list'}
                    size={40} 
                    color="#E0E0E0" 
                  />
                  <ThemedText style={styles.emptyText}>
                    {column.status === 'completed' 
                      ? 'No hay tareas completadas' 
                      : 'No hay tareas en esta sección'}
                  </ThemedText>
                </View>
              )}
            </ScrollView>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
  },
  selectorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: '#FFF9C4',
  },
  selectorTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectorContent: {
    alignItems: 'center',
  },
  selectorIcon: {
    marginBottom: 4,
  },
  selectorText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectorTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  selectorIndicator: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 3,
  },
  selectorIndicatorActive: {
    backgroundColor: '#8B5CF6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  column: {
    width: COLUMN_WIDTH,
    marginLeft: SPACING,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
  },
  addButton: {
    padding: 4,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingRight: 8,
    paddingBottom: 120, // Extra space at the bottom for the FAB
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 8,
  },
  emptyText: {
    marginTop: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});
