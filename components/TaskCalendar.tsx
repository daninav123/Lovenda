import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  dueDate: string | Date; // Accept both string and Date
  priority: Priority;
}

interface TaskCalendarProps {
  tasks: Task[];
  selectedDate: string;
  onDayPress: (date: string) => void;
}

export default function TaskCalendar({ tasks, selectedDate, onDayPress }: TaskCalendarProps) {
  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: { count: number; priority: Priority } } = {};
    
    tasks.forEach(task => {
      let dateStr: string;
      if (task.dueDate instanceof Date) {
        dateStr = task.dueDate.toISOString().split('T')[0];
      } else {
        // Handle string date (assuming ISO format)
        dateStr = task.dueDate.split('T')[0];
      }
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = { count: 0, priority: task.priority };
      }
      grouped[dateStr].count++;
      // Keep the highest priority
      if (task.priority === 'high') {
        grouped[dateStr].priority = 'high';
      } else if (task.priority === 'medium' && grouped[dateStr].priority !== 'high') {
        grouped[dateStr].priority = 'medium';
      }
    });
    
    return grouped;
  }, [tasks]);

  // Generate marked dates for the calendar
  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Mark all dates with tasks
    Object.entries(tasksByDate).forEach(([date, { count, priority }]) => {
      const isSelected = date === selectedDate;
      const isTodayDate = date === today;
      
      marks[date] = {
        marked: true,
        dotColor: getPriorityColor(priority),
        selected: isSelected,
        selectedColor: isTodayDate ? '#8B5CF6' : undefined,
        selectedTextColor: isTodayDate ? '#FFFFFF' : undefined,
        customStyles: {
          container: {
            backgroundColor: isSelected ? '#F3E8FF' : 'transparent',
            borderRadius: 16,
          },
          text: {
            color: isSelected ? '#8B5CF6' : isTodayDate ? '#8B5CF6' : '#5D4037',
            fontWeight: isSelected || isTodayDate ? 'bold' : 'normal',
          },
        },
      };
    });
    
    // Mark the selected date if it doesn't have tasks
    if (!marks[selectedDate]) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: '#F3E8FF',
        customStyles: {
          container: {
            backgroundColor: '#F3E8FF',
            borderRadius: 16,
          },
          text: {
            color: '#8B5CF6',
            fontWeight: 'bold',
          },
        },
      };
    }
    
    // Mark today if it's not already marked
    if (!marks[today]) {
      marks[today] = {
        customStyles: {
          text: {
            color: '#8B5CF6',
            fontWeight: 'bold',
          },
        },
      };
    }
    
    return marks;
  }, [tasksByDate, selectedDate]);

  const handleDayPress = (day: DateData) => {
    onDayPress(day.dateString);
  };

  // Custom day component to handle styling
  const renderDay = (date: DateData) => {
    const dateStr = date.dateString;
    const isSelected = dateStr === selectedDate;
    const dayTasks = tasksByDate[dateStr];
    const isCurrentDay = dateStr === format(new Date(), 'yyyy-MM-dd');
    
    return (
      <View style={styles.dayContainer}>
        <View 
          style={[
            styles.dayContent,
            isSelected && styles.selectedDay,
            isCurrentDay && !isSelected && styles.currentDay,
          ]}
        >
          <ThemedText 
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isCurrentDay && !isSelected && styles.currentDayText,
            ]}
          >
            {date.day}
          </ThemedText>
          {dayTasks && (
            <View 
              style={[
                styles.dot,
                { backgroundColor: getPriorityColor(dayTasks.priority) }
              ]} 
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        renderArrow={(direction) => (
          <Ionicons 
            name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
            size={20} 
            color="#8B5CF6" 
          />
        )}
        dayComponent={({ date, state }) => {
          if (!date) return null;
          // Create a new object with only the properties we need
          const dayProps = {
            dateString: date.dateString,
            day: date.day,
            month: date.month,
            year: date.year,
            timestamp: Date.parse(date.dateString)
          };
          return renderDay(dayProps);
        }}
        theme={{
          // Standard theme properties
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#5D4037',
          selectedDayBackgroundColor: 'transparent',
          selectedDayTextColor: '#8B5CF6',
          todayTextColor: '#8B5CF6',
          dayTextColor: '#5D4037',
          textDisabledColor: '#E0E0E0',
          dotColor: '#8B5CF6',
          selectedDotColor: '#8B5CF6',
          arrowColor: '#8B5CF6',
          monthTextColor: '#5D4037',
          textMonthFontWeight: '600',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
          textDayFontWeight: '500',
          textDayHeaderFontWeight: '600',
          // @ts-ignore - Custom styles that aren't in the type definition
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
            },
            monthText: {
              fontSize: 16,
              fontWeight: '600',
              color: '#5D4037',
              textTransform: 'capitalize',
            },
          },
        }}
        style={styles.calendar}
        hideExtraDays
        firstDay={1} // Start week on Monday
        enableSwipeMonths
      />
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
          <ThemedText style={styles.legendText}>Alta prioridad</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
          <ThemedText style={styles.legendText}>Media prioridad</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <ThemedText style={styles.legendText}>Baja prioridad</ThemedText>
        </View>
      </View>
    </View>
  );
}

// Helper function to get color based on priority
function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'high': return '#F44336';
    case 'medium': return '#FFC107';
    case 'low': return '#4CAF50';
    default: return '#9E9E9E';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calendar: {
    marginBottom: 12,
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 36,
  },
  dayContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#8B5CF6',
  },
  currentDay: {
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  dayText: {
    fontSize: 14,
    color: '#5D4037',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentDayText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#9E9E9E',
  },
});
