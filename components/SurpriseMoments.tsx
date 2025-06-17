import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

type MomentType = 'sorpresa' | 'baile' | 'discurso' | 'brindis' | 'foto' | 'otro';

interface Moment {
  id: string;
  type: MomentType;
  title: string;
  description: string;
  time: string;
  responsible: string;
  notes: string;
}

const MOMENT_TYPES: { id: MomentType; name: string; icon: string; color: string }[] = [
  { id: 'sorpresa', name: 'Sorpresa', icon: 'gift', color: '#E91E63' },
  { id: 'baile', name: 'Baile', icon: 'musical-notes', color: '#9C27B0' },
  { id: 'discurso', name: 'Discurso', icon: 'mic', color: '#3F51B5' },
  { id: 'brindis', name: 'Brindis', icon: 'wine', color: '#2196F3' },
  { id: 'foto', name: 'Sesión de fotos', icon: 'camera', color: '#4CAF50' },
  { id: 'otro', name: 'Otro', icon: 'ellipsis-horizontal', color: '#9E9E9E' },
];

interface SurpriseMomentsProps {
  moments: Moment[];
  onSave: (moment: Omit<Moment, 'id'> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

export default function SurpriseMoments({ moments, onSave, onDelete }: SurpriseMomentsProps) {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddMoment = () => {
    setSelectedMoment(null);
    setShowForm(true);
  };

  const handleEditMoment = (moment: Moment) => {
    setSelectedMoment(moment);
    setShowForm(true);
  };

  const handleSaveMoment = (momentData: Omit<Moment, 'id'>) => {
    onSave(selectedMoment ? { ...selectedMoment, ...momentData } : { ...momentData, id: Date.now().toString() });
    setShowForm(false);
  };

  if (showForm) {
    return (
      <MomentForm
        moment={selectedMoment}
        onSave={handleSaveMoment}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Momentos Especiales</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMoment}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {moments.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="gift" size={48} color="#E0E0E0" />
          <ThemedText style={styles.emptyText}>No hay momentos programados</ThemedText>
          <ThemedText style={styles.emptySubtext}>Añade momentos especiales para hacer tu boda inolvidable</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.momentsList}>
          {moments.map((moment) => (
            <TouchableOpacity 
              key={moment.id} 
              style={styles.momentCard}
              onPress={() => handleEditMoment(moment)}
            >
              <View style={[styles.momentIcon, { backgroundColor: MOMENT_TYPES.find(m => m.id === moment.type)?.color + '20' }]}>
                <Ionicons 
                  name={MOMENT_TYPES.find(m => m.id === moment.type)?.icon as any} 
                  size={24} 
                  color={MOMENT_TYPES.find(m => m.id === moment.type)?.color} 
                />
              </View>
              <View style={styles.momentInfo}>
                <ThemedText style={styles.momentTitle}>{moment.title}</ThemedText>
                <ThemedText style={styles.momentTime}>
                  <Ionicons name="time" size={14} color="#9E9E9E" /> {moment.time}
                </ThemedText>
                {moment.responsible && (
                  <ThemedText style={styles.momentResponsible}>
                    <Ionicons name="person" size={12} color="#9E9E9E" /> {moment.responsible}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(moment.id);
                }}
              >
                <Ionicons name="trash" size={20} color="#F44336" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

interface MomentFormProps {
  moment: Moment | null;
  onSave: (moment: Omit<Moment, 'id'>) => void;
  onCancel: () => void;
}

function MomentForm({ moment, onSave, onCancel }: MomentFormProps) {
  const [type, setType] = useState<MomentType>(moment?.type || 'sorpresa');
  const [title, setTitle] = useState(moment?.title || '');
  const [description, setDescription] = useState(moment?.description || '');
  const [time, setTime] = useState(moment?.time || '');
  const [responsible, setResponsible] = useState(moment?.responsible || '');
  const [notes, setNotes] = useState(moment?.notes || '');

  const handleSave = () => {
    if (!title || !time) return;
    
    onSave({
      type,
      title,
      description,
      time,
      responsible,
      notes,
    });
  };

  return (
    <ScrollView style={styles.formContainer}>
      <ThemedText style={styles.formTitle}>
        {moment ? 'Editar momento' : 'Nuevo momento especial'}
      </ThemedText>

      <ThemedText style={styles.sectionTitle}>Tipo de momento</ThemedText>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeSelector}
      >
        {MOMENT_TYPES.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.typeOption,
              type === t.id && { borderColor: t.color },
            ]}
            onPress={() => setType(t.id)}
          >
            <View style={[styles.typeIcon, { backgroundColor: t.color + '20' }]}>
              <Ionicons name={t.icon as any} size={24} color={t.color} />
            </View>
            <ThemedText 
              style={[
                styles.typeName,
                type === t.id && { color: t.color, fontWeight: '600' }
              ]}
            >
              {t.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ThemedText style={styles.sectionTitle}>Título del momento</ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText style={styles.input}>
          {title || 'Ej: Baile sorpresa con los novios'}
        </ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Hora</ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText style={styles.input}>
          {time || 'Ej: 21:30'}
        </ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Persona responsable</ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText style={styles.input}>
          {responsible || 'Ej: Mejor amigo de la novia'}
        </ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Descripción</ThemedText>
      <View style={[styles.inputContainer, { minHeight: 100 }]}>
        <ThemedText style={styles.input}>
          {description || 'Describe cómo será este momento especial...'}
        </ThemedText>
      </View>

      <ThemedText style={styles.sectionTitle}>Notas adicionales</ThemedText>
      <View style={[styles.inputContainer, { minHeight: 80 }]}>
        <ThemedText style={styles.input}>
          {notes || 'Añade notas importantes para este momento...'}
        </ThemedText>
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onCancel}
        >
          <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton, (!title || !time) && { opacity: 0.5 }]} 
          onPress={handleSave}
          disabled={!title || !time}
        >
          <ThemedText style={styles.saveButtonText}>
            {moment ? 'Guardar cambios' : 'Añadir momento'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5D4037',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
  },
  momentsList: {
    flex: 1,
    padding: 16,
  },
  momentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  momentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  momentInfo: {
    flex: 1,
  },
  momentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333333',
  },
  momentTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  momentResponsible: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  deleteButton: {
    padding: 8,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#5D4037',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#9E9E9E',
  },
  typeSelector: {
    paddingVertical: 8,
  },
  typeOption: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    minWidth: 80,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeName: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  input: {
    fontSize: 14,
    color: '#333333',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
