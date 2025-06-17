import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type Priority = 'low' | 'medium' | 'high';
type TaskType = 'general' | 'bouquet' | 'surprise';
type TaskStatus = 'todo' | 'inProgress' | 'completed';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string;
  type: TaskType;
  recipient?: string;
  onPress?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high': return '#F44336';
    case 'medium': return '#FFC107';
    case 'low': return '#4CAF50';
    default: return '#9E9E9E';
  }
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'completed': return 'checkmark-circle';
    case 'inProgress': return 'time';
    case 'todo': return 'ellipse-outline';
    default: return 'ellipse-outline';
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed': return '#4CAF50';
    case 'inProgress': return '#2196F3';
    case 'todo': return '#9E9E9E';
    default: return '#9E9E9E';
  }
};

const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
  switch (currentStatus) {
    case 'todo': return 'inProgress';
    case 'inProgress': return 'completed';
    case 'completed': return 'todo';
    default: return 'todo';
  }
};

const getTypeIcon = (type: TaskType) => {
  switch (type) {
    case 'bouquet': return 'flower';
    case 'surprise': return 'gift';
    default: return 'document-text';
  }
};

export default function TaskCard({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  assignedTo,
  type,
  recipient,
  onPress,
  onStatusChange,
}: TaskCardProps) {
  const priorityColor = getPriorityColor(priority);
  const statusColor = getStatusColor(status);
  const typeIcon = getTypeIcon(type);
  
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const isOverdue = status !== 'completed' && dueDateObj < new Date();
  
  const formattedDate = format(dueDateObj, "d 'de' MMMM 'a las' HH:mm", { locale: es });
  const timeAgo = formatDistanceToNow(dueDateObj, { 
    addSuffix: true, 
    locale: es 
  });

  const handleStatusPress = () => {
    if (onStatusChange) {
      onStatusChange(getNextStatus(status));
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { 
          borderLeftWidth: 4,
          borderLeftColor: priorityColor,
          opacity: status === 'completed' ? 0.7 : 1
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons 
              name={typeIcon} 
              size={16} 
              color="#8B5CF6" 
              style={styles.typeIcon} 
            />
            <ThemedText 
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </ThemedText>
          </View>
          
          <TouchableOpacity 
            onPress={handleStatusPress}
            style={styles.statusButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={getStatusIcon(status)}
              size={24}
              color={statusColor}
            />
          </TouchableOpacity>
        </View>
        
        {description ? (
          <ThemedText 
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </ThemedText>
        ) : null}
        
        {(type === 'bouquet' || type === 'surprise') && recipient && (
          <View style={styles.specialInfo}>
            <Ionicons 
              name={type === 'bouquet' ? 'person' : 'gift'}
              size={14} 
              color="#8B5CF6" 
            />
            <ThemedText style={styles.specialInfoText}>
              {type === 'bouquet' ? 'Para: ' : 'Sorpresa para: '}
              <ThemedText style={styles.recipientText}>{recipient}</ThemedText>
            </ThemedText>
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={[styles.priorityBadge, { backgroundColor: `${priorityColor}33` }]}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <ThemedText style={[styles.priorityText, { color: priorityColor }]}>
                {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
              </ThemedText>
            </View>
            
            <View style={styles.assignedTo}>
              <Ionicons name="person" size={14} color="#8B5CF6" />
              <ThemedText style={styles.assignedToText} numberOfLines={1}>
                {assignedTo}
              </ThemedText>
            </View>
          </View>
          
          <ThemedText 
            style={[
              styles.timeText,
              isOverdue && styles.overdueText,
              status === 'completed' && styles.completedText
            ]}
          >
            {isOverdue ? 'Atrasada' : timeAgo}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  typeIcon: {
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  statusButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 12,
    lineHeight: 20,
  },
  specialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  specialInfoText: {
    fontSize: 13,
    color: '#5D4037',
    marginLeft: 6,
  },
  recipientText: {
    fontWeight: '600',
    color: '#8B5CF6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  assignedTo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  assignedToText: {
    fontSize: 12,
    color: '#5D4037',
    marginLeft: 4,
    maxWidth: 80,
  },
  timeText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  overdueText: {
    color: '#F44336',
    fontWeight: '600',
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
