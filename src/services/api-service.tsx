import axios from 'axios';
//import dotenv from 'dotenv';
import {IRegistration} from '../screens/Register';
//dotenv.config();
import CookieManager from '@react-native-cookies/cookies';
import { ISignIn } from '../screens/SignIn';

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.68.104:3001/', //TODO Deshardcodear
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
        await CookieManager.setFromResponse('192.168.68.104:3001/', cookie);
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
    return await axiosInstance.post("/users/sign-in", data).then(async (response) => {
      const cookie: string = response.headers['set-cookie']
          ? response.headers['set-cookie'].toString()
          : '';
        await CookieManager.setFromResponse('192.168.68.104:3001/', cookie);
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
};
