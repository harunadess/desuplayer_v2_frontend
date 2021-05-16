import { constants } from '../constants';
import axios from 'axios';
axios.defaults.baseURL = constants.server;

const maxSize = 1024*1024*1024;

export const get = async (url, params, type='json') => {
	return axios.get(url, {
		params: params,
		responseType: type,
		maxBodyLength: maxSize,
		maxContentLength: maxSize
	});
};

export const post = async (url, data) => {

};