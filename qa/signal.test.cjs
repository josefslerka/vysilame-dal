const assert=require('node:assert/strict');
const {Signal,SIGNAL_AREAS,SIGNAL_JOBS,SIGNAL_BADGES,signalDailyChallenge,rotate,rotationTo}=require('../signal.js');
function snapshot(g){return {job:g.job,size:g.size,source:g.source,targets:g.targets,relays:g.relays,walls:[...g.walls],locked:[...g.locked],tiles:g.tiles,solution:g.solution,baseline:g.baseline};}
function solve(g){for(const i of g.required){if(g.locked.has(i))continue;let count=0;while(g.tiles[i]!==g.solution[i]&&g.phase==='playing'){const turn=rotationTo(g.tiles[i],g.solution[i]);assert.notEqual(turn,null);assert.ok(g.turn(i,turn<0?-1:1));assert.ok(++count<=2);}}assert.ok(g.solved);assert.ok(['won','round-won'].includes(g.phase));}
// An independent flood fill checks the generated witness, including every target
// and relay, rather than trusting the engine's solved flag alone.
function powered(tiles,size,source){const seen=new Set(),q=[];if(tiles[source]&8){seen.add(source);q.push(source);}for(let p=0;p<q.length;p++){const i=q[p],x=i%size,y=Math.floor(i/size);for(const [bit,dx,dy,op] of [[1,0,-1,4],[2,1,0,8],[4,0,1,1],[8,-1,0,2]]){const nx=x+dx,ny=y+dy;if(nx<0||nx>=size||ny<0||ny>=size)continue;const j=ny*size+nx;if((tiles[i]&bit)&&(tiles[j]&op)&&!seen.has(j)){seen.add(j);q.push(j);}}}return seen;}
assert.equal(SIGNAL_JOBS.length,24);assert.equal(new Set(SIGNAL_JOBS.map(j=>j.id)).size,24);
let puzzles=0;
function inspectAndSolve(g){
  const before=structuredClone(snapshot(g));assert.equal(g.solved,false);assert.ok(g.baseline>0);assert.equal(g.tiles.length,g.size*g.size);assert.equal(g.targets.length,SIGNAL_AREAS[g.job.areaId].targets[g.job.level]);
  assert.equal(g.walls.size,SIGNAL_AREAS[g.job.areaId].walls[g.job.level]);assert.equal(g.relays.length,SIGNAL_AREAS[g.job.areaId].relays[g.job.level]);
  const witness=powered(g.solution,g.size,g.source);for(const t of g.targets){assert.ok(witness.has(t.index));assert.ok(g.solution[t.index]&2);}for(const i of g.relays)assert.ok(witness.has(i));
  for(let i=0;i<g.tiles.length;i++){assert.notEqual(rotationTo(g.tiles[i],g.solution[i]),null);if(g.walls.has(i)){assert.equal(g.tiles[i],0);assert.equal(g.solution[i],0);}if(g.locked.has(i)){assert.equal(g.tiles[i],g.solution[i]);assert.equal(g.turn(i),false);}}
  const replay=new Signal(g.options);while(replay.round<g.round){replay.start();solve(replay);replay.next();}assert.deepEqual(snapshot(replay),before);
  solve(g);assert.ok(g.history.at(-1).moves<=g.baseline);assert.equal(g.history.at(-1).stars,3);assert.equal(g.history.at(-1).score,750);puzzles++;
}
for(const job of SIGNAL_JOBS){const g=new Signal({areaId:job.areaId,level:job.level,practice:true});assert.equal(g.roundCount,1);g.start();inspectAndSolve(g);assert.equal(g.phase,'won');assert.equal(g.stars,3);}
for(const areaId of Object.keys(SIGNAL_AREAS))for(let seed=1;seed<=100;seed++){
  const g=new Signal({mode:'random',seed,areaId,level:seed%6,practice:true});assert.equal(g.roundCount,3);g.start();for(let round=0;round<3;round++){inspectAndSolve(g);assert.equal(g.phase,round===2?'won':'round-won');if(round<2){const time=g.remaining;g.update(9999);assert.equal(g.remaining,time);assert.ok(g.next());}}assert.equal(g.score,2250);
}
const shapes=new Set();for(let seed=1;seed<=100;seed++){const g=new Signal({mode:'random',seed,areaId:'mesto'});shapes.add(g.required.map(i=>i+'='+g.solution[i]).sort().join(',')+'>'+g.targets.map(t=>t.row));}assert.ok(shapes.size>85,'new shifts change network topology, not just tile orientation');
const day=signalDailyChallenge(new Date('2026-10-24T12:00:00Z'));assert.equal(day.daily,'2026-10-24');assert.deepEqual(day,signalDailyChallenge(new Date('2026-10-23T22:30:00Z')));assert.notEqual(day.seed,signalDailyChallenge(new Date('2026-10-24T22:30:00Z')).seed);
for(let d=1;d<=30;d++){const g=new Signal(signalDailyChallenge(new Date(Date.UTC(2026,9,d,12))));assert.equal(new Set(g.jobs.map(j=>j.areaId)).size,3);assert.equal(g.practice,false);g.start();for(let i=0;i<3;i++){inspectAndSolve(g);if(i<2)g.next();}assert.ok(g.badges.includes('daily'));}

