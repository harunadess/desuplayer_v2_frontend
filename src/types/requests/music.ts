export interface GetAllArtistsParams {

}

export interface GetSongParams {
  path: string;
}

export interface GetSongMetaParams {
  path: string;
  artist: string,
  album: string;
}
