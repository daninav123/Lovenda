import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'todo' | 'inProgress' | 'completed';
type TaskType = 'general' | 'bouquet' | 'surprise';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  type: TaskType;
  assignedTo?: string;
  recipient?: string;
  tableNumber?: string;
  outfitDetails?: string;
  onPress: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

const priorityColors = {
  high: '#FF5252',
  medium: '#FFC107',
  low: '#4CAF50',
};

const statusIcons = {
  todo: 'ellipse-outline',
  inProgress: 'time-outline',
  completed: 'checkmark-circle',
};

const typeIcons = {
  general: 'document-text',
  bouquet: 'flower',
  surprise: 'gift',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  dueDate,
  priority,
  status,
  type,
  assignedTo,
  recipient,
  tableNumber,
  outfitDetails,
  onPress,
  onStatusChange,
}) => {
  const isCompleted = status === 'completed';
  const priorityColor = priorityColors[priority];

  return (
    <TouchableOpacity 
      style={[styles.container, { opacity: isCompleted ? 0.7 : 1 }]}
      onPress={onPress}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText 
            style={[
              styles.title, 
              isCompleted && styles.completedTitle
            ]}
            numberOfLines={1}
          >
            {title}
          </ThemedText>
          
          <View style={styles.typeBadge}>
            <Ionicons 
              name={typeIcons[type]} 
              size={16} 
              color={
                type === 'bouquet' ? '#7B1FA2' : 
                type === 'surprise' ? '#F57C00' : '#1976D2'
              } 
            />
          </View>
        </View>
        
        {description && (
          <ThemedText 
            style={[styles.description, isCompleted && styles.completedText]}
            numberOfLines={2}
          >
            {description}
          </ThemedText>
        )}
        
        {(recipient || tableNumber || outfitDetails) && (
          <View style={styles.detailsContainer}>
            {recipient && (
              <View style={styles.detailRow}>
                <Ionicons name="person" size={14} color="#757575" />
                <ThemedText style={styles.detailText}>{recipient}</ThemedText>
              </View>
            )}
            
            {tableNumber && (
              <View style={styles.detailRow}>
                <Ionicons name="restaurant" size={14} color="#757575" />
                <ThemedText style={styles.detailText}>Mesa {tableNumber}</ThemedText>
              </View>
            )}
            
            {outfitDetails && (
              <View style={styles.detailRow}>
                <Ionicons name="shirt" size={14} color="#757575" />
                <ThemedText style={styles.detailText} numberOfLines={1}>{outfitDetails}</ThemedText>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={14} color="#757575" />
            <ThemedText style={styles.dateText}>
              {new Date(dueDate).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
              })}
            </ThemedText>
          </View>
          
          {assignedTo && (
            <View style={styles.assignedTo}>
              <ThemedText style={styles.assignedToText} numberOfLines={1}>
                {assignedTo}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.statusButton}
        onPress={() => {
          const newStatus = status === 'completed' ? 'todo' : 'completed';
          onStatusChange(newStatus);
        }}
      >
        <Ionicons 
          name={statusIcons[status]} 
          size={24} 
          color={isCompleted ? '#4CAF50' : '#9E9E9E'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  typeBadge: {
    backgroundColor: '#F5F5F5',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  completedText: {
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },
  detailsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#616161',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  assignedTo: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '50%',
  },
  assignedToText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  statusButton: {
    padding: 4,
    marginLeft: 8,
  },
});