const g=new Signal({areaId:'noc',level:5});assert.equal(g.turn(g.source),false);assert.equal(g.askHint(),false);assert.equal(g.undo(),false);assert.equal(g.restartRound(),false);g.start();assert.equal(g.start(),false);
for(const index of [-1,999,1.5,'2',null])assert.equal(g.turn(index),false);assert.equal(g.turn(g.source,0),false);
const initial=[...g.tiles],originalTime=g.remaining;g.paused=true;assert.equal(g.turn(g.source),false);assert.equal(g.undo(),false);assert.equal(g.askHint(),false);assert.equal(g.restartRound(),false);g.update(30);assert.equal(g.remaining,originalTime);g.paused=false;
assert.ok(g.turn(g.source,-1));assert.ok(g.undo());assert.deepEqual(g.tiles,initial);assert.equal(g.moves,2);assert.equal(g.totalMoves,2);assert.equal(g.undo(),false);
const hint=g.askHint();assert.ok(hint);assert.equal(g.hintsLeft,1);assert.equal(g.askHint(),hint);assert.equal(g.hintsLeft,1,'the same visible hint is not charged twice');assert.notEqual(g.tiles[hint.index],hint.mask);
g.update(20);assert.ok(g.restartRound());assert.equal(g.remaining,originalTime);assert.deepEqual(g.tiles,initial);assert.equal(g.moves,0);assert.equal(g.hintsLeft,1);assert.equal(g.hintsUsed,1);assert.equal(g.restarts,1);
g.askHint();assert.equal(g.hintsLeft,0);const shown=g.hint;g.turn(shown.index,shown.turns<0?-1:1);assert.equal(g.hint,null);assert.equal(g.askHint(),false);solve(g);assert.equal(g.stars,1);assert.equal(g.history[0].score,610);assert.ok(g.badges.every(id=>SIGNAL_BADGES[id]));
assert.equal(g.turn(g.source),false);assert.equal(g.undo(),false);assert.equal(g.askHint(),false);assert.equal(g.restartRound(),false);assert.equal(g.next(),false);assert.equal(g.events.filter(e=>e.type==='won').length,1);
const timed=new Signal();timed.start();timed.update(-1);timed.update(NaN);assert.equal(timed.remaining,timed.limit);timed.update(timed.limit+1);timed.update(20);assert.equal(timed.phase,'lost');assert.equal(timed.events.filter(e=>e.type==='lost').length,1);assert.equal(timed.turn(timed.source),false);
const calm=new Signal({practice:true});calm.start();calm.update(100000);assert.equal(calm.remaining,calm.limit);assert.equal(calm.phase,'playing');
const intermission=new Signal({mode:'random',seed:9});intermission.start();solve(intermission);intermission.paused=true;assert.equal(intermission.next(),false);intermission.paused=false;assert.equal(intermission.next(),true);assert.equal(intermission.moves,0);assert.equal(intermission.hintsLeft,2);assert.equal(intermission.restarts,0);assert.equal(intermission.hint,null);

const fixture=new Signal();Object.assign(fixture,{size:4,source:12,sourceRow:3,tiles:Array(16).fill(0),targets:[{index:15,row:3},{index:11,row:2}],relays:[]});for(const i of [12,13,14,15])fixture.tiles[i]=10;
fixture.refresh();assert.equal(fixture.online,1);assert.equal(fixture.solved,false,'all receivers must be online together');fixture.targets.pop();fixture.relays=[0];fixture.refresh();assert.equal(fixture.online,1);assert.equal(fixture.solved,false,'receivers do not replace the mandatory relays');
fixture.relays=[13];fixture.tiles[0]=6;fixture.tiles[1]=12;fixture.tiles[4]=3;fixture.tiles[5]=9;fixture.refresh();assert.equal(fixture.solved,true);assert.equal(fixture.connected.has(0),false,'an isolated closed loop is not powered');fixture.tiles[13]=0;fixture.refresh();assert.equal(fixture.solved,false,'a blocked tile cannot conduct');
Object.assign(fixture,{source:0,sourceRow:0,tiles:[10,10,10,10,10,10,10,10,0,0,0,0,0,0,0,0],targets:[{index:7,row:1}],relays:[]});fixture.refresh();assert.equal(fixture.solved,false,'east/west ports cannot wrap around a row edge');
for(let mask=0;mask<16;mask++){let rotated=mask;for(let i=0;i<4;i++)rotated=rotate(rotated);assert.equal(rotated,mask);}
console.log(`Drž signál: ${puzzles} complete puzzles, 24 campaign jobs, new topologies, witness connectivity, replay, daily dates, relays, walls, locks, undo, hints, scoring and timer guards pass.`);
