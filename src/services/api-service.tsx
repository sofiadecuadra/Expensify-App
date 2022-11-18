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
  baseURL: 'http://192.168.0.180:3001/', //TODO Deshardcodear
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
        await CookieManager.setFromResponse('http://192.168.0.180:3001/', cookie);
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
        await CookieManager.setFromResponse('http://192.168.0.180:3001/', cookie);
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
  getCategories: async ({queryKey}:any) => {
    const [_, page, pageSize] = queryKey;
    let params = "?";
    params += page ? `page=${page}&` : 'page=0&';
    params += pageSize ? `pageSize=${pageSize}` : 'pageSize=6';
    return await axiosInstance
      .get('/categories')
      .then((response) => response.data);
  },
  getCategoriesCount: async () => {
    return await axiosInstance
      .get('/categories/count')
      .then((response) => response.data);
  },
  getExpenses: async ({queryKey}:any) => {
    const [_, fromDate, toDate, page, pageSize] = queryKey;
    let params = "?";
    params += fromDate ? `startDate=${fromDate.toISOString()}&` : '';
    params += toDate ? `endDate=${toDate.toISOString()}&` : '';
    params += page ? `page=${page}&` : 'page=0&';
    params += pageSize ? `pageSize=${pageSize}` : 'pageSize=6';
    return await axiosInstance
      .get('/expenses' + params)
      .then((response) => response.data);
  },
  getExpensesCount: async ({queryKey}:any) => {
    const [_, fromDate, toDate] = queryKey;
    let params = "?";
    params += fromDate ? `startDate=${fromDate.toISOString()}&` : '';
    params += toDate ? `endDate=${toDate.toISOString()}` : '';
    return await axiosInstance
      .get('/expenses/count' + params)
      .then((response) => response.data);
  },
  addCategory: async (data: any) => {
    const formData = new FormData();
    formData.append('image', {...data.image, type: data.image.mimetype});
    formData.append('name', data.name);
    formData.append('monthlyBudget', data.monthlyBudget);
    formData.append('description', data.description);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return await axiosInstance
      .post('/categories', formData, config)
      .then((response) => response.data);
  },
  modifyCategory: async (data) => {
    const formData = new FormData();
    console.log(data);
    if (!data.image.alreadyUploaded) {
      formData.append('image', {
        ...data.image,
        type: data.image.mimetype,
      });
    } else {
      formData.append('imageAlreadyUploaded', 'true');
    }

    formData.append('name', data.name);
    formData.append('monthlyBudget', data.monthlyBudget);
    formData.append('description', data.description);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    const {id} = data;
    const params = `/${id}`;
    return await axiosInstance
      .put('./categories' + params, formData, config)
      .then((response) => response);
  },
  deleteCategory: async (id: any) => {
    return await axiosInstance
      .delete('/categories/' + id)
      .then((response) => response.data);
  },
  deleteExpense: async (id: any) => {
    return await axiosInstance
      .delete('/expenses/' + id)
      .then((response) => response.data);
  },
  updateToken: async (data: any) => {
    return await axiosInstance
      .put('/users/update-token', data)
      .then((response) => response.data);
  },
  expenseByCategory: async ({queryKey}:any) => {
    const [_, fromDate, toDate] = queryKey;
    let params = '?';
    params += fromDate ? `startDate=${fromDate.toISOString()}&` : '';
    params += toDate ? `endDate=${toDate.toISOString()}` : '';
    return await axiosInstance
      .get('/categories/expenses/period' + params)
      .then((response) => response.data);
  },
  expenseByMonth: async ({queryKey}:any) => {
    const [_, fromDate, toDate] = queryKey;
    let params = '?';
    params += fromDate ? `startDate=${fromDate.toISOString()}&` : '';
    params += toDate ? `endDate=${toDate.toISOString()}` : '';
    return await axiosInstance
      .get('/expenses/month' + params)
      .then((response) => response.data);
  },
};
const registerForPushNotificationsAsync = async () => {
  //   if (Device.isDevice) {
  //     const {status: existingStatus} = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const {status} = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     const token = (await Notifications.getExpoPushTokenAsync()).data;
  //     if (Platform.OS === 'android') {
  //       Notifications.setNotificationChannelAsync('default', {
  //         name: 'default',
  //         importance: Notifications.AndroidImportance.MAX,
  //         vibrationPattern: [0, 250, 250, 250],
  //         lightColor: '#FF231F7C',
  //       });
  //     }
  //     return token;
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //     return null;
  //   }
};
