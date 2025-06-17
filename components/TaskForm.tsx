import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  recipient?: string;
  tableNumber?: string;
  outfitDetails?: string;
  notes?: string;
}

interface TaskFormProps {
  task?: Task;
  onSave: (task: Omit<Task, 'id'>) => void;
  onDelete?: () => void;
  onCancel: () => void;
  teamMembers?: string[];
}

const priorityOptions = [
  { value: 'low' as const, label: 'Baja', icon: 'arrow-down', color: '#4CAF50' },
  { value: 'medium' as const, label: 'Media', icon: 'remove', color: '#FFC107' },
  { value: 'high' as const, label: 'Alta', icon: 'alert', color: '#F44336' },
];

const taskTypeOptions = [
  { value: 'general' as const, label: 'General', icon: 'document-text' },
  { value: 'bouquet' as const, label: 'Ramo', icon: 'flower' },
  { value: 'surprise' as const, label: 'Sorpresa', icon: 'gift' },
];

const teamMembers = [
  'Yo', 'Novio', 'Novia', 'Madrina', 'Padrino', 'Ayudante 1', 'Ayudante 2'
];

export default function TaskForm({ 
  task, 
  onSave, 
  onDelete, 
  onCancel,
  teamMembers: customTeamMembers = teamMembers 
}: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, 'id'>>(() => ({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || new Date(),
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
    assignedTo: task?.assignedTo || 'Yo',
    type: task?.type || 'general',
    recipient: task?.recipient || '',
    tableNumber: task?.tableNumber || '',
    outfitDetails: task?.outfitDetails || '',
    notes: task?.notes || '',
  }));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({ ...formData, dueDate: currentDate });
  };

  const renderDateTimeInput = () => {
    const date = formData.dueDate;
    const formattedDate = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const formattedTime = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Fecha y hora</ThemedText>
        <View style={styles.datetimeContainer}>
          <TouchableOpacity 
            style={styles.datetimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={18} color="#5D4037" />
            <ThemedText style={styles.datetimeText}>{formattedDate}</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.datetimeButton, { marginLeft: 8 }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time" size={18} color="#5D4037" />
            <ThemedText style={styles.datetimeText}>{formattedTime}</ThemedText>
          </TouchableOpacity>
        </View>
        
        {(showDatePicker || showTimePicker) && (
          <DateTimePicker
            value={date}
            mode={showDatePicker ? 'date' : 'time'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={showDatePicker ? handleDateChange : handleTimeChange}
            locale="es-ES"
            minimumDate={new Date()}
            style={styles.picker}
          />
        )}
      </View>
    );
  };

  const renderSpecialFields = () => {
    if (formData.type === 'bouquet' || formData.type === 'surprise') {
      return (
        <View style={styles.specialSection}>
          <ThemedText style={styles.sectionTitle}>
            {formData.type === 'bouquet' ? 'Detalles del Ramo' : 'Detalles de la Sorpresa'}
          </ThemedText>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Destinatario</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.recipient}
              onChangeText={(text) => setFormData({ ...formData, recipient: text })}
              placeholder="¿Para quién es el ramo?"
              placeholderTextColor="#9E9E9E"
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Mesa</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.tableNumber}
              onChangeText={(text) => setFormData({ ...formData, tableNumber: text })}
              placeholder="Número de mesa"
              placeholderTextColor="#9E9E9E"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>
              {formData.type === 'bouquet' ? 'Detalles del atuendo' : 'Instrucciones especiales'}
            </ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.type === 'bouquet' ? formData.outfitDetails : formData.notes}
              onChangeText={(text) => 
                formData.type === 'bouquet'
                  ? setFormData({ ...formData, outfitDetails: text })
                  : setFormData({ ...formData, notes: text })
              }
              placeholder={
                formData.type === 'bouquet'
                  ? 'Color del vestido, detalles, etc.'
                  : 'Instrucciones especiales para la sorpresa'
              }
              placeholderTextColor="#9E9E9E"
              multiline
              numberOfLines={3}
            />
          </View>
          
          {formData.type === 'surprise' && (
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Notas adicionales</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Cualquier detalle adicional..."
                placeholderTextColor="#9E9E9E"
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </View>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Título *</ThemedText>
          <TextInput
            style={[styles.input, styles.titleInput]}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Título de la tarea"
            placeholderTextColor="#9E9E9E"
            autoFocus
          />
        </View>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Descripción</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Descripción detallada..."
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={3}
          />
        </View>
        
        {renderDateTimeInput()}
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Prioridad</ThemedText>
          <View style={styles.radioGroup}>
            {priorityOptions.map(({ value, label, icon, color }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.radioButton,
                  formData.priority === value && { 
                    borderColor: color,
                    backgroundColor: `${color}22`
                  }
                ]}
                onPress={() => setFormData({ ...formData, priority: value })}
              >
                <Ionicons 
                  name={icon as any} 
                  size={20} 
                  color={formData.priority === value ? color : '#9E9E9E'} 
                />
                <ThemedText 
                  style={[
                    styles.radioLabel,
                    { color: formData.priority === value ? '#5D4037' : '#9E9E9E' }
                  ]}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Asignar a</ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.teamScroll}
            contentContainerStyle={styles.teamContainer}
          >
            {customTeamMembers.map((member) => (
              <TouchableOpacity
                key={member}
                style={[
                  styles.teamMember,
                  formData.assignedTo === member && styles.teamMemberSelected
                ]}
                onPress={() => setFormData({ ...formData, assignedTo: member })}
              >
                <ThemedText 
                  style={[
                    styles.teamMemberText,
                    formData.assignedTo === member && styles.teamMemberTextSelected
                  ]}
                >
                  {member}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Tipo de tarea</ThemedText>
          <View style={styles.typeButtons}>
            {taskTypeOptions.map(({ value, icon, label }) => {
              const isSelected = formData.type === value;
              const color = isSelected ? '#8B5CF6' : '#E0E0E0';
              
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.typeButton,
                    isSelected && { 
                      backgroundColor: color,
                      borderColor: color
                    }
                  ]}
                  onPress={() => setFormData({ ...formData, type: value })}
                >
                  <Ionicons 
                    name={icon as any} 
                    size={20} 
                    color={isSelected ? '#FFFFFF' : '#5D4037'} 
                  />
                  <ThemedText 
                    style={[
                      styles.typeButtonText,
                      isSelected && styles.typeButtonTextSelected
                    ]}
                  >
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {renderSpecialFields()}
        
        <View style={styles.buttonContainer}>
          {onDelete && (
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]}
              onPress={onDelete}
            >
              <Ionicons name="trash" size={20} color="#FFFFFF" />
              <ThemedText style={styles.deleteButtonText}>Eliminar</ThemedText>
            </TouchableOpacity>
          )}
          
          <View style={styles.rightButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, !formData.title && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={!formData.title}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <ThemedText style={styles.saveButtonText}>
                {task ? 'Actualizar' : 'Guardar'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  datetimeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  datetimeText: {
    marginLeft: 8,
    color: '#212121',
  },
  picker: {
    backgroundColor: '#FFFFFF',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  radioLabel: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  teamScroll: {
    marginHorizontal: -4,
  },
  teamContainer: {
    paddingHorizontal: 4,
  },
  teamMember: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  teamMemberSelected: {
    backgroundColor: '#EDE7F6',
    borderColor: '#8B5CF6',
  },
  teamMemberText: {
    color: '#5D4037',
    fontSize: 14,
  },
  teamMemberTextSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  typeButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#5D4037',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  specialSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  rightButtons: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#5D4037',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
});
