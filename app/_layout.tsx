import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Colors } from 'react-native-ui-lib';
import Toast from 'react-native-toast-message';
import { observer } from 'mobx-react';
import { appStore } from '../store/appStore';

const RootLayout = observer(() => {
  const router = useRouter();
  
  useEffect(() => {
    const initializeApp = async () => {
      await appStore.getTokenAndUserInfo();
      appStore.checkToken(router);
    };

    initializeApp();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.white },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
});

export default RootLayout;
