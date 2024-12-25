import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Button, Colors, TextField, Card } from 'react-native-ui-lib';
import { Stack, useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

const TestEntry = () => {
    const router = useRouter();
    const [newTest, setNewTest] = useState({
        patientName: '',
        patientTc: '',
        birthDate: '',
        testType: '',
        value: '',
    });
    const [calculatedResults, setCalculatedResults] = useState<any>(null);

    const handleCalculate = () => {
        const value = parseFloat(newTest.value);

        // 5 farklı kılavuza göre değerlendirme
        const results = {
            who: value < 50 ? 'Düşük' : value <= 100 ? 'Normal' : 'Yüksek',
            europe: value < 45 ? 'Düşük' : value <= 95 ? 'Normal' : 'Yüksek',
            america: value < 55 ? 'Düşük' : value <= 105 ? 'Normal' : 'Yüksek',
            asia: value < 40 ? 'Düşük' : value <= 90 ? 'Normal' : 'Yüksek',
            turkey: value < 52 ? 'Düşük' : value <= 98 ? 'Normal' : 'Yüksek',
        };

        setCalculatedResults(results);
    };

    const handleSave = () => {
        const newTestResult = {
            id: Date.now().toString(), // Benzersiz bir ID oluştur
            ...newTest,
            value: parseFloat(newTest.value), // Değeri sayıya çevir
            result: calculatedResults, // Hesaplanan sonucu ekle
        };

        // Veriyi sıfırla
        setNewTest({
            patientName: '',
            patientTc: '',
            birthDate: '',
            testType: '',
            value: '',
        });
        setCalculatedResults(null);

        // Admin paneline dön
        router.push('/admin-panel');
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
                        Yeni Test Ekle
                    </Text>
                </View>
            </View>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.formCard}>
                    <TextField
                        placeholder="Hasta Adı Soyadı"
                        placeholderTextColor={Colors.grey40}
                        value={newTest.patientName}
                        onChangeText={(text) => setNewTest({ ...newTest, patientName: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="TC Kimlik No"
                        placeholderTextColor={Colors.grey40}
                        value={newTest.patientName}
                        onChangeText={(text) => setNewTest({ ...newTest, patientName: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="Doğum Tarihi (YYYY-MM-DD)"
                        value={newTest.birthDate}
                        placeholderTextColor={Colors.grey40} 
                        onChangeText={(text) => setNewTest({ ...newTest, birthDate: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="Tetkik Adı"
                        value={newTest.testType}
                        placeholderTextColor={Colors.grey40} 
                        onChangeText={(text) => setNewTest({ ...newTest, testType: text })}
                        marginB-12
                        style={styles.inputField}
                    />
                    <TextField
                        placeholder="Test Değeri"
                        value={newTest.value}
                        placeholderTextColor={Colors.grey40} 
                        onChangeText={(text) => setNewTest({ ...newTest, value: text })}
                        keyboardType="numeric"
                        marginB-12
                        style={styles.inputField}
                    />
                    {!calculatedResults ? (
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
                                <Text style={styles.resultTitle}>Kılavuzlara Göre Sonuçlar:</Text>
                                <View style={styles.resultRow}>
                                    <Text style={styles.guidelineText}>WHO Kılavuzu:</Text>
                                    <Text style={[styles.resultValue, { marginLeft: 10 }]}>{calculatedResults.who}</Text>
                                </View>
                                <View style={styles.resultRow}>
                                    <Text style={styles.guidelineText}>Avrupa Kılavuzu:</Text>
                                    <Text style={[styles.resultValue, { marginLeft: 10 }]}>{calculatedResults.europe}</Text>
                                </View>
                                <View style={styles.resultRow}>
                                    <Text style={styles.guidelineText}>Amerika Kılavuzu:</Text>
                                    <Text style={[styles.resultValue, { marginLeft: 10 }]}>{calculatedResults.america}</Text>
                                </View>
                                <View style={styles.resultRow}>
                                    <Text style={styles.guidelineText}>Asya Kılavuzu:</Text>
                                    <Text style={[styles.resultValue, { marginLeft: 10 }]}>{calculatedResults.asia}</Text>
                                </View>
                                <View style={styles.resultRow}>
                                    <Text style={styles.guidelineText}>Türkiye Kılavuzu:</Text>
                                    <Text style={[styles.resultValue, { marginLeft: 10 }]}>{calculatedResults.turkey}</Text>
                                </View>
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
    container: { 
        flex: 1,
        backgroundColor: Colors.grey70,
     },
    scrollView: { flex: 1 },
    formCard: {
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 20,
        marginTop: 20,
    },
    inputField: {
        height: 50,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey50,
        fontSize: 16,
    },
    backButton: {
        marginRight: 10,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.white,
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
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.grey10,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey60,
        width: '100%',
    },
    guidelineText: {
        fontSize: 16,
        color: Colors.grey20,
    },
});

export default TestEntry;
