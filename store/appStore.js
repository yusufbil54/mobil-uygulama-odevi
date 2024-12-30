import { makeAutoObservable, makeObservable, observable, action, runInAction } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { configure } from 'mobx';

//export const API_URL = 'http://172.20.10.6:5001'; //asli
//export const API_URL = 'http://192.168.0.102:5001'; //ev
export const API_URL = 'http://localhost:5001';

class AppStore {
    user = null;
    loading = false;
    error = null;
    token = null;
    savedCredentials = null;

    constructor() {
        makeObservable(this, {
            user: observable,
            loading: observable,
            error: observable,
            token: observable,
            savedCredentials: observable,
            setUser: action,
            setLoading: action,
            setError: action,
            updateProfile: action,
            setSavedCredentials: action
        });
        
        configure({
            enforceActions: "always"
        });
        
        this.getTokenAndUserInfo();
        this.loadSavedCredentials();
    }

    showToast(type, text1, text2) {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom',
            visibilityTime: 4000,
            autoHide: true,
        });
    }

    async getTokenAndUserInfo() {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            
            if (token && userStr) {
                runInAction(() => {
                    this.token = token;
                    this.user = JSON.parse(userStr);
                });
            }
        } catch (error) {
            console.error('Error getting token and user info:', error);
        }
    }

    setUser = action((user) => {
        this.user = user;
    });

    setLoading = action((status) => {
        this.loading = status;
    });

    setError = action((error) => {
        this.error = error;
    });

    checkToken(router) {    
        if (this.token) {
            if (this.user && this.user.role === 'admin') {
                router.push('/admin-panel');
            } else if (this.user) {
                router.push('/home');
            } else {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }

    async login(data, router) {
        try {
            this.setLoading(true);
            this.setError(null);

            const response = await axios.post(`${API_URL}/api/users/login`, data);

            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data));
                
                runInAction(() => {
                    this.token = response.data.token;
                    this.user = response.data;
                });

                this.showToast('success', 'Başarılı', 'Giriş yapıldı');

                if (response.data.role === 'admin') {
                    router.push('/admin-panel');
                } else {
                    router.push('/home');
                }
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
            this.setError(errorMessage);
            this.showToast('error', 'Hata', errorMessage);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    async register(data, router) {
        try {
            this.setLoading(true);
            const response = await axios.post(`${API_URL}/api/users/register`, data);
            if (response.data) {
                this.showToast('success', 'Başarılı', 'Kayıt işlemi başarıyla tamamlandı');
                router.push('/');
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Kayıt olurken bir hata oluştu';
            this.setError(errorMessage);
            this.showToast('error', 'Hata', errorMessage);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
    async logout(router) {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            this.setUser(null);
            this.showToast('success', 'Başarılı', 'Çıkış yapıldı');
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            this.showToast('error', 'Hata', 'Çıkış yapılırken bir hata oluştu');
        }
    }

    get isAuthenticated() {
        return !!this.user;
    }

    async getUserProfile() {
        try {
            const response = await axios.get(`${API_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            this.setUser(response.data);
        } catch (error) {
            console.error('Get profile error:', error);
        }
    }

    async updateProfile(data) {
        try {
            this.setLoading(true);
            const response = await axios.put(`${API_URL}/api/users/profile`, data, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });

            if (response.data.success) {
                this.setUser(response.data.data);
                this.showToast('success', 'Başarılı', 'Profil güncellendi');
            }
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            this.showToast('error', 'Hata', 'Profil güncellenirken bir hata oluştu');
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    get isAdmin() {
        return this.user?.role === 'admin';
    }

    async changePassword(data) {
        try {
            this.setLoading(true);
            const response = await axios.put(`${API_URL}/api/users/change-password`, data, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });

            if (response.data.success) {
                this.showToast('success', 'Başarılı', 'Şifre başarıyla güncellendi');
            }
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu';
            this.showToast('error', 'Hata', errorMessage);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    setSavedCredentials = async (email, password, shouldSave) => {
        try {
            if (shouldSave) {
                const credentials = { email, password };
                await AsyncStorage.setItem('savedCredentials', JSON.stringify(credentials));
                runInAction(() => {
                    this.savedCredentials = credentials;
                });
            } else {
                await AsyncStorage.removeItem('savedCredentials');
                runInAction(() => {
                    this.savedCredentials = null;
                });
            }
        } catch (error) {
            console.error('Error saving credentials:', error);
        }
    };

    loadSavedCredentials = async () => {
        try {
            const savedCredentials = await AsyncStorage.getItem('savedCredentials');
            if (savedCredentials) {
                runInAction(() => {
                    this.savedCredentials = JSON.parse(savedCredentials);
                });
            }
        } catch (error) {
            console.error('Error loading saved credentials:', error);
        }
    };
}


export const appStore = new AppStore();