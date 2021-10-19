import {get} from '../helpers/request';
import {Album, SongMeta} from '../types/data/library';
import {GetAllArtistsParams, GetSongMetaParams, GetSongParams} from '../types/requests/music';

const base = 'music';

type MusicData = string;

// todo: specify supported types
interface BlobOptions {
  type: string;
}

// todo: rewrite this stupid route to be getAllAlbums
const getAllArtists = async (): Promise<Album[]> => {
  const params = {} as GetAllArtistsParams;
  const response = await get<GetAllArtistsParams, Album[]>(`${base}/getAllArtists`, params);
  return response.data;
};

const getSong = async (path: string): Promise<Blob> => {
  const params = {path: path} as GetSongParams;
  const response = await get<GetSongParams, MusicData>(`${base}/getSong`, params, 'blob');
  const format = response.headers['content-type'];
  const options = {type: format} as BlobOptions;
  return new Blob([response.data], options);
};

const getSongMeta = async (path: string, albumArtist: string, albumTitle: string): Promise<SongMeta> => {
  const params = {path: path, artist: albumArtist, album: albumTitle} as GetSongMetaParams;
  console.log(path, albumArtist, albumTitle);
  const response = await get<GetSongMetaParams, SongMeta>(`${base}/getSongMeta`, params);
  return response.data;
};

export default {
  getAllArtists,
  getSong,
  getSongMeta
};
