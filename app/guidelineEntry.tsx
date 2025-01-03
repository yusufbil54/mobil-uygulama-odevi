import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Button, Colors, TextField, Card, Picker } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL, appStore } from '../store/appStore';

interface AgeRange {
    startValue: number;
    startUnit: 'day' | 'month' | 'year';
    endValue: number;
    endUnit: 'day' | 'month' | 'year';
    isEndInclusive: boolean;
    geometricMean: number;
    standardDeviation: number;
    minValue: number;
    maxValue: number;
    confidenceMin: number;
    confidenceMax: number;
}

interface GuidelineForm {
    name: string;
    currentAgeRange: {
        testType: string;
        startValue: string;
        startUnit: 'day' | 'month' | 'year';
        endValue: string;
        endUnit: 'day' | 'month' | 'year';
        isEndInclusive: boolean;
        geometricMean: string;
        standardDeviation: string;
        minValue: string;
        maxValue: string;
        confidenceMin: string;
        confidenceMax: string;
    };
    testTypes: Array<{
        type: string;
        ageRanges: AgeRange[];
    }>;
}


const GuidelineEntry = () => {
    const [form, setForm] = useState<GuidelineForm>({
        name: '',
        currentAgeRange: {
            testType: '',
            startValue: '',
            startUnit: 'month',
            endValue: '',
            endUnit: 'month',
            isEndInclusive: false,
            geometricMean: '',
            standardDeviation: '',
            minValue: '',
            maxValue: '',
            confidenceMin: '',
            confidenceMax: ''
        },
        testTypes: []
    });

    const [testTypes, setTestTypes] = useState<Array<{label: string, value: string}>>([]);
    
    // Test tiplerini yükle
    useEffect(() => {
        const fetchTestTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/tests/types`, {
                    headers: { Authorization: `Bearer ${appStore.token}` }
                });
                if (response.data) {
                    const types = response.data.data
                    setTestTypes(types);
                }
            } catch (error) {
                console.error('Test tipleri yüklenirken hata:', error);
            }
        };

        fetchTestTypes();
    }, []);

    const handleAddAgeRange = () => {
        if (!form.currentAgeRange.testType || !form.currentAgeRange.startValue || !form.currentAgeRange.endValue) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Lütfen test tipi ve yaş aralığı seçin'
            });
            return;
        }

        const newAgeRange: AgeRange = {
            startValue: Number(form.currentAgeRange.startValue),
            startUnit: form.currentAgeRange.startUnit,
            endValue: Number(form.currentAgeRange.endValue),
            endUnit: form.currentAgeRange.endUnit,
            isEndInclusive: form.currentAgeRange.isEndInclusive,
            geometricMean: Number(form.currentAgeRange.geometricMean),
            standardDeviation: Number(form.currentAgeRange.standardDeviation),
            minValue: Number(form.currentAgeRange.minValue),
            maxValue: Number(form.currentAgeRange.maxValue),
            confidenceMin: Number(form.currentAgeRange.confidenceMin),
            confidenceMax: Number(form.currentAgeRange.confidenceMax)
        };

        setForm(prev => {
            const testTypeIndex = prev.testTypes.findIndex(t => t.type === prev.currentAgeRange.testType);
            
            if (testTypeIndex === -1) {
                // Yeni test tipi ekle
                return {
                    ...prev,
                    testTypes: [...prev.testTypes, {
                        type: prev.currentAgeRange.testType,
                        ageRanges: [newAgeRange]
                    }]
                };
            } else {
                // Mevcut test tipine yaş aralığı ekle
                const updatedTestTypes = [...prev.testTypes];
                updatedTestTypes[testTypeIndex].ageRanges.push(newAgeRange);
                return {
                    ...prev,
                    testTypes: updatedTestTypes
                };
            }
        });

        // Form alanlarını temizle
        setForm(prev => ({
            ...prev,
            currentAgeRange: {
                ...prev.currentAgeRange,
                startValue: '',
                endValue: '',
                geometricMean: '',
                standardDeviation: '',
                minValue: '',
                maxValue: '',
                confidenceMin: '',
                confidenceMax: ''
            }
        }));
    };

    const handleSave = async () => {
        try {
            if (!form.name) {
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'Lütfen kılavuz adı girin'
                });
                return;
            }

            if (form.ageRanges.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'En az bir yaş aralığı ekleyin'
                });
                return;
            }

            const response = await axios.post(`${API_URL}/api/guidelines/add`, {
                name: form.name,
                ageRanges: form.ageRanges
            }, {
                headers: { 
                    Authorization: `Bearer ${appStore.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Başarılı',
                    text2: 'Kılavuz başarıyla eklendi'
                });
                router.push('/admin-panel');
            }
        } catch (error: any) {
            console.error('Klavuz kayıt hatası:', error.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: error.response?.data?.message || 'Kılavuz eklenirken bir hata oluştu'
            });
        }
    };

    console.log(form.currentAgeRange.testType);
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
                        Yeni Kılavuz Ekle
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <Card style={styles.formCard}>
                    <TextField
                        placeholder="Kılavuz Adı"
                        placeholderTextColor={Colors.grey40}
                        value={form.name}
                        onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                        style={styles.input}
                        marginB-20
                    />

                    <Picker
                        value={form.currentAgeRange.testType}
                        onChange={(value: any) => setForm(prev => ({
                            ...prev,
                            currentAgeRange: { ...prev.currentAgeRange, testType: String(value) }
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
                            const selectedTest = testTypes.find(test => test._id === form.currentAgeRange.testType);
                            return (
                                <View style={styles.pickerContainer}>
                                    <Text style={styles.pickerText}>
                                        {selectedTest ? selectedTest.name : "Test Tipi Seçin"}
                                    </Text>
                                    <MaterialIcons name="arrow-drop-down" size={24} color={Colors.grey30} />
                                </View>
                            );
                        }}
                    >
                        {testTypes.map((type: any) => (
                            <Picker.Item key={type._id} value={type._id} label={type.name} />
                        ))}
                    </Picker>
                    

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>1. Yaş Aralığı</Text>
                        <View style={styles.rangeInputs}>
                            <TextField
                                placeholder="Başlangıç (ay)"
                                placeholderTextColor={Colors.grey40}
                                value={form.currentAgeRange.startValue}
                                onChangeText={(text) => setForm(prev => ({
                                    ...prev,
                                    currentAgeRange: { ...prev.currentAgeRange, startValue: text }
                                }))}
                                keyboardType="numeric"
                                style={[styles.input, styles.halfInput]}
                            />
                            <TextField
                                placeholder="Bitiş (ay)"
                                placeholderTextColor={Colors.grey40}
                                value={form.currentAgeRange.endValue}
                                onChangeText={(text) => setForm(prev => ({
                                    ...prev,
                                    currentAgeRange: { ...prev.currentAgeRange, endValue: text }
                                }))}
                                keyboardType="numeric"
                                style={[styles.input, styles.halfInput]}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>2. Referans Değerleri</Text>
                        <View style={styles.referenceContainer}>
                            <View style={styles.referenceGroup}>
                                <Text style={styles.referenceTitle}>Geometrik Ortalama ± SD</Text>
                                <View style={styles.rangeInputs}>
                                    <TextField
                                        placeholder="Ortalama"
                                        placeholderTextColor={Colors.grey40}
                                        value={form.currentAgeRange.geometricMean}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            currentAgeRange: { ...prev.currentAgeRange, geometricMean: text }
                                        }))}
                                        keyboardType="numeric"
                                        style={[styles.input, styles.halfInput]}
                                    />
                                    <TextField
                                        placeholder="SD"
                                        placeholderTextColor={Colors.grey40}
                                        value={form.currentAgeRange.standardDeviation}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            currentAgeRange: { ...prev.currentAgeRange, standardDeviation: text }
                                        }))}
                                        keyboardType="numeric"
                                        style={[styles.input, styles.halfInput]}
                                    />
                                </View>
                            </View>

                            <View style={styles.referenceGroup}>
                                <Text style={styles.referenceTitle}>Min-Max Aralığı</Text>
                                <View style={styles.rangeInputs}>
                                    <TextField
                                        placeholder="Min"
                                        placeholderTextColor={Colors.grey40}
                                        value={form.currentAgeRange.minValue}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            currentAgeRange: { ...prev.currentAgeRange, minValue: text }
                                        }))}
                                        keyboardType="numeric"
                                        style={[styles.input, styles.halfInput]}
                                    />
                                    <TextField
                                        placeholder="Max"
                                        placeholderTextColor={Colors.grey40}
                                        value={form.currentAgeRange.maxValue}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            currentAgeRange: { ...prev.currentAgeRange, maxValue: text }
                                        }))}
                                        keyboardType="numeric"
                                        style={[styles.input, styles.halfInput]}
                                    />
                                </View>
                            </View>

                            <View style={styles.referenceGroup}>
                                <Text style={styles.referenceTitle}>95% Güven Aralığı</Text>
                                <View style={styles.rangeInputs}>
                                    <TextField
                                        placeholder="Alt Sınır"
                                        placeholderTextColor={Colors.grey40}
                                        value={form.currentAgeRange.confidenceMin}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            currentAgeRange: { ...prev.currentAgeRange, confidenceMin: text }
                                        }))}
                                        keyboardType="numeric"
                                        style={[styles.input, styles.halfInput]}
                                    />
                                    <TextField
                                        placeholder="Üst Sınır"
                                        placeholderTextColor={Colors.grey40}
                                        value={form.currentAgeRange.confidenceMax}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            currentAgeRange: { ...prev.currentAgeRange, confidenceMax: text }
                                        }))}
                                        keyboardType="numeric"
                                        style={[styles.input, styles.halfInput]}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <Button
                        label="Yaş Aralığı Ekle"
                        onPress={handleAddAgeRange}
                        backgroundColor={Colors.blue30}
                        marginT-20
                    />

                    {form.testTypes.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Eklenen Yaş Aralıkları</Text>
                            {form.testTypes.map((test, testIndex) => (
                                <View key={testIndex} style={styles.addedRange}>
                                    <Text style={styles.rangeText}>
                                        {`${test.ageRanges[0].startValue}-${test.ageRanges[0].endValue}`}
                                    </Text>
                                    <Text style={styles.rangeValues}>
                                        {`Ortalama: ${test.ageRanges[0].geometricMean} ± ${test.ageRanges[0].standardDeviation}`}
                                    </Text>
                                    <Text style={styles.rangeValues}>
                                        {`Min-Max: ${test.ageRanges[0].minValue}-${test.ageRanges[0].maxValue}`}
                                    </Text>
                                    <Text style={styles.rangeValues}>
                                        {`Güven Aralığı: [${test.ageRanges[0].confidenceMin}, ${test.ageRanges[0].confidenceMax}]`}
                                    </Text>
                                </View>
                            ))}
                        </>
                    )}

                    <Button
                        label="Kılavuzu Kaydet"
                        onPress={handleSave}
                        backgroundColor={Colors.green30}
                        marginT-20
                    />
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
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: Colors.white,
    },
    backButton: {
        marginRight: 10,
    },
    scrollView: {
        flex: 1,
    },
    formCard: {
        padding: 20,
        margin: 20,
        backgroundColor: Colors.white,
        width: '90%',
        alignSelf: 'center',
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
    section: {
        marginBottom: 25,
        padding: 25,
        backgroundColor: Colors.grey70,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    referenceContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    referenceGroup: {
        width: '100%',
        marginBottom: 25,
        alignItems: 'center',
    },
    referenceTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.grey20,
        marginBottom: 10,
        width: '100%',
        textAlign: 'left',
        paddingLeft: 5,
        //alignSelf: 'center',

    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.grey10,
        marginBottom: 20,
    },
    rangeInputs: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
    },
    halfInput: {
        width: 140,
        minWidth: 140,
        flex: 0,
        backgroundColor: Colors.white,
        marginHorizontal: 5,
    },
    addedRange: {
        padding: 10,
        backgroundColor: Colors.grey70,
        borderRadius: 8,
        marginBottom: 10,
    },
    rangeText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.grey10,
        marginBottom: 5,
    },
    rangeValues: {
        fontSize: 12,
        color: Colors.grey20,
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
});

export default GuidelineEntry; 