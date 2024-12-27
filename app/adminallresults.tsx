import React from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';
import { Stack } from 'expo-router';
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
}

const mockData: TestResult[] = [
    {
        id: '1',
        patientName: 'Ahmet Yılmaz',
        testDate: '2024-01-10',
        testType: 'IgA',
        value: 450,
        referenceRange: { min: 70, max: 400 }
    },
    {
        id: '2',
        patientName: 'Ayşe Demir',
        testDate: '2024-01-15',
        testType: 'IgM',
        value: 120,
        referenceRange: { min: 40, max: 230 }
    },
    {
        id: '3',
        patientName: 'Mehmet Kaya',
        testDate: '2024-01-12',
        testType: 'IgG',
        value: 550,
        referenceRange: { min: 700, max: 1600 }
    },
    {
        id: '4',
        patientName: 'Zeynep Yıldız',
        testDate: '2024-01-14',
        testType: 'IgG1',
        value: 500,
        referenceRange: { min: 380, max: 930 }
    },
    {
        id: '5',
        patientName: 'Ali Öztürk',
        testDate: '2024-01-13',
        testType: 'IgG2',
        value: 850,
        referenceRange: { min: 240, max: 700 }
    },
    {
        id: '6',
        patientName: 'Fatma Şahin',
        testDate: '2024-01-11',
        testType: 'IgG3',
        value: 55,
        referenceRange: { min: 20, max: 110 }
    },
    {
        id: '7',
        patientName: 'Mustafa Demir',
        testDate: '2024-01-16',
        testType: 'IgG4',
        value: 10,
        referenceRange: { min: 30, max: 200 }
    },
];

interface TestResultCardProps {
    item: TestResult;
}

const AdminAllResults = () => {
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
                    {getResultIcon('normal')}
                </View>
                <View style={styles.guidelineRow}>
                    <Text style={styles.guidelineLabel}>Avrupa</Text>
                    {getResultIcon('yüksek')}
                </View>
                <View style={styles.guidelineRow}>
                    <Text style={styles.guidelineLabel}>Amerika</Text>
                    {getResultIcon('düşük')}
                </View>
                <View style={styles.guidelineRow}>
                    <Text style={styles.guidelineLabel}>Asya</Text>
                    {getResultIcon('normal')}
                </View>
                <View style={styles.guidelineRow}>
                    <Text style={styles.guidelineLabel}>Türkiye</Text>
                    {getResultIcon('yüksek')}
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View row centerV>
                    <AntDesign 
                        name="arrowleft" 
                        size={24} 
                        color={Colors.primary} 
                        onPress={() => router.push('/admin-panel')}
                        style={styles.backButton}
                    />
                    <Text text50 color={Colors.grey10}>
                        Tüm Test Sonuçları
                    </Text>
                </View>
            </View>
            
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {mockData.map((item) => (
                        <TestResultCard key={item.id} item={item} />
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        width: width > 500 ? 500 : '100%',
        alignSelf: 'center',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.white,
    },
    backButton: {
        marginRight: 10,
    },
    resultCard: {
        padding: 16,
        marginBottom: 12,
        backgroundColor: Colors.white,
        borderRadius: 12,
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

export default AdminAllResults;
