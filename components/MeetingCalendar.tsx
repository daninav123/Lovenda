import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemedText } from './ThemedText';
import 'intl';
import 'intl/locale-data/jsonp/es';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  provider: string;
  type: 'catering' | 'floristeria' | 'fotografia' | 'otro';
}

interface MeetingCalendarProps {
  meetings: Meeting[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  meetings,
  selectedDate,
  onDateSelect,
  onMonthChange,
}) => {
  // Preparar fechas marcadas para el calendario
  const markedDates = React.useMemo(() => {
    const marks: { [key: string]: any } = {};
    
    // Primero marcamos las fechas con reuniones
    meetings.forEach(meeting => {
      const dateStr = format(meeting.date, 'yyyy-MM-dd');
      marks[dateStr] = {
        dots: [{
          key: meeting.id,
          color: getMeetingTypeColor(meeting.type),
          selectedDotColor: '#FFFFFF'
        }],
        selected: isSameDay(meeting.date, selectedDate),
      };
    });

    // Aseguramos que la fecha seleccionada esté marcada
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    if (!marks[selectedDateStr]) {
      marks[selectedDateStr] = {};
    }
    marks[selectedDateStr].selected = true;
    marks[selectedDateStr].selectedColor = '#8B5CF6';

    return marks;
  }, [meetings, selectedDate]);

  // Obtener reuniones para el día seleccionado
  const dailyMeetings = meetings.filter(meeting => 
    isSameDay(meeting.date, selectedDate)
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          current={format(selectedDate, 'yyyy-MM-dd')}
          onDayPress={(day: DateData) => onDateSelect(new Date(day.timestamp))}
          onMonthChange={(month: DateData) => onMonthChange(new Date(month.timestamp))}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={{
            selectedDayBackgroundColor: '#8B5CF6',
            todayTextColor: '#8B5CF6',
            arrowColor: '#8B5CF6',
            monthTextColor: '#5D4037',
            textMonthFontWeight: 'bold',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
          firstDay={1}
        />
      </View>

      <View style={styles.meetingsContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Reuniones para {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
        </ThemedText>
        
        {dailyMeetings.length > 0 ? (
          dailyMeetings.map(meeting => (
            <View key={meeting.id} style={styles.meetingItem}>
              <View style={[styles.meetingDot, { backgroundColor: getMeetingTypeColor(meeting.type) }]} />
              <View style={styles.meetingInfo}>
                <ThemedText style={styles.meetingTitle}>{meeting.title}</ThemedText>
                <ThemedText style={styles.meetingProvider}>{meeting.provider}</ThemedText>
                <ThemedText style={styles.meetingTime}>
                  {format(meeting.date, 'HH:mm')} - {meeting.type}
                </ThemedText>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noMeetingsText}>No hay reuniones programadas</ThemedText>
        )}
      </View>
    </View>
  );
};

// Colores según el tipo de reunión
const getMeetingTypeColor = (type: string) => {
  switch (type) {
    case 'catering': return '#4CAF50';
    case 'floristeria': return '#E91E63';
    case 'fotografia': return '#2196F3';
    default: return '#9C27B0';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendar: {
    marginBottom: 16,
  },
  meetingsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  meetingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
  },
  meetingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  meetingProvider: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 2,
  },
  meetingTime: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  noMeetingsText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});

export default MeetingCalendar;
