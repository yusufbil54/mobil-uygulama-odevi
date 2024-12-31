import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Button, Colors, TextField, Card, Picker } from 'react-native-ui-lib';
import { Stack, useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL, appStore } from '../store/appStore';
import { observer } from 'mobx-react';

interface Test {
    _id: string;
    name: string;
    type: string;
}

const { width } = Dimensions.get('window');

const TestResultDisplay = ({ results, testTypes }: { results: any, testTypes: Test[] }) => {
    if (!results?.data) return null;

    const { data: testResult } = results;
    const testType = testTypes.find(test => test._id === testResult.testType);

    return (
        <Card style={styles.resultCard}>
            <Text style={styles.resultTitle}>Test Sonuçları</Text>
            
            <View style={styles.resultRow}>
                <Text style={styles.labelText}>Test Tipi:</Text>
                <Text style={styles.valueText}>
                    {testType ? `${testType.name} (${testType.type})` : 'Bilinmiyor'}
                </Text>
            </View>

            <View style={styles.resultRow}>
                <Text style={styles.labelText}>Test Değeri:</Text>
                <Text style={styles.valueText}>{testResult.value} g/L</Text>
            </View>

            {testResult.guidelineResults?.map((result: any, index: number) => (
                <View key={index} style={styles.guidelineSection}>
                    <Text style={styles.sectionTitle}>{result.guidelineSource} Kılavuzu</Text>
                    
                    <View style={styles.resultRow}>
                        <Text style={styles.labelText}>Sonuç:</Text>
                        <Text style={[
                            styles.valueText,
                            result.resultStatus === 'Normal' ? styles.normalStatus :
                            result.resultStatus === 'Düşük' ? styles.lowStatus : 
                            styles.highStatus
                        ]}>
                            {result.resultStatus}
                        </Text>
                    </View>

                    {result.referenceRange && (
                        <View style={styles.resultRow}>
                            <Text style={styles.labelText}>Referans Aralığı:</Text>
                            <Text style={styles.valueText}>
                                {result.referenceRange.min} - {result.referenceRange.max} g/L
                            </Text>
                        </View>
                    )}

                    {result.referenceRange?.ageRange && (
                        <View style={styles.resultRow}>
                            <Text style={styles.labelText}>Yaş Aralığı:</Text>
                            <Text style={styles.valueText}>
                                {result.referenceRange.ageRange.startValue} {result.referenceRange.ageRange.startUnit} - {' '}
                                {result.referenceRange.ageRange.endValue} {result.referenceRange.ageRange.endUnit}
                            </Text>
                        </View>
                    )}
                </View>
            ))}

            {testResult.patientAge && (
                <View style={styles.patientSection}>
                    <Text style={styles.sectionTitle}>Hasta Bilgileri</Text>
                    <View style={styles.resultRow}>
                        <Text style={styles.labelText}>Yaş:</Text>
                        <Text style={styles.valueText}>
                            {testResult.patientAge.years} yıl {testResult.patientAge.months} ay {testResult.patientAge.days} gün
                        </Text>
                    </View>
                </View>
            )}
        </Card>
    );
};

