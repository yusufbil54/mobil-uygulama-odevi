import React, { useState, useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { View, Text, Card, Colors, Chip, TextField } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const mockTestResults = [
  {
    id: 1,
    date: '2024-03-15',
    type: 'IgG',
    value: 750,
    status: 'normal',
    unit: 'mg/dL',
  },
  {
    id: 2,
    date: '2024-03-15',
    type: 'IgA',
    value: 450,
    status: 'high',
    unit: 'mg/dL',
  },
  {
    id: 3,
    date: '2024-03-15',
    type: 'IgM',
    value: 150,
    status: 'low',
    unit: 'mg/dL',
  },
  {
    id: 4,
    date: '2024-03-14',
    type: 'IgG1',
    value: 380,
    status: 'normal',
    unit: 'mg/dL',
  },
  {
    id: 5,
    date: '2024-03-14',
    type: 'IgG2',
    value: 220,
    status: 'high',
    unit: 'mg/dL',
  },
  {
    id: 6,
    date: '2024-03-14',
    type: 'IgG3',
    value: 45,
    status: 'normal',
    unit: 'mg/dL',
  },
  {
    id: 7,
    date: '2024-03-14',
    type: 'IgG4',
    value: 85,
    status: 'high',
    unit: 'mg/dL',
  },
  {
    id: 8,
    date: '2024-03-14',
    type: 'Hemoglobin',
    value: 14.2,
    status: 'normal',
    unit: 'g/dL',
  },
  {
    id: 9,
    date: '2024-03-14',
    type: 'Trombosit',
    value: 250000,
    status: 'normal',
    unit: 'µL',
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

export default function AllResultsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = useMemo(() => {
    return mockTestResults.filter(result =>
      result.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
            Tüm Test Sonuçları
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextField
          placeholder="Test türü ara... (örn: IgG, IgA)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leadingAccessory={
            <AntDesign name="search1" size={20} color={Colors.grey30} style={styles.searchIcon} />
          }
          style={styles.searchInput}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {filteredResults.map((result) => (
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
                      {result.value} {result.unit}
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
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  searchInput: {
    backgroundColor: Colors.grey70,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
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
