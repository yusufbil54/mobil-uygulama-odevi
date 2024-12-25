import { makeAutoObservable, makeObservable, observable } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API_URL = 'http://192.168.0.114:5001';

class AppStore {
    user = null;
    loading = false;
    error = null;
    token = null;
    constructor() {
        makeObservable(this, {
            user: observable,
            loading: observable,
            error: observable,
            token: observable,
        });
        this.getToken();

    }

    showToast(type, text1, text2) {
        Toast.show({
            type: type, // success, error, info
            text1: text1,
            text2: text2,
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
        });
    }

    async getToken() {
        this.token = await AsyncStorage.getItem('token');
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(status) {
        this.loading = status;
    }

    setError(error) {
        this.error = error;
    }

    checkToken(router) {
        if (this.token) {
            router.push('/home');
        } else {
            router.push('/');
        }
    }

    async login(data, router) {
        try {
            console.log(data);
            this.setLoading(true);
            this.setError(null);

            const response = await axios.post(`${API_URL}/api/users/login`, data);

            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                this.setUser(response.data);
                this.showToast('success', 'Başarılı', 'Giriş yapıldı');
                
                // Admin ise admin paneline yönlendir
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
            console.error('User profile fetch error:', error);
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
                this.showToast('success', 'Başarılı', 'Profil bilgileri güncellendi');
                return response.data;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profil güncellenirken bir hata oluştu';
            this.setError(errorMessage);
            this.showToast('error', 'Hata', errorMessage);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    get isAdmin() {
        return this.user?.role === 'admin';
    }
}


export const appStore = new AppStore();