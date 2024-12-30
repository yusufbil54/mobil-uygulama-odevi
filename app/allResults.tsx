import React, { useState, useMemo, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { View, Text, Card, Colors, TextField } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL, appStore } from '../store/appStore';
import { observer } from 'mobx-react';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

// Test sonucu için interface
interface TestResult {
    _id: string;
    testType: {
        _id: string;
        name: string;
    };
    value: number;
    date: string;
    results: {
        who: string;
        europe: string;
        america: string;
        asia: string;
        turkey: string;
    };
}

const AllResultsScreen = observer(() => {
    const [searchQuery, setSearchQuery] = useState('');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestResults();
    }, []);

    const fetchTestResults = async () => {
        try {
            if (!appStore.token || !appStore.user) {
                router.push('/');
                return;
            }

            const response = await axios.get(`${API_URL}/api/tests/user-tests/${appStore.user.id}`, {
                headers: {
                    Authorization: `Bearer ${appStore.token}`
                }
            });

            if (response.data.success) {
                setTestResults(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching test results:', error);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Test sonuçları alınırken bir hata oluştu'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusFromResults = (results: TestResult['results']) => {
        const turkeyValue = results.turkey;
        if (turkeyValue.includes('Yüksek')) return 'high';
        if (turkeyValue.includes('Düşük')) return 'low';
        return 'normal';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'high': return Colors.red30;
            case 'low': return Colors.blue30;
            default: return Colors.green30;
        }
    };

    const filteredResults = useMemo(() => {
        return testResults.filter(result =>
            result.testType.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, testResults]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

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
                    placeholder="Test türü ara..."
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
                        <Card key={result._id} style={styles.resultCard} enableShadow>
                            <View style={styles.resultContainer}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.testName}>{result.testType.name}</Text>
                                    <Text style={styles.dateText}>
                                        {new Date(result.date).toLocaleDateString('tr-TR')}
                                    </Text>
                                </View>
                                <View style={styles.resultValueSection}>
                                    <View style={styles.valueContainer}>
                                        <MaterialIcons 
                                            name={
                                                getStatusFromResults(result.results) === 'high' ? 'arrow-upward' :
                                                getStatusFromResults(result.results) === 'low' ? 'arrow-downward' : 'remove'
                                            } 
                                            size={24} 
                                            color={getStatusColor(getStatusFromResults(result.results))}
                                            style={styles.valueIcon}
                                        />
                                        <Text style={styles.valueText}>
                                            {result.value}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusIndicator,
                                        { backgroundColor: getStatusColor(getStatusFromResults(result.results)) + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            { color: getStatusColor(getStatusFromResults(result.results)) }
                                        ]}>
                                            {result.results.turkey}
                                        </Text>
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

export default AllResultsScreen;

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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
