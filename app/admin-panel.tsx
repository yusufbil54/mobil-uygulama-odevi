import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Button, Colors, TextField } from 'react-native-ui-lib';
import { Stack, router } from 'expo-router';
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TestResult {
    id: string;
    patientName: string;
    testDate: string;
    testType: string;
    value: number;
    referenceRange: {
        min: number;
        max: number;
    };
    results: {
        who: string;
        europe: string;
        america: string;
        asia: string;
        turkey: string;
    };
}

const mockData: TestResult[] = [
    {
        id: '1',
        patientName: 'Ahmet Yılmaz',
        testDate: '2024-01-10',
        testType: 'IgA',
        value: 450,
        referenceRange: { min: 70, max: 400 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
    {
        id: '2',
        patientName: 'Ayşe Demir',
        testDate: '2024-01-15',
        testType: 'IgM',
        value: 120,
        referenceRange: { min: 40, max: 230 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
    {
        id: '3',
        patientName: 'Mehmet Kaya',
        testDate: '2024-01-12',
        testType: 'IgG',
        value: 550,
        referenceRange: { min: 700, max: 1600 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
    {
        id: '4',
        patientName: 'Zeynep Yıldız',
        testDate: '2024-01-14',
        testType: 'IgG1',
        value: 500,
        referenceRange: { min: 380, max: 930 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
    {
        id: '5',
        patientName: 'Ali Öztürk',
        testDate: '2024-01-13',
        testType: 'IgG2',
        value: 850,
        referenceRange: { min: 240, max: 700 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
    {
        id: '6',
        patientName: 'Fatma Şahin',
        testDate: '2024-01-11',
        testType: 'IgG3',
        value: 55,
        referenceRange: { min: 20, max: 110 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
    {
        id: '7',
        patientName: 'Mustafa Demir',
        testDate: '2024-01-16',
        testType: 'IgG4',
        value: 10,
        referenceRange: { min: 30, max: 200 },
        results: {
            who: 'normal',
            europe: 'normal',
            america: 'normal',
            asia: 'normal',
            turkey: 'normal'
        }
    },
];

const getResultIcon = (result: string | undefined) => {
    switch(result?.toLowerCase()) {
        case 'düşük':
            return <MaterialCommunityIcons name="arrow-down-bold-circle" size={24} color="#FF4B4B" />;
        case 'yüksek':
            return <MaterialCommunityIcons name="arrow-up-bold-circle" size={24} color="#FF9500" />;
        case 'normal':
            return <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />;
        default:
            return null;
    }
};

interface TestResultCardProps {
    item: TestResult;
}

const TestResultCard = ({ item }: TestResultCardProps) => (
    <Card key={item.id} style={styles.resultCard} enableShadow>
        <View style={styles.cardHeader}>
            <Text text65 color={Colors.grey10}>{item.patientName}</Text>
            <Text text80 color={Colors.grey30}>{item.testDate}</Text>
        </View>
        
        <View style={styles.testInfo}>
            <Text text70 color={Colors.grey20}>Test: {item.testType}</Text>
            <Text text70 color={Colors.blue30}>Değer: {item.value}</Text>
        </View>

        <View style={styles.guidelinesContainer}>
            <View style={styles.guidelineRow}>
                <Text style={styles.guidelineLabel}>WHO</Text>
                {getResultIcon(item.results.who)}
            </View>
            <View style={styles.guidelineRow}>
                <Text style={styles.guidelineLabel}>Avrupa</Text>
                {getResultIcon(item.results.europe)}
            </View>
            <View style={styles.guidelineRow}>
                <Text style={styles.guidelineLabel}>Amerika</Text>
                {getResultIcon(item.results.america)}
            </View>
            <View style={styles.guidelineRow}>
                <Text style={styles.guidelineLabel}>Asya</Text>
                {getResultIcon(item.results.asia)}
            </View>
            <View style={styles.guidelineRow}>
                <Text style={styles.guidelineLabel}>Türkiye</Text>
                {getResultIcon(item.results.turkey)}
            </View>
        </View>
    </Card>
);

const AdminPanel = () => {
    const [searchName, setSearchName] = useState<string>('');
    const [filteredData, setFilteredData] = useState<TestResult[]>(mockData.slice(0, 4));

    const handleSearch = () => {
        const filtered = mockData.filter(item =>
            item.patientName.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredData(filtered.slice(0, 4));
    };

    const getStatusInfo = (value: number, range: { min: number; max: number }) => {
        if (value > range.max) {
            return {
                status: 'Yüksek',
                color: '#FF4444',
                icon: 'arrow-upward'
            };
        } else if (value < range.min) {
            return {
                status: 'Düşük',
                color: '#4CAF50',
                icon: 'arrow-downward'
            };
        }
        return {
            status: 'Normal',
            color: '#2196F3',
            icon: 'remove'
        };
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <View style={styles.header}>
                <View>
                    <Text text50 color={Colors.grey10}>
                        Admin Paneli
                    </Text>
                    <Text text65 color={Colors.grey30}>
                        Yönetici
                    </Text>
                </View>
                <View row centerV>
                    <Button
                        link
                        iconSource={() => <AntDesign name="logout" size={24} color={Colors.primary} />}
                        onPress={() => router.push('/')}
                    />
                </View>


            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    
                    <Card style={styles.searchCard} enableShadow>
                        <Text text60 color={Colors.grey10} marginB-15>
                            Hasta Ara
                        </Text>
                        <View style={styles.searchInputContainer}>
                            <AntDesign name="search1" size={24} color={Colors.grey30} style={styles.searchIcon} />
                            <TextField
                                placeholder="Hasta TC"
                                placeholderTextColor={Colors.grey40}
                                value={searchName}
                                onChangeText={setSearchName}
                                fieldStyle={styles.searchInput}
                                enableErrors={false}
                                onSubmitEditing={handleSearch}
                            />
                        </View>
                        <Button
                            label="Ara"
                            size={Button.sizes.large}
                            backgroundColor={Colors.primary}
                            onPress={handleSearch}
                            marginT-10
                            borderRadius={8}
                            style={{ height: 50 }}
                        />
                    </Card>
                    <View style={styles.headerRow}>
                        <Button
                            label="Yeni Test Ekle"
                            onPress={() => router.push('/testEntry')}
                            backgroundColor={Colors.primary}
                            borderRadius={8}
                            marginT-10
                            style={styles.fullWidthButton}
                        />
                    </View>
                    <View style={styles.headerRow}>
                        <Button
                            label="Yeni Kılavuz Ekle"
                            onPress={() => router.push('/guidelineEntry')}
                            backgroundColor={Colors.primary}
                            borderRadius={8}
                            marginT-10
                            style={styles.fullWidthButton}
                        />
                    </View>

                    {/* Test Sonuçları Bölümü - Geçici olarak gizlendi
                    <View style={styles.headerRow}>
                        <Text text65 color={Colors.grey10}>
                            Test Sonuçları
                        </Text>
                        <Button
                            link
                            label="Tüm Sonuçları Gör"
                            labelStyle={{ color: Colors.primary }}
                            onPress={() => router.push('/adminallresults')}
                        />
                    </View>

                    {filteredData.map((item) => {
                        const statusInfo = getStatusInfo(item.value, item.referenceRange);
                        return (
                            <Card key={item.id} style={styles.resultCard} enableShadow>
                                <View row spread>
                                    <View>
                                        <Text text65 color={Colors.grey10} marginB-4>
                                            {item.patientName}
                                        </Text>
                                        <Text text80 color={Colors.grey30}>
                                            {item.testType}
                                        </Text>
                                        <Text text90 color={Colors.grey40}>
                                            Referans: {item.referenceRange.min} - {item.referenceRange.max}
                                        </Text>
                                    </View>
                                    <View right>
                                        <Text style={[styles.valueText, { color: statusInfo.color }]}>
                                            {item.value}
                                        </Text>
                                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                            {statusInfo.status}
                                        </Text>
                                        <Text text90 color={Colors.grey30}>
                                            {item.testDate}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                    */}
                </View>
            </ScrollView>
        </View>
    );
};

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
    fullWidthButton: {
        width: '95%',
        paddingVertical: 14,
        marginBottom: 10,
        alignSelf: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 10,
        width: width > 500 ? 500 : '100%',
        alignSelf: 'center',
    },
    searchCard: {
        padding: 35,
        marginBottom: 25,
        backgroundColor: Colors.white,
        borderRadius: 12,
        width: '95%',
        alignSelf: 'center',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey50,
        borderRadius: 8,
        paddingHorizontal: 20,
        height: 60,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 15,
        fontSize: 26,
    },
    searchInput: {
        flex: 1,
        height: 60,
        fontSize: 18,
        color: Colors.grey10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        padding: 16,
        width: '48%',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
    },
    resultCard: {
        padding: 20,
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 12,
        minHeight: 200,
    },
    valueText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 4,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'right',
        marginBottom: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey60,
        paddingBottom: 8,
    },
    testInfo: {
        marginBottom: 16,
    },
    guidelinesContainer: {
        backgroundColor: Colors.grey70,
        padding: 16,
        borderRadius: 8,
    },
    guidelineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey60,
    },
    guidelineLabel: {
        fontSize: 16,
        color: Colors.grey20,
        fontWeight: '500',
    },
});

export default AdminPanel;