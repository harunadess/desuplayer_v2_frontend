import { constants } from '../constants';
import axios, { AxiosResponse, ResponseType } from 'axios';
let baseUrl = constants.server;

const maxSize = 1024*1024*1024;

export const setApi = (server: string) => {
  baseUrl = `http://${server}/api`;
  console.log('setApi', baseUrl);
};

export const get = async <ParamType extends Object, ReturnType extends Object>(url: string, params: ParamType, type: ResponseType = 'json'): Promise<AxiosResponse<ReturnType>> => {
  return axios.get<ReturnType>(`${baseUrl}/${url}`, {
    params: params,
    responseType: type,
    maxBodyLength: maxSize,
    maxContentLength: maxSize
  });
};

// export const post = async (url, data) => {

// };