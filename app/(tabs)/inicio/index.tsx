import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

// Componente de tarjeta de resumen
function SummaryCard({ title, value, icon, color, onPress }: {
  title: string;
  value: string | number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: color + '20' }]} 
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '40' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.cardText}>
          <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          <ThemedText style={styles.cardValue}>{value}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Componente de acceso rápido
function QuickAccess({ title, icon, onPress }: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAccessItem} onPress={onPress}>
      <View style={styles.quickAccessIcon}>
        <Ionicons name={icon} size={24} color="#7E57C2" />
      </View>
      <ThemedText style={styles.quickAccessText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

export default function InicioScreen() {
  const router = useRouter();
  const { user, wedding } = useAuth();
  
  // Datos de ejemplo (en una app real, estos vendrían de tu estado o API)
  const stats = {
    pendingTasks: 5,
    confirmedGuests: 42,
    budgetUsed: 65, // porcentaje
    daysLeft: wedding ? Math.ceil((new Date(wedding.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
  };

  const quickActions = [
    { title: 'Añadir Tarea', icon: 'add-circle-outline', screen: '/(tabs)/tareas/new' },
    { title: 'Invitados', icon: 'people-outline', screen: '/(tabs)/mas/invitados' },
    { title: 'Presupuesto', icon: 'cash-outline', screen: '/(tabs)/finanzas' },
    { title: 'Proveedores', icon: 'business-outline', screen: '/(tabs)/mas/proveedores' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Encabezado */}
        <View style={styles.header}>
          <ThemedText type="title">¡Hola, {user?.firstName}!</ThemedText>
          <ThemedText style={styles.subtitle}>
            {wedding 
              ? `Faltan ${stats.daysLeft} días para tu boda`
              : 'Completa la configuración de tu boda'}
          </ThemedText>
        </View>

        {/* Tarjetas de resumen */}
        <View style={styles.statsRow}>
          <View style={styles.column}>
            <SummaryCard 
              title="Tareas Pendientes" 
              value={stats.pendingTasks} 
              icon="checkmark-done" 
              color="#FF6B6B"
              onPress={() => router.push('/(tabs)/tareas')}
            />
            <SummaryCard 
              title="Invitados Confirmados" 
              value={`${stats.confirmedGuests}%`} 
              icon="people" 
              color="#4ECDC4"
              onPress={() => router.push('/(tabs)/mas/invitados')}
            />
          </View>
          <View style={styles.column}>
            <SummaryCard 
              title="Presupuesto" 
              value={`${stats.budgetUsed}%`} 
              icon="cash" 
              color="#FFD166"
              onPress={() => router.push('/(tabs)/finanzas')}
            />
            <SummaryCard 
              title="Días Restantes" 
              value={stats.daysLeft} 
              icon="calendar" 
              color="#7E57C2"
              onPress={() => router.push('/(tabs)/mas/protocolo')}
            />
          </View>
        </View>

        {/* Accesos rápidos */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Accesos Rápidos</ThemedText>
        <View style={styles.quickAccessContainer}>
          {quickActions.map((action, index) => (
            <QuickAccess
              key={index}
              title={action.title}
              icon={action.icon as any}
              onPress={() => router.push(action.screen as any)}
            />
          ))}
        </View>

        {/* Próximas tareas */}
        <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>
          Próximas Tareas
        </ThemedText>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => router.push('/(tabs)/tareas')}
        >
          <ThemedText style={styles.seeAllText}>Ver todas</ThemedText>
          <Ionicons name="chevron-forward" size={16} color="#7E57C2" />
        </TouchableOpacity>
        
        {/* Aquí iría la lista de próximas tareas */}
        <View style={styles.upcomingTasks}>
          <ThemedText style={styles.noTasksText}>No hay tareas próximas</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAccessItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  quickAccessIcon: {
    marginRight: 8,
  },
  quickAccessText: {
    flex: 1,
    fontSize: 14,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  seeAllText: {
    color: '#7E57C2',
    marginRight: 4,
  },
  upcomingTasks: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    opacity: 0.6,
  },
});
