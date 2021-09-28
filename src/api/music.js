import { get } from '../helpers/request';

const base = 'music';

const getAllArtists = async () => {
  const response = await get(`${base}/getAllArtists`, {});
  return response.data;
};

const getSong = async (path) => {
  const response = await get(`${base}/getSong`, { path: path }, 'blob');
  const format = response.headers['content-type'];
  const songData = new Blob([response.data], { type: format });
  return songData;
};

const getSongMeta = async (path, albumArtist, albumTitle) => {
  console.log(path, albumArtist, albumTitle);
  const response = await get(`${base}/getSongMeta`, { path: path, artist: albumArtist, album: albumTitle });
  return response.data;
};

export default {
  getAllArtists,
  getSong,
  getSongMeta
};