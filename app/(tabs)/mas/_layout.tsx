import React from 'react';
import { Slot, Stack } from 'expo-router';

export default function MasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Más' }} />
      <Stack.Screen name="invitados" options={{ title: 'Invitados' }} />
      <Stack.Screen name="protocolo" options={{ title: 'Protocolo' }} />
      <Stack.Screen name="proveedores" options={{ title: 'Proveedores' }} />
      <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
      <Slot />
    </Stack>
  );
}
