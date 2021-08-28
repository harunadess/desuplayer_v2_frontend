import { constants } from '../constants'; 
import axios from 'axios';
let baseUrl = constants.server;

const maxSize = 1024*1024*1024;

export const setApi = (server) => {
	baseUrl = `http://${server}/api`;
	console.log('setApi', baseUrl);
};

export const get = async (url, params, type='json') => {
	return axios.get(`${baseUrl}/${url}`, {
		params: params,
		responseType: type,
		maxBodyLength: maxSize,
		maxContentLength: maxSize
	});
};

export const post = async (url, data) => {

};