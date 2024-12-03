import React, { useState } from 'react';
import { StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { View, Text, TextField, Button, Colors, Card } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = () => {
    console.log('Register attempt:', formData);
    router.push('/');
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61802.jpg' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Card style={styles.card} enableShadow>
          <View style={styles.header}>
            <AntDesign name="adduser" size={50} color={Colors.primary} />
            <Text text40BO color={Colors.primary} style={styles.title}>
              Yeni Hesap
            </Text>
            <Text text65 color={Colors.grey30}>
              Bilgilerinizi girin
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              text70
              placeholder="Ad Soyad"
              floatingPlaceholder
              containerStyle={styles.input}
              value={formData.fullName}
              onChangeText={(value) => updateForm('fullName', value)}
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="user" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <TextField
              text70
              placeholder="E-posta"
              floatingPlaceholder
              containerStyle={styles.input}
              value={formData.email}
              onChangeText={(value) => updateForm('email', value)}
              enableErrors
              validate={['required', 'email']}
              validateOnStart
              keyboardType="email-address"
              leadingAccessory={
                <AntDesign name="mail" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <TextField
              text70
              placeholder="Şifre"
              floatingPlaceholder
              containerStyle={styles.input}
              value={formData.password}
              onChangeText={(value) => updateForm('password', value)}
              secureTextEntry
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="lock" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <TextField
              text70
              placeholder="Şifre Tekrar"
              floatingPlaceholder
              containerStyle={styles.input}
              value={formData.confirmPassword}
              onChangeText={(value) => updateForm('confirmPassword', value)}
              secureTextEntry
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="lock" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <Button
              label="Kayıt Ol"
              size={Button.sizes.large}
              backgroundColor={Colors.primary}
              style={styles.registerButton}
              onPress={handleRegister}
              borderRadius={10}
              enableShadow
            />

            <Button
              label="Zaten hesabınız var mı? Giriş yapın"
              link
              color={Colors.primary}
              style={styles.loginButton}
              onPress={() => router.push('/')}
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
  registerButton: {
    height: 50,
    marginTop: 20,
  },
  loginButton: {
    marginTop: 20,
  },
});
