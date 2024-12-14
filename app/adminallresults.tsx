import React from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Colors } from 'react-native-ui-lib';
import { Stack } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
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

const AdminAllResults = () => {
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
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {mockData.map((item) => {
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
});

export default AdminAllResults;
