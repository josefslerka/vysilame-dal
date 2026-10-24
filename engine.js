(function (root) {
  'use strict';
  const defense=typeof module!=='undefined'&&module.exports?require('./defender.js'):root.DefenderGame;
  const verification=typeof module!=='undefined'&&module.exports?require('./verify.js'):root.VerifyGame;
  function random(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
  const N=1,E=2,S=4,W=8;
  const DIRECTIONS=[{bit:N,dx:0,dy:-1,op:S},{bit:E,dx:1,dy:0,op:W},{bit:S,dx:0,dy:1,op:N},{bit:W,dx:-1,dy:0,op:E}];
  const PUZZLE_PATHS=[
    [[0,2],[1,2],[1,1],[2,1],[3,1],[3,2],[2,2],[2,3],[3,3],[4,3]],
    [[0,1],[1,1],[1,0],[2,0],[2,1],[2,2],[1,2],[1,3],[2,3],[3,3],[3,2],[4,2]],
    [[0,3],[1,3],[1,4],[2,4],[3,4],[3,3],[2,3],[2,2],[1,2],[1,1],[2,1],[3,1],[3,0],[4,0],[4,1],[4,2]]
  ];
  const rotate=mask=>((mask<<1)&15)|((mask&8)?1:0);
  function direction(a,b){return b[0]>a[0]?E:b[0]<a[0]?W:b[1]>a[1]?S:N;}
  class Signal {
    constructor(seed=Date.now()){this.seed=seed;this.reset();}
    reset(){this.round=0;this.moves=0;this.score=0;this.phase='ready';this.paused=false;this.events=[];this.generate();}
    generate(){const r=random(this.seed+this.round*173),path=PUZZLE_PATHS[this.round];this.sourceRow=path[0][1];this.targetRow=path.at(-1)[1];this.solution=Array.from({length:25},()=>r()<.5?N|S:N|E);for(let i=0;i<path.length;i++){const p=path[i],previous=i?direction(p,path[i-1]):W,next=i<path.length-1?direction(p,path[i+1]):E;this.solution[p[1]*5+p[0]]=previous|next;}this.tiles=this.solution.map(m=>{for(let j=0,n=Math.floor(r()*4);j<n;j++)m=rotate(m);return m;});this.remaining=90;this.refresh();if(this.solved){const p=path[1],i=p[1]*5+p[0];this.tiles[i]=rotate(this.tiles[i]);this.refresh();}}
    start(){if(this.phase==='ready'){this.phase='playing';return true;}return false;}
    refresh(){this.connected=new Set();const first=this.sourceRow*5;if(!(this.tiles[first]&W)){this.solved=false;return;}const queue=[first];this.connected.add(first);while(queue.length){const i=queue.shift(),x=i%5,y=Math.floor(i/5),m=this.tiles[i];for(const d of DIRECTIONS){if(!(m&d.bit))continue;const nx=x+d.dx,ny=y+d.dy;if(nx<0||nx>=5||ny<0||ny>=5)continue;const next=ny*5+nx;if((this.tiles[next]&d.op)&&!this.connected.has(next)){this.connected.add(next);queue.push(next);}}}const last=this.targetRow*5+4;this.solved=this.connected.has(last)&&!!(this.tiles[last]&E);}
    turn(i){if(this.phase!=='playing'||this.paused||!Number.isInteger(i)||i<0||i>=25)return false;this.tiles[i]=rotate(this.tiles[i]);this.moves++;this.refresh();this.events.push({type:'turn'});if(this.solved){this.score+=Math.round(300+this.remaining*5);this.phase=this.round===2?'won':'round-won';this.events.push({type:this.phase==='won'?'won':'connected'});}return true;}
    next(){if(this.phase!=='round-won')return false;this.round++;this.generate();this.phase='playing';return true;}
    update(dt){if(this.phase!=='playing'||this.paused)return;this.remaining=Math.max(0,this.remaining-dt);if(this.remaining===0){this.phase='lost';this.events.push({type:'lost'});}}
  }
  const api={...defense,...verification,Signal,rotate,PUZZLE_PATHS};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MediaGames=api;
})(typeof window!=='undefined'?window:globalThis);
