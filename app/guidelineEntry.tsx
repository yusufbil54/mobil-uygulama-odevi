import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Button, Colors, TextField, Card, Picker } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL, appStore } from '../store/appStore';

interface AgeRange {
    ageGroupStart: string;
    ageGroupEnd: string;
    geometricMean: string;
    standardDeviation: string;
    minValue: string;
    maxValue: string;
    confidenceMin: string;
    confidenceMax: string;
}

interface GuidelineForm {
    testName: string;
    testType: string;
    currentAgeRange: AgeRange;
    ageRanges: AgeRange[];
}

const AGE_GROUPS = [
    "0-30 days",
    "1-5 months",
    "6-8 months",
    "9-12 months",
    "13-24 months",
    "25-36 months",
    "37-48 months",
    "49-72 months",
    "7-8 years",
    "9-10 years",
    "11-12 years",
    "13-14 years",
    "15-16 years",
    "Older than 16 years"
];

const TEST_TYPES = [
    { label: 'IgA', value: 'IgA' },
    { label: 'IgM', value: 'IgM' },
    { label: 'IgG', value: 'IgG' },
    { label: 'IgG1', value: 'IgG1' },
    { label: 'IgG2', value: 'IgG2' },
    { label: 'IgG3', value: 'IgG3' },
    { label: 'IgG4', value: 'IgG4' },
];

const AGE_UNITS = [
    { label: 'Gün', value: 'days' },
    { label: 'Ay', value: 'months' },
    { label: 'Yıl', value: 'years' }
];

const GuidelineEntry = () => {
    const [form, setForm] = useState<GuidelineForm>({
        testName: '',
        testType: '',
        currentAgeRange: {
            ageGroupStart: '',
            ageGroupEnd: '',
            geometricMean: '',
            standardDeviation: '',
            minValue: '',
            maxValue: '',
            confidenceMin: '',
            confidenceMax: ''
        },
        ageRanges: []
    });

    const handleAddAgeRange = () => {
        if (!form.currentAgeRange.ageGroupStart || !form.currentAgeRange.ageGroupEnd) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Lütfen yaş aralığı seçin'
            });
            return;
        }

        setForm(prev => ({
            ...prev,
            ageRanges: [...prev.ageRanges, prev.currentAgeRange],
            currentAgeRange: {
                ageGroupStart: '',
                ageGroupEnd: '',
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
            if (form.ageRanges.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Hata',
                    text2: 'En az bir yaş aralığı ekleyin'
                });
                return;
            }

            const data = {
                name: form.testName,
                type: form.testType,
                ageRanges: form.ageRanges.map(range => ({
                    ...range,
                    geometricMean: Number(range.geometricMean),
                    standardDeviation: Number(range.standardDeviation),
                    minValue: Number(range.minValue),
                    maxValue: Number(range.maxValue),
                    confidenceMin: Number(range.confidenceMin),
                    confidenceMax: Number(range.confidenceMax)
                }))
            };

            const response = await axios.post(`${API_URL}/api/tests/add-guideline`, data, {
                headers: { Authorization: `Bearer ${appStore.token}` }
            });

            if (response.data.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Başarılı',
                    text2: 'Kılavuz başarıyla eklendi'
                });
                router.push('/admin-panel');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Kılavuz eklenirken bir hata oluştu'
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
                        Yeni Kılavuz Ekle
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <Card style={styles.formCard}>
                    <Picker
                        placeholder="Test Tipi Seçin"
                        value={form.testType}
                        onChange={(value: any) => setForm(prev => ({ ...prev, testType: String(value) }))}
                        style={styles.input}
                        marginB-20
                    >
                        {TEST_TYPES.map((type) => (
                            <Picker.Item key={type.value} value={type.value} label={type.label} />
                        ))}
                    </Picker>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>1. Yaş Aralığı</Text>
                        <View style={styles.rangeInputs}>
                            <TextField
                                placeholder="Başlangıç (ay)"
                                placeholderTextColor={Colors.grey40}
                                value={form.currentAgeRange.ageGroupStart}
                                onChangeText={(text) => setForm(prev => ({
                                    ...prev,
                                    currentAgeRange: { ...prev.currentAgeRange, ageGroupStart: text }
                                }))}
                                keyboardType="numeric"
                                style={[styles.input, styles.halfInput]}
                            />
                            <TextField
                                placeholder="Bitiş (ay)"
                                placeholderTextColor={Colors.grey40}
                                value={form.currentAgeRange.ageGroupEnd}
                                onChangeText={(text) => setForm(prev => ({
                                    ...prev,
                                    currentAgeRange: { ...prev.currentAgeRange, ageGroupEnd: text }
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

                    {form.ageRanges.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Eklenen Yaş Aralıkları</Text>
                            {form.ageRanges.map((range, index) => (
                                <View key={index} style={styles.addedRange}>
                                    <Text style={styles.rangeText}>
                                        {`${range.ageGroupStart}-${range.ageGroupEnd}`}
                                    </Text>
                                    <Text style={styles.rangeValues}>
                                        {`Ortalama: ${range.geometricMean} ± ${range.standardDeviation}`}
                                    </Text>
                                    <Text style={styles.rangeValues}>
                                        {`Min-Max: ${range.minValue}-${range.maxValue}`}
                                    </Text>
                                    <Text style={styles.rangeValues}>
                                        {`Güven Aralığı: [${range.confidenceMin}, ${range.confidenceMax}]`}
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
        minWidth: 150,
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
        gap: 25,
        width: '100%',
        alignItems: 'center',
    },
    referenceGroup: {
        marginBottom: 25,
        width: '100%',
        alignItems: 'center',
    },
    referenceTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.grey20,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        paddingLeft: 0,
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
        gap: 20,
        width: '90%',
        alignSelf: 'center',
    },
    halfInput: {
        width: 160,
        minWidth: 160,
        flex: 0,
        backgroundColor: Colors.white,
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
    }
});

export default GuidelineEntry; 