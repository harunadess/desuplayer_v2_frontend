import { get } from '../helpers/request';

const base = 'library';

const build = async (dir) => {
  const response = await get(`${base}/build`, { musicDir: dir });
  return response.data;
};

export default {
  build
};