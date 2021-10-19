import {get} from '../helpers/request';
import {BuildParams} from '../types/requests/library';
import {Album} from '../types/data/library';

const base = 'library';

const build = async (dir: string) => {
  const params = { musicDir: dir } as BuildParams;
  const response = await get<BuildParams, Album[]>(`${base}/build`, params);
  return response.data;
};

export default {
  build
};
