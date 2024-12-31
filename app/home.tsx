import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { View, Text, Card, Button, Colors, Chip, Avatar } from 'react-native-ui-lib';
import { router, useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { appStore, API_URL } from '../store/appStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

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
    const [recentTests, setRecentTests] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Token ve user kontrolü
                if (!appStore.token || !appStore.user?.id) {
                    router.push('/');
                    return;
                }

                await fetchRecentTests();
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, [appStore.token, appStore.user]); // token ve user değiştiğinde tekrar çalışsın

    const fetchRecentTests = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tests/user-tests/${appStore.user.id}`, {
                headers: {
                    Authorization: `Bearer ${appStore.token}`
                }
            });

            if (response.data.success) {
                const sortedTests = response.data.data
                    .sort((a: TestResult, b: TestResult) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, 5);
                setRecentTests(sortedTests);
            }
        } catch (error) {
            console.error('Error fetching recent tests:', error);
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text text50 color={Colors.grey10}>
                        Hoş Geldiniz
                    </Text>
                    <Text text65 color={Colors.grey30}>
                        {(appStore.user as any)?.name} {(appStore.user as any)?.surname}
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

                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.primary} />
                    ) : recentTests.length > 0 ? (
                        recentTests.map((result) => (
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
                                                    result.resultStatus === 'Yüksek' ? 'arrow-upward' :
                                                    result.resultStatus === 'Düşük' ? 'arrow-downward' : 'remove'
                                                }
                                                size={24}
                                                color={getStatusColor(result.resultStatus)}
                                                style={styles.valueIcon}
                                            />
                                            <Text style={styles.valueText}>
                                                {result.value} g/L
                                            </Text>
                                        </View>
                                        <View style={[
                                            styles.statusIndicator,
                                            { backgroundColor: getStatusColor(result.resultStatus) + '20' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: getStatusColor(result.resultStatus) }
                                            ]}>
                                                {result.resultStatus}
                                            </Text>
                                        </View>
                                    </View>
                                    {result.guidelineResults?.[0] && (
                                        <View style={styles.referenceContainer}>
                                            <Text style={styles.referenceText}>
                                                Referans: {result.guidelineResults[0].referenceRange.min} - {' '}
                                                {result.guidelineResults[0].referenceRange.max} g/L
                                            </Text>
                                            <Text style={styles.sourceText}>
                                                {result.guidelineResults[0].guidelineSource}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Card>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Henüz test sonucu bulunmamaktadır.</Text>
                    )}
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

export default HomeScreen;
