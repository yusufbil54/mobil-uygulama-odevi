import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Colors, TextField, Button, Avatar } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+90 555 123 4567',
    birthDate: '01/01/1990',
    bloodType: 'A+',
    address: 'Atatürk Mah. Cumhuriyet Cad. No:123 Istanbul',
    emergencyContact: 'Jane Doe - +90 555 765 4321',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Burada API'ye kayıt işlemi yapılabilir
    setIsEditing(false);
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
            <AntDesign name="user" size={80} color={Colors.grey30} />
            {!isEditing && (
              <Button
                link
                label="Profili Düzenle"
                color={Colors.primary}
                marginT-10
                onPress={() => setIsEditing(true)}
              />
            )}
          </View>

          <Card enableShadow style={styles.infoCard}>
            <View>
              <TextField
                label="Ad Soyad"
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                editable={isEditing}
                style={styles.input}
              />
              <TextField
                label="E-posta"
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                editable={isEditing}
                style={styles.input}
              />
              <TextField
                label="Telefon"
                value={profileData.phone}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                editable={isEditing}
                style={styles.input}
              />
              <TextField
                label="Doğum Tarihi"
                value={profileData.birthDate}
                onChangeText={(text) => setProfileData({ ...profileData, birthDate: text })}
                editable={isEditing}
                style={styles.input}
              />
              <TextField
                label="Kan Grubu"
                value={profileData.bloodType}
                onChangeText={(text) => setProfileData({ ...profileData, bloodType: text })}
                editable={isEditing}
                style={styles.input}
              />
              <TextField
                label="Adres"
                value={profileData.address}
                onChangeText={(text) => setProfileData({ ...profileData, address: text })}
                editable={isEditing}
                multiline
                style={styles.input}
              />
              <TextField
                label="Acil Durum Kontağı"
                value={profileData.emergencyContact}
                onChangeText={(text) => setProfileData({ ...profileData, emergencyContact: text })}
                editable={isEditing}
                style={styles.input}
              />
            </View>

            {isEditing && (
              <View row spread marginT-20>
                <Button
                  outline
                  label="İptal"
                  color={Colors.grey30}
                  onPress={() => setIsEditing(false)}
                  style={styles.button}
                />
                <Button
                  label="Kaydet"
                  backgroundColor={Colors.primary}
                  onPress={handleSave}
                  style={styles.button}
                />
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey70,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.white,
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
  infoCard: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey50,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

