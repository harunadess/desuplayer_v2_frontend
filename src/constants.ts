import {Playable} from './types/data/library';

const serverUrl = '127.0.0.1:4444';

export const constants = {
  server: `${serverUrl}/api`,
  serverOrigin: serverUrl
};

export const playlistContextMenuId = 'player_context_menu';

export const contextMenuOptions = {
  play: { text: 'Play', action: (_: Playable) => {} },
  playNext: { text: 'Play Next', action: (_: Playable) => {} },
  addToQueue: { text: 'Add To Queue', action: (_: Playable) => {} }
};

export type ContextMenuOptions = {
  [k in keyof typeof contextMenuOptions]: typeof contextMenuOptions[k];
}

export enum playerStates {
  play = 'play',
  pause ='pause',
  sk_fwd ='sk_fwd',
  sk_bk ='sk_bk',
  end = 'end'
};
