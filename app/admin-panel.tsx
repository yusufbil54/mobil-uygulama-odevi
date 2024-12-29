import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions } from 'react-native';
import { View, Text, Card, Button, Colors, TextField } from 'react-native-ui-lib';
import { Stack, router } from 'expo-router';
import { AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_URL, appStore } from '../store/appStore';

const { width } = Dimensions.get('window');

const AdminPanel = () => {
    const [tc, setTc] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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
                setSearchResults(response.data.data);
                if (response.data.data.length === 0) {
                    Toast.show({
                        type: 'info',
                        text1: 'Bilgi',
                        text2: 'Bu TC numarasına ait test sonucu bulunamadı'
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
                            value={tc}
                            onChangeText={setTc}
                            style={styles.searchInput}
                            maxLength={11}
                            keyboardType="numeric"
                        />
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        width: width * 0.55,
        marginRight: 10,
        height: 45,
        borderWidth: 1,
        borderColor: Colors.grey50,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: Colors.grey70,
    },
    searchButton: {
        height: 45,
        minWidth: 100,
    },
    resultCard: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: Colors.white,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    }
});

export default AdminPanel;