import React, { useState } from 'react';
import { StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { View, Text, TextField, Button, Colors, Card } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { appStore } from '../store/appStore';

const { width } = Dimensions.get('window');

const RegisterScreen = observer(() => {
  const [name, setName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [tc, setTc] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    appStore.register({
      name,
      surname,
      tc,
      email,
      password
    }, router);
  }

  const handleLoginPress = React.useCallback(() => {
    router.push('/');
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
              Kayıt Ol
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              text70
              placeholder="Ad"
              floatingPlaceholder
              containerStyle={styles.input}
              value={name}
              onChangeText={setName}
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="user" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />

            <TextField
              text70
              placeholder="Soyad"
              floatingPlaceholder
              containerStyle={styles.input}
              value={surname}
              onChangeText={setSurname}
              enableErrors
              validate={['required']}
              validateOnStart
              leadingAccessory={
                <AntDesign name="user" size={20} color={Colors.grey30} style={{ marginRight: 10 }} />
              }
            />
<TextField
              text70
              placeholder="TC Kimlik No"
              floatingPlaceholder
              containerStyle={styles.input}
              value={tc}
              onChangeText={setTc}
              enableErrors
              validate={['required', (value) => value.length == 11 || 'TC 11 karakter olmalıdır']}
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
                  placeholder="Şifre (en az 6 karakter)"
                  floatingPlaceholder
                  containerStyle={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  enableErrors
                  validate={['required', (value) => value.length >= 6 || 'Şifre en az 6 karakter olmalıdır']}
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

            <Button
              label={appStore.loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              size={Button.sizes.large}
              backgroundColor={Colors.primary}
              style={styles.registerButton}
              onPress={handleRegister}
              borderRadius={10}
              enableShadow
              disabled={appStore.loading || !name || tc.length != 11 || !surname || !email || password.length < 6}
            />

            <Button
              label="Zaten hesabınız var mı? Giriş yapın"
              link
              color={Colors.primary}
              style={styles.loginButton}
              onPress={handleLoginPress}
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
  registerButton: {
    height: 50,
    marginTop: 20,
  },
  loginButton: {
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
});

export default RegisterScreen;
