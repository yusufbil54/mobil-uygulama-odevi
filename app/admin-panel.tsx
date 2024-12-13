import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Button, Colors, TextField } from 'react-native-ui-lib';
import { Stack, router } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TestResult {
    id: string;
    patientName: string;
    testDate: string;
    testType: string;
    results: string;
}

const mockData: TestResult[] = [
    {
        id: '1',
        patientName: 'Ahmet Yılmaz',
        testDate: '2024-01-10',
        testType: 'Kan Tahlili',
        results: 'Normal',
    },
    {
        id: '2',
        patientName: 'Ayşe Demir',
        testDate: '2024-01-15',
        testType: 'İdrar Tahlili',
        results: 'Normal',
    },
];

const AdminPanel = () => {
    const [searchName, setSearchName] = useState<string>('');
    const [filteredData, setFilteredData] = useState<TestResult[]>(mockData);

    const handleSearch = () => {
        const filtered = mockData.filter(item => 
            item.patientName.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredData(filtered);
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
                        <Text text65 color={Colors.grey10} marginB-10>
                            Hasta Ara
                        </Text>
                        <View style={styles.searchInputContainer}>
                            <AntDesign name="search1" size={20} color={Colors.grey30} style={styles.searchIcon} />
                            <TextField
                                placeholder="Hasta Adı Soyadı"
                                value={searchName}
                                onChangeText={setSearchName}
                                fieldStyle={styles.searchInput}
                                enableErrors={false}
                                onSubmitEditing={handleSearch}
                            />
                        </View>
                        <Button
                            label="Ara"
                            size={Button.sizes.medium}
                            backgroundColor={Colors.primary}
                            onPress={handleSearch}
                            marginT-10
                            borderRadius={8}
                        />
                    </Card>

                    <View style={styles.statsContainer}>
                        <Card style={styles.statCard} enableShadow>
                            <MaterialIcons name="people" size={24} color={Colors.primary} />
                            <Text text60 color={Colors.grey10} marginT-8>
                                {filteredData.length}
                            </Text>
                            <Text text80 color={Colors.grey30}>
                                Toplam Hasta
                            </Text>
                        </Card>
                        <Card style={styles.statCard} enableShadow>
                            <MaterialIcons name="assignment" size={24} color={Colors.primary} />
                            <Text text60 color={Colors.grey10} marginT-8>
                                {filteredData.length}
                            </Text>
                            <Text text80 color={Colors.grey30}>
                                Test Sonucu
                            </Text>
                        </Card>
                    </View>

                    <Text text65 color={Colors.grey10} marginB-10>
                        Test Sonuçları
                    </Text>

                    {filteredData.map((item) => (
                        <Card key={item.id} style={styles.resultCard} enableShadow>
                            <View row spread>
                                <View>
                                    <Text text65 color={Colors.grey10} marginB-4>
                                        {item.patientName}
                                    </Text>
                                    <Text text80 color={Colors.grey30}>
                                        {item.testType}
                                    </Text>
                                </View>
                                <View right>
                                    <Text text80 color={Colors.primary} style={styles.resultText}>
                                        {item.results}
                                    </Text>
                                    <Text text90 color={Colors.grey30}>
                                        {item.testDate}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        width: width > 500 ? 500 : '100%',
        alignSelf: 'center',
    },
    searchCard: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey50,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        padding: 0,
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
        padding: 16,
        marginBottom: 12,
        backgroundColor: Colors.white,
        borderRadius: 12,
    },
    resultText: {
        fontWeight: '600',
    },
});

export default AdminPanel;