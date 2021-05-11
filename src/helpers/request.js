import { constants } from '../constants';
import axios from 'axios';
axios.defaults.baseURL = constants.server;

export const get = async (url, params, type='json') => {
	return axios.get(url, { params: params, responseType: type })
	.catch(console.error);
};

export const post = async (url, data) => {

};