import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { StudyProvider } from '@/contexts/StudyContext';

export default function RootLayout() {
  const isReady = useFrameworkReady();

  if (!isReady) {
    return null;
  }

  return (
    <StudyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </StudyProvider>
  );
}