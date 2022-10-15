import axios from 'axios';
//import dotenv from 'dotenv';
import {IRegistration} from '../screens/Register';
//dotenv.config();

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/', //TODO Deshardcodear
  withCredentials: true,
});

export const api = {
  adminSignup: async (data: IRegistration) => {
    await axiosInstance
      .post('/users/log-out', data)
      .then((response) => response);
    console.log('');
    console.log('');
    console.log('');
    console.log(data);
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    console.log(
      await axiosInstance
        .post('/users', {...data, role: 1})
        .then((response) => response.headers['set-cookie']),
    );
    console.log('CATEGORIES');
    const categories = await axiosInstance
      .get('/categories')
      .then((response) => response.data);
    console.log(categories);
    // return await axiosInstance
    //   .post('/users', {...data, role: 1})
    //   .then((response) => response);
  },
};
