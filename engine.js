(function(root){
  'use strict';
  const node=typeof module!=='undefined'&&module.exports;
  const defense=node?require('./defender.js'):root.DefenderGame;
  const verification=node?require('./verify.js'):root.VerifyGame;
  const signal=node?require('./signal.js'):root.SignalGame;
  const api={...defense,...verification,...signal};
  if(node)module.exports=api;else root.MediaGames=api;
})(typeof window!=='undefined'?window:globalThis);
