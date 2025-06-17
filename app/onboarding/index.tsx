import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  key: string;
  text: string;
}

const QUESTIONS: Question[] = [
  { key: 'partner1', text: '¿Nombre de la pareja 1?' },
  { key: 'partner2', text: '¿Nombre de la pareja 2?' },
  { key: 'date', text: '¿Fecha de la boda? (YYYY-MM-DD)' },
  { key: 'location', text: '¿Ubicación del evento?' },
  { key: 'palette', text: '¿Paleta de colores preferida?' },
  { key: 'typography', text: '¿Tipografía preferida?' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateWedding } = useAuth();
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: QUESTIONS[0].text },
  ]);
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: input }];
    const key = QUESTIONS[step].key;
    const newResponses = { ...responses, [key]: input.trim() };
    if (step + 1 < QUESTIONS.length) {
      newMessages.push({ sender: 'ai', text: QUESTIONS[step + 1].text });
      setMessages(newMessages);
      setResponses(newResponses);
      setStep(step + 1);
      setInput('');
    } else {
      setMessages(newMessages);
      setResponses(newResponses);
      const weddingData = {
        id: Date.now().toString(),
        partner1: newResponses.partner1 || '',
        partner2: newResponses.partner2 || '',
        date: new Date(newResponses.date || Date.now()),
        location: newResponses.location || '',
        budget: 0,
        theme: {
          primaryColor: '#FFB6C1',
          secondaryColor: '#B3E5FC',
          fontFamily: newResponses.typography || 'Poppins',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      updateWedding(weddingData).then(() => {
        router.replace('/(tabs)');
      });
    }
  };

  const skipOnboarding = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
        <ThemedText>Omitir</ThemedText>
      </TouchableOpacity>
      <ScrollView style={styles.chat} contentContainerStyle={{ padding: 16 }}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === 'ai' ? styles.aiBubble : styles.userBubble,
            ]}
          >
            <ThemedText>{msg.text}</ThemedText>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe tu respuesta"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <ThemedText style={{ color: 'white' }}>Enviar</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9C4' },
  chat: { flex: 1 },
  message: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    maxWidth: '80%',
  },
  aiBubble: { backgroundColor: '#E1BEE7', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#D1C4E9', alignSelf: 'flex-end' },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#7E57C2',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  skipButton: {
    position: 'absolute',
    right: 16,
    top: 40,
    zIndex: 1,
  },
});
