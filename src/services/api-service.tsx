import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
//import dotenv from 'dotenv';
import {IRegistration} from '../screens/Register';
//dotenv.config();
import CookieManager from '@react-native-cookies/cookies';
import {ISignIn} from '../screens/SignIn';
import {Platform} from 'react-native';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/', //TODO Deshardcodear
  withCredentials: true,
});
export const api = {
  adminSignup: async (data: IRegistration) => {
    return await axiosInstance
      .post('/users', {...data, role: 1})
      .then(async (response) => {
        const cookie: string = response.headers['set-cookie']
          ? response.headers['set-cookie'].toString()
          : '';
        await CookieManager.setFromResponse('http://localhost:3001/', cookie);
        const token = await registerForPushNotificationsAsync();
        api.updateToken({token});
        return response;
      });
  },
  adminLogout: async () => {
    return await axiosInstance.post('/users/log-out').then(async (response) => {
      await CookieManager.clearAll();
      return response;
    });
  },
  signIn: async (data: ISignIn) => {
    return await axiosInstance
      .post('/users/sign-in', data)
      .then(async (response) => {
        const cookie: string = response.headers['set-cookie']
          ? response.headers['set-cookie'].toString()
          : '';
        await CookieManager.setFromResponse('http://192.168.1.6:3001/', cookie);
        const token = await registerForPushNotificationsAsync();
        api.updateToken({token});
        return response;
      });
  },
  createInvite: async (data: {userType: string}) => {
    return await axiosInstance
      .post('/families/invitations', {...data, users: []})
      .then((response) => response);
  },
  validateInviteToken: async ({queryKey}: any) => {
    const [_, inviteToken] = queryKey;
    if (!inviteToken) {
      return undefined;
    }
    const params = inviteToken;
    return await axiosInstance
      .get('/families/' + params)
      .then((response) => response.data);
  },
  inviteSignup: async (data: any) => {
    return await axiosInstance
      .post('/users/invitations', {...data})
      .then((response) => response);
  },
  getCategories: async () => {
    return await axiosInstance.get('/categories').then((response) => {
      console.log('getCategories', response.data);
      return response.data;
    });
  },
  addCategory: async (data: any) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('monthlyBudget', data.monthlyBudget);
    formData.append('description', data.description);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return await axiosInstance
      .post('/categories', formData, config)
      .then((response) => response.data);
  },
  categories: async () => {
    return await axiosInstance
      .get('./categories')
      .then((response) => response.data);
  },
  addExpense: async (data: any) => {
    console.log(data);
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('description', data.name);
    formData.append('amount', data.amount);
    formData.append('description', data.description);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return await axiosInstance
      .post('/expenses', formData, config)
      .then((response) => response.data);
  },
  expense: async () => {
    return await axiosInstance
      .get('./expenses')
      .then((response) => response.data);
  },
  updateToken: async (data: any) => {
    return await axiosInstance
      .put('/users/update-token', data)
      .then((response) => response.data);
  },
};

const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  } else {
    alert('Must use physical device for Push Notifications');
    return null;
  }
};
