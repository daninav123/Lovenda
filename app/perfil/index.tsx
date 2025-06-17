import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No hay usuario autenticado</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText type="title" style={styles.name}>
          {user.firstName} {user.lastName}
        </ThemedText>
        <ThemedText style={styles.email}>{user.email}</ThemedText>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <ThemedText>Editar perfil</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <ThemedText>Configuración</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutButton]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <ThemedText style={styles.logoutText}>
            {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1C4E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5D4037',
  },
  email: {
    color: '#8D6E63',
    fontSize: 16,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FFCDD2',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
  },
  logoutText: {
    color: '#C62828',
    fontWeight: '600',
  },
});
