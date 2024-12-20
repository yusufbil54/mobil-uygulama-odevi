import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API_URL = 'http://localhost:5001';

class AppStore {
    user = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
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

    setUser(user) {
        this.user = user;
    }

    setLoading(status) {
        this.loading = status;
    }

    setError(error) {
        this.error = error;
    }

    async login(data, router) {
        try {
            this.setLoading(true);
            this.setError(null);

            const response = await axios.post(`${API_URL}/api/users/login`, data);

            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                this.setUser(response.data.user);
                this.showToast('success', 'Başarılı', 'Giriş yapıldı');
                router.push('/home');
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

    async logout() {
        try {
            await AsyncStorage.removeItem('token');
            this.setUser(null);
            this.showToast('success', 'Başarılı', 'Çıkış yapıldı');
        } catch (error) {
            console.error('Logout error:', error);
            this.showToast('error', 'Hata', 'Çıkış yapılırken bir hata oluştu');
        }
    }

    get isAuthenticated() {
        return !!this.user;
    }
}

export const appStore = new AppStore();