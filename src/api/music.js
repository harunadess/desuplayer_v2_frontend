import { get } from '../helpers/request';

const base = 'music';

const getAllArtists = async () => {
  const response = await get(`${base}/getAllArtists`, {});
  return response.data;
};

const getSong = async (path) => {
  const response = await get(`${base}/getSong`, { path: path }, 'blob');
  const format = response.headers['content-type'];
  const songData = new Blob([res.data], { type: format });
  return songData;
};

export default {
  getAllArtists,
  getSong
};