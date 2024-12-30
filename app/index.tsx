import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ImageBackground, Alert } from 'react-native';
import { View, Text, TextField, Button, Colors, Card } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { appStore } from '../store/appStore';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native';

const { width } = Dimensions.get('window');

const LoginScreen = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (appStore.savedCredentials) {
      setEmail(appStore.savedCredentials.email);
      setPassword(appStore.savedCredentials.password);
      setRememberMe(true);
    }
  }, [appStore.savedCredentials]);

  const handleLogin = async () => {
    if(!email || !password) {
      appStore.showToast('error', 'Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    try {
      await appStore.login({ email, password }, router);
      await appStore.setSavedCredentials(email, password, rememberMe);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegisterPress = React.useCallback(() => {
    router.push('/register');
  }, []);

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
              placeholder="E-posta"
              floatingPlaceholder
              containerStyle={styles.input}
              value={email}
              onChangeText={setEmail}
              enableErrors
              validate={['required', 'email']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="mail" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <View style={styles.passwordContainer}>
              <View style={{ flex: 1 }}>
                <TextField
                  text70
                  placeholder="Şifre"
                  floatingPlaceholder
                  containerStyle={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  enableErrors
                  validate={['required']}
                  validateOnStart
                  leadingAccessory={
                    <AntDesign name="lock" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
                  }
                />
              </View>
              <Button
                link
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={Colors.grey30}
                />
              </Button>
            </View>

            <View style={styles.rememberMeContainer}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                style={styles.switch}
              />
              <Text text80 color={Colors.grey30}>
                Beni Hatırla
              </Text>
            </View>

            <Button
              label={appStore.loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              size={Button.sizes.large}
              backgroundColor={Colors.primary}
              style={styles.loginButton}
              onPress={handleLogin}
              borderRadius={10}
              enableShadow
              disabled={appStore.loading || !email || !password}
            />

            <Button
              label="Hesabınız yok mu? Kayıt olun"
              link
              color={Colors.primary}
              style={styles.registerButton}
              onPress={handleRegisterPress}
            />
          </View>
        </Card>
      </View>
    </ImageBackground>
  );
});

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
    paddingRight: 40,
  },
  loginButton: {
    height: 50,
    marginTop: 20,
  },
  registerButton: {
    marginTop: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  showPasswordButton: {
    padding: 10,
    marginLeft: -40,
    height: 44,
    justifyContent: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switch: {
    marginRight: 10,
  },
});

export default LoginScreen;