const TestEntry = () => {
    const router = useRouter();
    const [tests, setTests] = useState<Test[]>([]);
    const [newTest, setNewTest] = useState({
        patientName: '',
        patientTc: '',
        birthDate: '',
        testType: '',
        value: '',
    });
    const [calculatedResults, setCalculatedResults] = useState<any>(null);
    const [guidelines, setGuidelines] = useState<any[]>([]);
    const [testTypes, setTestTypes] = useState<Test[]>([]);

    const fetchGuidelines = async () => {
        const response = await axios.get(`${API_URL}/api/guidelines/all`, {
            headers: { Authorization: `Bearer ${appStore.token}` }
        });
        setGuidelines(response.data.data);
    };

    const fetchTestTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tests/types`, {
                headers: { Authorization: `Bearer ${appStore.token}` }
            });
            if (response.data.success) {
                setTestTypes(response.data.data);
            }
        } catch (error) {
            console.error('Test tipleri getirme hatası:', error);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Test tipleri yüklenirken bir hata oluştu'
            });
        }
    };

    useEffect(() => {
        fetchTestTypes();
        fetchGuidelines();
    }, []);

    const handleCalculate = async () => {
        try {
            const testData = {
                patientName: newTest.patientName,
                patientTc: newTest.patientTc,
                birthDate: newTest.birthDate,
                testType: newTest.testType,
                value: parseFloat(newTest.value)
            };
            const response = await axios.post(`${API_URL}/api/tests/calculate`, testData, {
                headers: { Authorization: `Bearer ${appStore.token}` }
            });

            if (response.data.success) {
                setCalculatedResults(response.data);
                Toast.show({
                    type: 'success',
                    text1: 'Hesaplama Başarılı',
                    text2: 'Test sonuçları hesaplandı'
                });
            }
        } catch (error: any) {
            console.error('Hesaplama hatası:', error.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: error.response?.data?.message || 'Hesaplama sırasında bir hata oluştu'
            });
        }
    };

    const handleSave = async () => {
        try {
            // Debug için veriyi kontrol et
            console.log('Gönderilecek test verisi:', {
                patientTc: newTest.patientTc,
                testType: newTest.testType,
                value: parseFloat(newTest.value),
                results: calculatedResults
            });

            const testData = {
                patientTc: newTest.patientTc,
                testType: newTest.testType,
                value: parseFloat(newTest.value),
                results: calculatedResults
            };

            // Token'ı kontrol et
            console.log('Token:', appStore.token);

            const response = await axios.post(`${API_URL}/api/tests/add`, testData, {
                headers: {
                    Authorization: `Bearer ${appStore.token}`
                }
            });

            // Response'u kontrol et
            console.log('API Response:', response.data);

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Başarılı',
                    text2: 'Test sonucu kaydedildi'
                });
                router.push('/admin-panel');
            }
        } catch (error: any) {
            // Hata detaylarını göster
            console.error('Test kayıt hatası:', error.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: error.response?.data?.message || 'Test kaydedilirken bir hata oluştu'
            });
        }
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
                        value={newTest.patientTc}
                        onChangeText={(text) => setNewTest({ ...newTest, patientTc: text })}
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
                    <Picker
                        value={newTest.testType}
                        onChange={(value: any) => setNewTest(prev => ({
                            ...prev,
                            testType: String(value)
                        }))}
                        style={styles.input}
                        marginB-20
                        placeholder="Test Tipi Seçin"
                        showSearch
                        searchPlaceholder="Test Ara..."
                        searchStyle={styles.pickerSearch}
                        enableModalBlur={false}
                        useDialog={false}
                        containerStyle={styles.pickerDropdown}
                        renderPicker={() => {
                            const selectedTest = testTypes.find(test => test._id === newTest.testType);
                            return (
                                <View style={styles.pickerContainer}>
                                    <Text style={styles.pickerText}>
                                        {selectedTest ? `${selectedTest.name} (${selectedTest.type})` : "Test Tipi Seçin"}
                                    </Text>
                                    <MaterialIcons name="arrow-drop-down" size={24} color={Colors.grey30} />
                                </View>
                            );
                        }}
                    >
                        {testTypes.map((test) => (
                            <Picker.Item 
                                key={test._id} 
                                value={test._id} 
                                label={`${test.name} (${test.type})`}
                            />
                        ))}
                    </Picker>
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
                        <Button
                            label="Yeni Hesaplama"
                            onPress={() => {
                                setCalculatedResults(null);
                                setNewTest({
                                    patientName: '',
                                    patientTc: '',
                                    birthDate: '',
                                    testType: '',
                                    value: '',
                                });
                            }}
                            backgroundColor={Colors.blue30}
                        />
                    )}
                </Card>

                {/* Sonuçları göster */}
                <TestResultDisplay 
                    results={calculatedResults} 
                    testTypes={testTypes}
                />
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
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.grey10,
        marginBottom: 20,
        textAlign: 'center',
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey60,
    },
    labelText: {
        fontSize: 16,
        color: Colors.grey20,
    },
    valueText: {
        fontSize: 16,
        color: Colors.grey10,
        fontWeight: '500',
    },
    normalStatus: {
        color: Colors.green30,
        fontWeight: 'bold',
    },
    lowStatus: {
        color: Colors.red30,
        fontWeight: 'bold',
    },
    highStatus: {
        color: Colors.orange30,
        fontWeight: 'bold',
    },
    referenceSection: {
        marginTop: 20,
    },
    patientSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.grey10,
        marginBottom: 10,
    },
    pickerField: {
        paddingVertical: 8,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: Colors.grey50,
        borderRadius: 8,
        backgroundColor: Colors.white,
    },
    pickerText: {
        fontSize: 16,
        color: Colors.grey10,
    },
    pickerSearch: {
        color: Colors.grey10,
        paddingHorizontal: 12,
        height: 40,
        backgroundColor: Colors.grey70,
        borderRadius: 8,
    },
    pickerDropdown: {
        maxHeight: 200,
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey50,
        marginTop: 4,
    },
    input: {
        width: '100%',
        minWidth: 100,
        borderWidth: 1,
        borderColor: Colors.grey50,
        borderRadius: 8,
        padding: 15,
        height: 55,
        backgroundColor: Colors.white,
        fontSize: 16,
        color: Colors.black,
        marginBottom: 15,
    },
});

export default observer(TestEntry);
