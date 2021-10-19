export interface Song {
  Title: string;
  AlbumTitle: string;
  AlbumArtist: string;
  Artist: string;
  Discnumber: number;
  Tracknumber: number;
  Filetype: string;
  Path: string;
}

export interface Album {
  Title: string;
  AlbumArtist: string;
  Artist: string;
  Genre: string;
  Picturedata: string;
  Picturetype: string;
  Songs: Map<string, Song>;
  AlbumKey: string;
}

export interface SongMeta extends Song {
  Genre: string;
  Picturedata: string;
  Picturetype: string;
}

export interface Artist {
  Name: string;
  Albums: Map<string, Album>;
}

export type Playable = Song | Album;
