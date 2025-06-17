import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';

const MENU_ITEMS = [
  { id: 'profile', title: 'Perfil', icon: '👤' },
  { id: 'settings', title: 'Configuración', icon: '⚙️' },
  { id: 'help', title: 'Ayuda', icon: '❓' },
  { id: 'about', title: 'Acerca de', icon: 'ℹ️' },
];

export default function MasScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handlePress = (itemId: string) => {
    if (itemId === 'profile') {
      router.push('/perfil');
    } else if (itemId === 'logout') {
      logout();
      router.replace('/(auth)/login');
    }
    // Add more navigation handlers as needed
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.profileSection}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </ThemedText>
        </View>
        <ThemedText type="title" style={styles.userName}>
          {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
        </ThemedText>
        <ThemedText style={styles.userEmail}>
          {user?.email || ''}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handlePress(item.id)}
          >
            <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
            <ThemedText style={styles.menuText}>{item.title}</ThemedText>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutButton]}
          onPress={() => handlePress('logout')}
        >
          <ThemedText style={[styles.menuIcon, styles.logoutIcon]}>🚪</ThemedText>
          <ThemedText style={[styles.menuText, styles.logoutText]}>Cerrar sesión</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D1C4E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5D4037',
  },
  userEmail: {
    color: '#8D6E63',
    fontSize: 14,
  },
  menuContainer: {
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 15,
    width: 30,
  },
  menuText: {
    fontSize: 16,
    color: '#5D4037',
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    marginTop: 10,
  },
  logoutIcon: {
    color: '#C62828',
  },
  logoutText: {
    color: '#C62828',
    fontWeight: '600',
  },
});
