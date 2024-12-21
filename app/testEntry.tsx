import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Button, Colors, TextField, Card } from 'react-native-ui-lib';
import { Stack, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TestEntry = () => {
    const router = useRouter();
    const [testResults, setTestResults] = useState([]); // Geçici olarak test sonuçlarını burada tutacağız
    const [newTest, setNewTest] = useState({
        patientName: '',
        birthDate: '',
        testType: '',
        value: '',
    });
    const [calculatedResult, setCalculatedResult] = useState<string | null>(null); // Hesaplanan sonucu tutar

    const handleCalculate = () => {
        const value = parseFloat(newTest.value);

        // Test değerine göre hesaplama yapılır
        let result = '';
        if (value < 50) {
            result = 'Düşük';
        } else if (value >= 50 && value <= 100) {
            result = 'Normal';
        } else {
            result = 'Yüksek';
        }
        setCalculatedResult(result);
    };

    const handleSave = () => {
        const newTestResult = {
            id: Date.now().toString(), // Benzersiz bir ID oluştur
            ...newTest,
            value: parseFloat(newTest.value), // Değeri sayıya çevir
            result: calculatedResult, // Hesaplanan sonucu ekle
        };

        // Veriyi sıfırla
        setNewTest({
            patientName: '',
            birthDate: '',
            testType: '',
            value: '',
        });
        setCalculatedResult(null);

        // Admin paneline dön
        router.push('/admin-panel');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: true, title: 'Yeni Test Ekle' }} />
            <ScrollView style={styles.scrollView}>
                <Card style={styles.formCard}>
                    <TextField
                        placeholder="Hasta Adı Soyadı"
                        value={newTest.patientName}
                        onChangeText={(text) => setNewTest({ ...newTest, patientName: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="Doğum Tarihi (YYYY-MM-DD)"
                        value={newTest.birthDate}
                        onChangeText={(text) => setNewTest({ ...newTest, birthDate: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="Tetkik Adı"
                        value={newTest.testType}
                        onChangeText={(text) => setNewTest({ ...newTest, testType: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="Test Değeri"
                        value={newTest.value}
                        onChangeText={(text) => setNewTest({ ...newTest, value: text })}
                        keyboardType="numeric"
                        marginB-12
                        style={styles.inputField}
                    />
                    {!calculatedResult ? (
                        <Button
                            label="Hesapla"
                            onPress={handleCalculate}
                            backgroundColor={Colors.blue30}
                            borderRadius={8}
                            marginT-12
                        />
                    ) : (
                        <>
                            <View style={styles.resultCard}>
                                <Text style={styles.resultText}>
                                    Hesaplanan Sonuç: <Text style={styles.resultValue}>{calculatedResult}</Text>
                                </Text>
                            </View>
                            <Button
                                label="Kaydet"
                                onPress={handleSave}
                                backgroundColor={Colors.green30}
                                borderRadius={8}
                                marginT-12
                            />
                            <Button
                                label="Vazgeç"
                                onPress={() => router.push('/admin-panel')}
                                link
                                labelStyle={{ color: Colors.red30 }}
                                marginT-12
                            />
                        </>
                    )}
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: Colors.grey70 },
    scrollView: { flex: 1 },
    formCard: {
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 20,
    },
    inputField: {
        height: 50,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey50,
        fontSize: 16,
    },
    resultCard: {
        padding: 16,
        backgroundColor: Colors.grey80,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: { fontSize: 18, fontWeight: 'bold' },
    resultValue: { color: Colors.blue30, fontSize: 18, fontWeight: 'bold' },
});

export default TestEntry;
