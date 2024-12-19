import React, { useState } from 'react';
import { StyleSheet, Dimensions, ImageBackground, Alert } from 'react-native';
import { View, Text, TextField, Button, Colors, Card } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

// API URL'ini tanımlayalım
const API_URL = 'http:localhost/api'; // Backend URL'inizi buraya yazın

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      // Backend'den gelen token'ı saklayalım
      const { token, user } = response.data;
      
      // Token'ı AsyncStorage'a kaydedebilirsiniz
      // await AsyncStorage.setItem('userToken', token);
      
      // Kullanıcı rolüne göre yönlendirme yapalım
      if (user.role === 'admin') {
        router.push('/admin-panel');
      } else {
        router.push('/home');
      }

    } catch (error) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61802.jpg',
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Card style={styles.card} enableShadow>
          <View style={styles.header}>
            <AntDesign name="medicinebox" size={50} color={Colors.primary} />
            <Text text40BO color={Colors.primary} style={styles.title}>
              İmmünoglobulin
            </Text>
            <Text text40BO color={Colors.primary} style={styles.title}>
              Takip Sistemi
            </Text>
            <Text text65 color={Colors.grey30}>
              Hesabınıza giriş yapın
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              text70
              placeholder="Kullanıcı Adı"
              floatingPlaceholder
              containerStyle={styles.input}
              value={username}
              onChangeText={setUsername}
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="user" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <TextField
              text70
              placeholder="Şifre"
              floatingPlaceholder
              containerStyle={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="lock" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <Button
              label={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              size={Button.sizes.large}
              backgroundColor={Colors.primary}
              style={styles.loginButton}
              onPress={handleLogin}
              borderRadius={10}
              enableShadow
              disabled={loading}
            />

            <Button
              label="Hesabınız yok mu? Kayıt olun"
              link
              color={Colors.primary}
              style={styles.registerButton}
              onPress={() => router.push('/register')}
            />
          </View>
        </Card>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width > 500 ? 500 : '100%',
    padding: 30,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 10,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: Colors.grey50,
    paddingBottom: 8,
  },
  loginButton: {
    height: 50,
    marginTop: 20,
  },
  registerButton: {
    marginTop: 20,
  },
});
