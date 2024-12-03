import { Stack } from 'expo-router';
import { Colors } from 'react-native-ui-lib';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.white },
        animation: 'slide_from_right',
      }}
    />
  );
}
