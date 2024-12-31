import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { View, Text, Card, Button, Colors } from 'react-native-ui-lib';
import { Stack, useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL, appStore } from '../store/appStore';
import { observer } from 'mobx-react';

interface TestResult {
    _id: string;
    testType: {
        _id: string;
        name: string;
        type: string;
    };
    value: number;
    date: string;
    resultStatus: string;
    guidelineResults: Array<{
        guidelineSource: string;
        resultStatus: string;
        referenceRange: {
            min: number;
            max: number;
            mean: number;
            sd: number;
        }
    }>;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Normal':
            return Colors.green30;
        case 'Yüksek':
            return Colors.red30;
        case 'Düşük':
            return Colors.blue30;
        default:
            return Colors.grey30;
    }
};

const AllResults = observer(() => {
    const router = useRouter();
    const [tests, setTests] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/tests/user-tests/${appStore.user?.id}`,
                {
                    headers: { Authorization: `Bearer ${appStore.token}` }
                }
            );

            if (response.data.success) {
                setTests(response.data.data.sort((a: TestResult, b: TestResult) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ));
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <View row centerV>
                    <AntDesign 
                        name="arrowleft" 
                        size={24} 
                        color={Colors.primary} 
                        onPress={() => router.back()}
                        style={styles.backButton}
                    />
                    <Text text50 color={Colors.grey10}>
                        Tüm Test Sonuçları
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} />
                ) : tests.length > 0 ? (
                    tests.map((result) => (
                        <Card key={result._id} style={styles.resultCard} enableShadow>
                            <View style={styles.resultContainer}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.testName}>
                                        {result.testType?.name || 'Bilinmeyen Test'} 
                                        {result.testType?.type ? ` (${result.testType.type})` : ''}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        {new Date(result.date).toLocaleDateString('tr-TR')}
                                    </Text>
                                </View>
                                <View style={styles.resultValueSection}>
                                    <View style={styles.valueContainer}>
                                        <MaterialIcons
                                            name={
                                                result.resultStatus === 'Yüksek' ? 'arrow-upward' :
                                                result.resultStatus === 'Düşük' ? 'arrow-downward' : 'remove'
                                            }
                                            size={24}
                                            color={getStatusColor(result.resultStatus || 'Normal')}
                                            style={styles.valueIcon}
                                        />
                                        <Text style={styles.valueText}>
                                            {result.value} g/L
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusIndicator,
                                        { backgroundColor: getStatusColor(result.resultStatus || 'Normal') + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            { color: getStatusColor(result.resultStatus || 'Normal') }
                                        ]}>
                                            {result.resultStatus || 'Normal'}
                                        </Text>
                                    </View>
                                </View>
                                {result.guidelineResults?.[0] && (
                                    <View style={styles.referenceContainer}>
                                        <Text style={styles.referenceText}>
                                            Referans: {result.guidelineResults[0].referenceRange?.min || '?'} - {' '}
                                            {result.guidelineResults[0].referenceRange?.max || '?'} g/L
                                        </Text>
                                        <Text style={styles.sourceText}>
                                            {result.guidelineResults[0].guidelineSource || 'Standart Kılavuz'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.noDataText}>Henüz test sonucu bulunmamaktadır.</Text>
                )}
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
        padding: 15,
    },
    resultCard: {
        marginBottom: 10,
        backgroundColor: Colors.white,
        borderRadius: 8,
    },
    resultContainer: {
        padding: 15,
    },
    resultHeader: {
        marginBottom: 10,
    },
    testName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.grey10,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: Colors.grey30,
    },
    resultValueSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueIcon: {
        marginRight: 8,
    },
    valueText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.grey10,
    },
    statusIndicator: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    noDataText: {
        textAlign: 'center',
        color: Colors.grey30,
        marginTop: 20,
        fontSize: 16,
    },
    referenceContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.grey60,
    },
    referenceText: {
        fontSize: 12,
        color: Colors.grey30,
    },
    sourceText: {
        fontSize: 12,
        color: Colors.grey40,
        marginTop: 2,
    }
});

export default AllResults;
