import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Colors, TextField, Button, Avatar } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { appStore } from '../store/appStore';

const { width } = Dimensions.get('window');

interface User {
    _id: string;
    name: string;
    surname: string;
    email: string;
    birthDate: string;
    role: string;
}

interface ProfileData {
    name: string;
    surname: string;
    email: string;
    birthDate: string;
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfileScreen = observer(() => {
  useEffect(() => {
    appStore.getUserProfile();
  }, []);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    surname: '',
    email: '',
    birthDate: ''
  });

  useEffect(() => {
    const user = appStore.user as User | null;
    setProfileData({
      name: user?.name || '',
      surname: user?.surname || '',
      email: user?.email || '',
      birthDate: user?.birthDate || ''
    });
  }, [appStore.user]);

  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = async () => {
    try {
      await appStore.updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        appStore.showToast('error', 'Hata', 'Yeni şifreler eşleşmiyor');
        return;
      }

      await appStore.changePassword(passwordData);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View row centerV>
          <AntDesign 
            name="arrowleft" 
            size={24} 
            color={Colors.primary} 
            onPress={() => router.push('/home')}
            style={styles.backButton}
          />
          <Text text50 color={Colors.grey10}>
            Profil Bilgileri
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View center marginB-20>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={60} color={Colors.white} />
            </View>
            {!isEditing && (
              <Button
                link
                label="Profili Düzenle"
                color={Colors.primary}
                labelStyle={styles.editButtonLabel}
                marginT-10
                onPress={() => setIsEditing(true)}
              />
            )}
          </View>

          <Card enableShadow style={styles.infoCard}>
            <View>
              <View style={styles.fieldContainer}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="person" size={20} color={Colors.primary} />
                </View>
                <View style={styles.inputWrapper}>
                  <TextField
                    label="Ad"
                    value={profileData.name}
                    onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                    editable={isEditing}
                    style={styles.input}
                    labelStyle={styles.labelText}
                    color={Colors.grey10}
                  />
                </View>
              </View>
              
              <View style={styles.fieldContainer}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="person" size={20} color={Colors.primary} />
                </View>
                <View style={styles.inputWrapper}>
                  <TextField
                    label="Soyad"
                    value={profileData.surname}
                    onChangeText={(text) => setProfileData({ ...profileData, surname: text })}
                    editable={isEditing}
                    style={styles.input}
                    labelStyle={styles.labelText}
                    color={Colors.grey10}
                  />
                </View>
              </View>



              <View style={styles.fieldContainer}>
                 <View style={styles.iconContainer}>
                  <MaterialIcons name="email" size={20} color={Colors.primary} />
                </View>
                <View style={styles.inputWrapper}>
                  <TextField
                    label="E-posta"
                    value={profileData.email}
                    onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                    editable={isEditing}
                    style={styles.input}
                    labelStyle={styles.labelText}
                    color={Colors.grey10}
                  />
                </View>
              </View>


              <View style={styles.fieldContainer}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="calendar-today" size={20} color={Colors.primary} />
                </View>
                <View style={styles.inputWrapper}>
                  <TextField
                    label="Doğum Tarihi"
                    value={profileData.birthDate}
                    onChangeText={(text) => setProfileData({ ...profileData, birthDate: text })}
                    editable={isEditing}
                    style={styles.input}
                    labelStyle={styles.labelText}
                    color={Colors.grey10}
                  />
                </View>
              </View>
            
              
            </View>

            {isEditing && (
              <View row spread marginT-20>
                <Button
                  outline
                  label="İptal"
                  color={Colors.grey20}
                  onPress={() => setIsEditing(false)}
                  style={[styles.button, styles.cancelButton]}
                  outlineColor={Colors.grey40}
                />
                <Button
                  label="Kaydet"
                  backgroundColor={Colors.primary}
                  onPress={handleSave}
                  style={[styles.button, styles.saveButton]}
                />
              </View>
            )}
          </Card>

          <Card enableShadow style={[styles.infoCard, { marginTop: 20 }]}>
            <View>
              <Text text60 color={Colors.grey10} marginB-10>
                Şifre Değiştir
              </Text>

              {!isChangingPassword ? (
                <Button
                  label="Şifre Değiştir"
                  outline
                  color={Colors.primary}
                  onPress={() => setIsChangingPassword(true)}
                />
              ) : (
                <>
                  <View style={styles.passwordContainer}>
                    <View style={{ flex: 1 }}>
                      <TextField
                        label="Mevcut Şifre"
                        value={passwordData.currentPassword}
                        onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                        secureTextEntry={!showCurrentPassword}
                        style={styles.input}
                        labelStyle={styles.labelText}
                      />
                    </View>
                    <Button
                      link
                      style={styles.showPasswordButton}
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      <Ionicons
                        name={showCurrentPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color={Colors.grey30}
                      />
                    </Button>
                  </View>

                  <View style={styles.passwordContainer}>
                    <View style={{ flex: 1 }}>
                      <TextField
                        label="Yeni Şifre"
                        value={passwordData.newPassword}
                        onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                        secureTextEntry={!showNewPassword}
                        style={styles.input}
                        labelStyle={styles.labelText}
                      />
                    </View>
                    <Button
                      link
                      style={styles.showPasswordButton}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Ionicons
                        name={showNewPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color={Colors.grey30}
                      />
                    </Button>
                  </View>

                  <View style={styles.passwordContainer}>
                    <View style={{ flex: 1 }}>
                      <TextField
                        label="Yeni Şifre (Tekrar)"
                        value={passwordData.confirmPassword}
                        onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                        secureTextEntry={!showConfirmPassword}
                        style={styles.input}
                        labelStyle={styles.labelText}
                      />
                    </View>
                    <Button
                      link
                      style={styles.showPasswordButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color={Colors.grey30}
                      />
                    </Button>
                  </View>

                  <View row spread marginT-20>
                    <Button
                      outline
                      label="İptal"
                      color={Colors.grey20}
                      onPress={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      style={[styles.button, styles.cancelButton]}
                      outlineColor={Colors.grey40}
                    />
                    <Button
                      label="Şifreyi Güncelle"
                      backgroundColor={Colors.primary}
                      onPress={handlePasswordChange}
                      style={[styles.button, styles.saveButton]}
                    />
                  </View>
                </>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
});

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey70,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  backButton: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: '100%',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  inputWrapper: {
    flex: 1,
    width: '100%',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey40,
    paddingBottom: 8,
    width: '100%',
  },
  labelText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    width: '100%',
  },
  multilineInput: {
    height: 'auto',
    textAlignVertical: 'top',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 44,
    borderRadius: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    elevation: 2,
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
