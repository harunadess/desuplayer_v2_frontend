const serverUrl = '127.0.0.1:4444';

export const constants = {
  server: `${serverUrl}/api`,
  serverOrigin: serverUrl
};

export const playlistContextMenuId = 'player_context_menu';

export const contextMenuOptions = {
  play: { text: 'Play', action: () => {} },
  playNext: { text: 'Play Next', action: () => {} },
  addToQueue: { text: 'Add To Queue', action: () => {} }
};

export const playerStates = {
  play: 'play',
  pause: 'pause',
  sk_fwd: 'sk_fwd',
  sk_bk: 'sk_bk',
  end: 'end'
};