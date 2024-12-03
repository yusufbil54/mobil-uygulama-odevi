import React from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Button, Colors, Chip, Avatar } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign, Ionicons } from '@expo/vector-icons';

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

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text text50 color={Colors.grey10}>
            Hoş Geldiniz
          </Text>
          <Text text65 color={Colors.grey30}>
            John Doe
          </Text>
        </View>
        <View row centerV>
          <Button
            link
            iconSource={() => <Ionicons name="notifications-outline" size={24} color={Colors.primary} />}
            style={styles.iconButton}
          />
          <Button
            link
            iconSource={() => <AntDesign name="logout" size={24} color={Colors.primary} />}
            onPress={() => router.push('/')}
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
              size={Button.sizes.small}
              color={Colors.primary}
            />
          </View>

          {mockTestResults.map((result) => (
            <Card key={result.id} style={styles.resultCard} enableShadow>
              <View row spread centerV>
                <View>
                  <Text text65 color={Colors.grey10}>
                    {result.type}
                  </Text>
                  <Text text70 color={Colors.grey30}>
                    {result.date}
                  </Text>
                </View>
                <View row centerV>
                  <Text text65 color={Colors.grey10} marginR-10>
                    {result.value} mg/dL
                  </Text>
                  <Chip
                    label={getStatusLabel(result.status)}
                    labelStyle={{ color: Colors.white }}
                    backgroundColor={getStatusColor(result.status)}
                    containerStyle={styles.chip}
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
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  chip: {
    borderRadius: 4,
  },
});
