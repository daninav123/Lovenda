import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { ThemedText } from '../ThemedText';

type TaskPriority = 'low' | 'medium' | 'high';

interface TaskCalendarProps {
  selectedDate: string;
  tasks: Array<{
    dueDate: string;
    priority: TaskPriority;
    status: 'todo' | 'inProgress' | 'completed';
  }>;
  onDayPress: (date: DateData) => void;
}

const priorityColors = {
  high: '#FF5252',
  medium: '#FFC107',
  low: '#4CAF50',
};

export const TaskCalendar: React.FC<TaskCalendarProps> = ({
  selectedDate,
  tasks,
  onDayPress,
}) => {
  // Create marked dates object for the calendar
  const markedDates: { [date: string]: any } = {};
  
  tasks.forEach(task => {
    const date = task.dueDate.split('T')[0];
    if (!markedDates[date]) {
      markedDates[date] = {
        dots: [],
        selected: date === selectedDate,
        selectedColor: '#8B5CF6',
      };
    }
    
    markedDates[date].dots.push({
      key: task.priority,
      color: priorityColors[task.priority],
      selectedDotColor: '#FFFFFF',
    });
    
    // Add custom styles for today
    const today = new Date().toISOString().split('T')[0];
    if (date === today) {
      markedDates[date].marked = true;
      markedDates[date].dotColor = '#FF5252';
      markedDates[date].selectedColor = '#8B5CF6';
    }
  });

  // Ensure selected date is marked
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#8B5CF6',
      dots: [],
    };
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#FFF9C4',
          calendarBackground: '#FFF9C4',
          textSectionTitleColor: '#5D4037',
          selectedDayBackgroundColor: '#8B5CF6',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#FF5252',
          dayTextColor: '#5D4037',
          textDisabledColor: '#BCAAA4',
          dotStyle: {
            width: 4,
            height: 4,
            marginTop: 1,
            marginHorizontal: 1.5,
            borderRadius: 2,
            opacity: 0.9,
          },
          arrowColor: '#8B5CF6',
          monthTextColor: '#5D4037',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        renderHeader={(date) => {
          const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ];
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear();
          return (
            <View style={styles.header}>
              <ThemedText style={styles.headerText}>
                {`${month} ${year}`.toUpperCase()}
              </ThemedText>
            </View>
          );
        }}
        dayComponent={({ date, state }) => {
          const dateStr = date?.dateString || '';
          const isSelected = dateStr === selectedDate;
          const hasTasks = markedDates[dateStr]?.dots?.length > 0;
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          
          return (
            <View style={styles.dayContainer}>
              <View 
                style={[
                  styles.day,
                  isSelected && styles.selectedDay,
                  isToday && !isSelected && styles.todayDay,
                ]}
              >
                <ThemedText 
                  style={[
                    styles.dayText,
                    state === 'disabled' && styles.disabledText,
                    isSelected && styles.selectedText,
                    isToday && styles.todayText,
                  ]}
                >
                  {date?.day}
                </ThemedText>
                {hasTasks && (
                  <View style={styles.dotsContainer}>
                    {markedDates[dateStr].dots.map((dot: any, index: number) => (
                      <View 
                        key={index} 
                        style={[styles.dot, { backgroundColor: dot.color }]} 
                      />
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF5252' }]} />
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9C4',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    letterSpacing: 0.5,
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#8B5CF6',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  dayText: {
    fontSize: 14,
    color: '#5D4037',
  },
  disabledText: {
    color: '#BCAAA4',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  todayText: {
    color: '#FF5252',
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    color: '#5D4037',
  },
});
