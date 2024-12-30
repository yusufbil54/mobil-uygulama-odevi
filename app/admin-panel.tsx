import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Button, Colors, TextField, Picker } from 'react-native-ui-lib';
import { Stack, router } from 'expo-router';
import { AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL, appStore } from '../store/appStore';

const { width } = Dimensions.get('window');
interface Test {
    _id: string;
    name: string;
    type: string;
}
const AdminPanel = () => {
    const [tc, setTc] = useState('');
    const [tests, setTests] = useState<Test[]>([]);
    const [selectedTest, setSelectedTest] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Test tiplerini yükle
    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tests/all-tests`, {
                headers: {
                    Authorization: `Bearer ${appStore.token}`
                }
            });
            setTests(response.data.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Test tipleri yüklenirken bir hata oluştu'
            });
        }
    };

    const handleSearch = async () => {
        if (tc.length !== 11) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: 'Geçerli bir TC kimlik numarası girin'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/tests/user-tests/tc/${tc}`, {
                headers: { Authorization: `Bearer ${appStore.token}` }
            });

            if (response.data.success) {
                let results = response.data.data;
                
                // Seçili test tipine göre filtrele
                if (selectedTest) {
                    results = results.filter((test: any) => test.testType?._id === selectedTest);
                }

                setSearchResults(results);
                
                if (results.length === 0) {
                    const selectedTestName = tests.find(t => t._id === selectedTest)?.name;
                    Toast.show({
                        type: 'info',
                        text1: 'Bilgi',
                        text2: selectedTest 
                            ? `Bu TC numarasına ait ${selectedTestName} sonucu bulunamadı`
                            : 'Bu TC numarasına ait test sonucu bulunamadı'
                    });
                }
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Hata',
                text2: error.response?.data?.message || 'Hasta bulunamadı'
            });
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
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

            <ScrollView style={styles.scrollView}>
                {/* Ana İşlemler */}
                <View style={styles.mainActions}>
                    <Card 
                        style={styles.mainActionCard} 
                        onPress={() => router.push('/testEntry')}
                    >
                        <View style={styles.actionIconContainer}>
                            <FontAwesome5 name="notes-medical" size={28} color={Colors.blue30} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text text65 color={Colors.grey20}>Test Sonucu Ekle</Text>
                            <Text text90 color={Colors.grey40}>Yeni test sonucu kaydı oluştur</Text>
                        </View>
                        <AntDesign name="right" size={20} color={Colors.grey40} />
                    </Card>

                    <Card 
                        style={styles.mainActionCard}
                        onPress={() => router.push('/guidelineEntry')}
                    >
                        <View style={styles.actionIconContainer}>
                            <FontAwesome5 name="book-medical" size={28} color={Colors.purple30} />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text text65 color={Colors.grey20}>Kılavuz Ekle</Text>
                            <Text text90 color={Colors.grey40}>Yeni referans değerleri ekle</Text>
                        </View>
                        <AntDesign name="right" size={20} color={Colors.grey40} />
                    </Card>
                </View>

                {/* Hasta Arama Bölümü */}
                <Card style={styles.searchCard}>
                    <View row centerV marginB-15>
                        <AntDesign name="search1" size={24} color={Colors.primary} style={styles.searchIcon} />
                        <Text text65 color={Colors.grey20}>Hasta Ara</Text>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextField
                            placeholder="TC Kimlik No"
                            placeholderTextColor={Colors.grey40}
                            value={tc}
                            onChangeText={setTc}
                            style={styles.searchInput}
                            maxLength={11}
                            keyboardType="numeric"
                        />
                        <Picker
                            value={selectedTest}
                            onChange={(value: any) => value && setSelectedTest(value)}
                            style={styles.testTypePicker}
                            placeholder="Test Seçin (Opsiyonel)"
                            showSearch
                            searchPlaceholder="Test Ara..."
                            searchStyle={styles.pickerSearch}
                            enableModalBlur={false}
                            useDialog={false}
                            renderPicker={() => {
                                const selected = tests.find(test => test._id === selectedTest);
                                return (
                                    <View style={styles.pickerContainer}>
                                        <Text style={styles.pickerText}>
                                            {selected ? selected.name : "Test Seçin"}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color={Colors.grey30} />
                                    </View>
                                );
                            }}
                        >
                            <Picker.Item key="all" value="" label="Tüm Testler" />
                            {tests.map((test) => (
                                <Picker.Item 
                                    key={test._id} 
                                    value={test._id} 
                                    label={test.name}
                                />
                            ))}
                        </Picker>
                        <Button
                            label={loading ? "Aranıyor..." : "Ara"}
                            size={Button.sizes.medium}
                            backgroundColor={Colors.primary}
                            disabled={loading || tc.length !== 11}
                            onPress={handleSearch}
                            style={styles.searchButton}
                        />
                    </View>

                    {searchResults.length > 0 && (
                        <View marginT-20>
                            <Text text65 color={Colors.grey20} marginB-10>
                                Test Sonuçları ({searchResults.length})
                            </Text>
                            {searchResults.map((test, index) => (
                                <Card key={index} style={styles.resultCard}>
                                    <View row spread centerV>
                                        <View>
                                            <Text text70 color={Colors.grey20} marginB-5>
                                                {test.testType?.name || 'Bilinmiyor'}
                                            </Text>
                                            <Text text90 color={Colors.grey30}>
                                                {new Date(test.date).toLocaleDateString('tr-TR')}
                                            </Text>
                                        </View>
                                        <Text text60 color={Colors.primary}>
                                            {test.value}
                                        </Text>
                                    </View>
                                </Card>
                            ))}
                        </View>
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
        padding: 15,
    },
    mainActions: {
        marginBottom: 20,
    },
    mainActionCard: {
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.grey70,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionTextContainer: {
        flex: 1,
    },
    searchCard: {
        padding: 20,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchContainer: {
    flexDirection: 'column', // Yatay hizalamayı dikeye çevir
    alignItems: 'stretch', // Elemanların genişliklerini hizalamak için
    marginBottom: 10, // Alt boşluk ekle
    },
    searchInput: {
    flex: 1, // Esnek genişlik kullan
    height: 45,
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.grey40,
    },
    testTypePicker: {
    flex: 1, // Esnek genişlik kullan
    height: 45,
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 8,
    backgroundColor: Colors.grey40,
    marginBottom: 10,
    },
    searchButton: {
    height: 45,
    minWidth: '100%', // Butonu tam genişlik yap
    marginTop: 10, // Buton ile üstündeki alan arasında boşluk ekle
    },
    resultCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: Colors.white,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    inputField: {
        height: 50,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey50,
        fontSize: 16,
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
        color: Colors.grey40,
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

export default AdminPanel;