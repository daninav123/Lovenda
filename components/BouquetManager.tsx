import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

type FlowerType = 'rosas' | 'tulipanes' | 'lirios' | 'peonias' | 'girasoles' | 'orquideas';

interface FlowerOption {
  id: FlowerType;
  name: string;
  color: string;
  icon: string;
}

const FLOWER_OPTIONS: FlowerOption[] = [
  { id: 'rosas', name: 'Rosas', color: '#FF4081', icon: 'flower' },
  { id: 'tulipanes', name: 'Tulipanes', color: '#9C27B0', icon: 'flower' },
  { id: 'lirios', name: 'Lirios', color: '#3F51B5', icon: 'flower' },
  { id: 'peonias', name: 'Peonías', color: '#E91E63', icon: 'flower' },
  { id: 'girasoles', name: 'Girasoles', color: '#FFC107', icon: 'sunny' },
  { id: 'orquideas', name: 'Orquídeas', color: '#4CAF50', icon: 'flower' },
];

interface BouquetManagerProps {
  onSave: (bouquet: {
    flowers: FlowerType[];
    style: 'ramo' | 'centro' | 'ramillete';
    colors: string[];
    notes: string;
  }) => void;
  initialData?: {
    flowers: FlowerType[];
    style: 'ramo' | 'centro' | 'ramillete';
    colors: string[];
    notes: string;
  };
}

export default function BouquetManager({ onSave, initialData }: BouquetManagerProps) {
  const [selectedFlowers, setSelectedFlowers] = useState<FlowerType[]>(initialData?.flowers || []);
  const [bouquetStyle, setBouquetStyle] = useState<'ramo' | 'centro' | 'ramillete'>(initialData?.style || 'ramo');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [colors, setColors] = useState<string[]>(initialData?.colors || []);

  const toggleFlower = (flowerId: FlowerType) => {
    setSelectedFlowers(prev => 
      prev.includes(flowerId)
        ? prev.filter(id => id !== flowerId)
        : [...prev, flowerId]
    );
  };

  const addColor = () => {
    if (selectedColor && !colors.includes(selectedColor)) {
      setColors(prev => [...prev, selectedColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    setColors(prev => prev.filter(color => color !== colorToRemove));
  };

  const handleSave = () => {
    onSave({
      flowers: selectedFlowers,
      style: bouquetStyle,
      colors,
      notes
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Flores seleccionadas</ThemedText>
      <View style={styles.flowerGrid}>
        {FLOWER_OPTIONS.map(flower => (
          <TouchableOpacity
            key={flower.id}
            style={[
              styles.flowerOption,
              selectedFlowers.includes(flower.id) && styles.flowerSelected
            ]}
            onPress={() => toggleFlower(flower.id)}
          >
            <Ionicons 
              name={flower.icon as any} 
              size={24} 
              color={selectedFlowers.includes(flower.id) ? flower.color : '#CCCCCC'} 
            />
            <ThemedText style={styles.flowerName}>{flower.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText style={styles.sectionTitle}>Estilo del ramo</ThemedText>
      <View style={styles.styleOptions}>
        {['ramo', 'centro', 'ramillete'].map((style) => (
          <TouchableOpacity
            key={style}
            style={[
              styles.styleOption,
              bouquetStyle === style && styles.styleSelected
            ]}
            onPress={() => setBouquetStyle(style as any)}
          >
            <Ionicons 
              name={style === 'ramo' ? 'flower' : style === 'centro' ? 'home' : 'apps'}
              size={24} 
              color={bouquetStyle === style ? '#8B5CF6' : '#666666'} 
            />
            <ThemedText 
              style={[
                styles.styleText,
                bouquetStyle === style && styles.styleTextSelected
              ]}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText style={styles.sectionTitle}>Colores</ThemedText>
      <View style={styles.colorsContainer}>
        {colors.map((color, index) => (
          <View key={index} style={[styles.colorBadge, { backgroundColor: color }]}>
            <ThemedText style={styles.colorHex}>{color.toUpperCase()}</ThemedText>
            <TouchableOpacity 
              style={styles.removeColorButton}
              onPress={() => removeColor(color)}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.addColorButton}
          onPress={() => setShowColorPicker(true)}
        >
          <Ionicons name="add" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.sectionTitle}>Notas adicionales</ThemedText>
      <View style={styles.notesContainer}>
        <Ionicons name="pencil" size={20} color="#9E9E9E" style={styles.notesIcon} />
        <ThemedText 
          style={styles.notesInput}
          onPress={() => {}}
        >
          {notes || 'Añade notas sobre el ramo...'}
        </ThemedText>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <ThemedText style={styles.saveButtonText}>Guardar cambios</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#5D4037',
  },
  flowerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  flowerOption: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  flowerSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  flowerName: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  styleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  styleOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    width: '30%',
  },
  styleSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  styleText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
  },
  styleTextSelected: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  colorHex: {
    color: '#FFFFFF',
    fontSize: 12,
    marginRight: 4,
  },
  removeColorButton: {
    marginLeft: 4,
  },
  addColorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 24,
  },
  notesIcon: {
    marginRight: 8,
  },
  notesInput: {
    flex: 1,
    color: '#9E9E9E',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
