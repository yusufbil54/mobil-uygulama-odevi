import React from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { View, Text, Card, Button, Colors, Chip, Avatar } from 'react-native-ui-lib';
import { router, useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { appStore } from '../store/appStore';

const { width } = Dimensions.get('window');

const mockTestResults = [
  {
    id: 1,
    date: '2024-03-15',
    type: 'IgG',
    value: 750,
    status: 'normal',
  },
  {
    id: 2,
    date: '2024-03-15',
    type: 'IgA',
    value: 450,
    status: 'high',
  },
  {
    id: 3,
    date: '2024-03-15',
    type: 'IgM',
    value: 150,
    status: 'low',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return Colors.green30;
    case 'high':
      return Colors.red30;
    case 'low':
      return Colors.blue30;
    default:
      return Colors.grey30;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'normal':
      return 'Normal';
    case 'high':
      return 'Yüksek';
    case 'low':
      return 'Düşük';
    default:
      return 'Belirsiz';
  }
};

const HomeScreen = observer(() => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text text50 color={Colors.grey10}>
            Hoş Geldiniz
          </Text>
          <Text text65 color={Colors.grey30}>
            {appStore.user?.name} {appStore.user?.surname}
          </Text>
        </View>
        <View row centerV>
          <Button
            link
            iconSource={() => <AntDesign name="user" size={24} color={Colors.primary} />}
            onPress={() => router.push('/profile')}
            style={styles.iconButton}
          />
          <Button
            link
            iconSource={() => <AntDesign name="logout" size={24} color={Colors.primary} />}
            onPress={() => appStore.logout(router)}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.summaryCard} enableShadow>
            <Text text65 color={Colors.grey10} marginB-10>
              Özet Bilgiler
            </Text>
            <View row spread>
              <View center>
                <Text text50 color={Colors.primary}>
                  12
                </Text>
                <Text text90 color={Colors.grey30}>
                  Toplam Test
                </Text>
              </View>
              <View center>
                <Text text50 color={Colors.green30}>
                  8
                </Text>
                <Text text90 color={Colors.grey30}>
                  Normal
                </Text>
              </View>
              <View center>
                <Text text50 color={Colors.red30}>
                  4
                </Text>
                <Text text90 color={Colors.grey30}>
                  Anormal
                </Text>
              </View>
            </View>
          </Card>

          <View style={styles.sectionHeader}>
            <Text text65 color={Colors.grey10}>
              Son Test Sonuçları
            </Text>
            <Button
              link
              label="Tümünü Gör"
              color={Colors.primary}
              onPress={() => router.push('/allResults')}
            />
          </View>

          {mockTestResults.map((result) => (
            <Card key={result.id} style={styles.resultCard} enableShadow>
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Text style={styles.testName}>{result.type}</Text>
                  <Text style={styles.dateText}>{result.date}</Text>
                </View>
                <View style={styles.resultValueSection}>
                  <View style={styles.valueContainer}>
                    <MaterialIcons 
                      name={
                        result.status === 'high' ? 'arrow-upward' :
                        result.status === 'low' ? 'arrow-downward' : 'remove'
                      } 
                      size={24} 
                      color={
                        result.status === 'high' ? '#FF4444' :
                        result.status === 'low' ? '#4CAF50' : '#2196F3'
                      }
                      style={styles.valueIcon}
                    />
                    <Text style={[
                      styles.valueText,
                      result.status === 'high' && styles.highValue,
                      result.status === 'normal' && styles.normalValue,
                      result.status === 'low' && styles.lowValue,
                    ]}>
                      {result.value} mg/dL
                    </Text>
                  </View>
                  <View style={[
                    styles.statusIndicator,
                    result.status === 'high' && styles.highStatus,
                    result.status === 'normal' && styles.normalStatus,
                    result.status === 'low' && styles.lowStatus,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      result.status === 'high' && styles.highStatusText,
                      result.status === 'normal' && styles.normalStatusText,
                      result.status === 'low' && styles.lowStatusText,
                    ]}>{getStatusLabel(result.status)}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  iconButton: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center',
  },
  summaryCard: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultCard: {
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 0,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultContainer: {
    padding: 12,
  },
  resultHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 6,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.grey10,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: Colors.grey30,
  },
  resultValueSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueIcon: {
    marginRight: 6,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
  },
  highValue: {
    color: '#FF4444',
  },
  normalValue: {
    color: '#2196F3',
  },
  lowValue: {
    color: '#4CAF50',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highStatus: {
    backgroundColor: '#FFE5E5',
  },
  normalStatus: {
    backgroundColor: '#E3F2FD',
  },
  lowStatus: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  highStatusText: {
    color: '#FF4444',
  },
  normalStatusText: {
    color: '#2196F3',
  },
  lowStatusText: {
    color: '#4CAF50',
  },
});

export default HomeScreen;
