import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface TestResult {
    id: string;
    patientName: string;
    testDate: string;
    testType: string;
    results: string;
}

// Örnek veri
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

    const renderTestCard = ({ item }: { item: TestResult }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Hasta: {item.patientName}</Text>
            <Text style={styles.cardText}>Tarih: {item.testDate}</Text>
            <Text style={styles.cardText}>Tahlil Türü: {item.testType}</Text>
            <Text style={styles.cardText}>Sonuç: {item.results}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: "Admin Paneli",
                }}
            />
            
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Hasta Adı Soyadı"
                    value={searchName}
                    onChangeText={setSearchName}
                    placeholderTextColor={Colors.light.icon}
                />

                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Ara</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderTestCard}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    searchSection: {
        padding: 16,
    },
    input: {
        height: 50,
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.light.icon,
    },
    searchButton: {
        height: 50,
        backgroundColor: Colors.light.tint,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: Colors.light.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: Colors.light.background,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.light.icon,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 4,
    },
});

export default AdminPanel;