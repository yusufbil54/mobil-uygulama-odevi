import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Colors, Chip, TextField } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

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
              <View row spread centerV>
                <View>
                  <Text text65 color={Colors.grey10}>
                    {result.type}
                  </Text>
                  <Text text90 color={Colors.grey30} marginT-4>
                    {result.date}
                  </Text>
                </View>
                <View row centerV>
                  <Text text65 color={Colors.grey10} marginR-10>
                    {result.value} {result.unit}
                  </Text>
                  <Chip
                    label={getStatusLabel(result.status)}
                    labelStyle={{ color: Colors.white }}
                    backgroundColor={getStatusColor(result.status)}
                    containerStyle={styles.chipContainer}
                  />
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
    padding: 16,
    marginBottom: 12,
  },
  chipContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
