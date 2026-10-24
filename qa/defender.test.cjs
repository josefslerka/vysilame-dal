const assert=require('node:assert/strict');
const {Defender,MAPS,DIFFICULTIES,ENEMIES,positionOn,routeData,makeWaves,dailyChallenge}=require('../defender.js');
let checks=0;
function check(name,fn){try{fn();checks++;}catch(error){error.message=name+': '+error.message;throw error;}}
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-7,`${actual} should equal ${expected}`);
function arena(options={}){const g=new Defender({seed:42,...options});g.startWave();g.queue=[];return g;}

check('economy and input guards',()=>{
  const g=new Defender({seed:1});
  assert.equal(g.build(-1,'verify'),false);assert.equal(g.build(0,'missing'),false);
  const t=g.build(0,'verify');assert.ok(t);assert.equal(g.money,135);
  assert.equal(g.build(0,'reporter'),false);
  assert.equal(g.upgrade(t.id),true);assert.equal(t.level,2);assert.equal(g.money,83);
  assert.equal(g.upgrade(t.id),true);assert.equal(g.upgrade(t.id),false);assert.ok(g.money>=0);
  assert.equal(g.sell(t.id),true);assert.equal(g.occupied(0),undefined);
  g.paused=true;assert.equal(g.build(1,'verify'),false);assert.equal(g.startWave(),false);
});
check('map routes, bounds and distinct layouts',()=>{
  assert.equal(Object.keys(MAPS).length,4);assert.equal(MAPS.vinohrady.paths.length,2);
  const layouts=new Set();
  for(const map of Object.values(MAPS)){
    layouts.add(JSON.stringify(map.paths));assert.ok(map.slots.length>=12);
    assert.equal(new Set(map.slots.map(p=>p.join(','))).size,map.slots.length);
    for(const [x,y]of map.slots)assert.ok(x>25&&x<935&&y>25&&y<551);
    for(const path of map.paths){const route=routeData(path);assert.ok(route.length>1000);assert.ok(route.segments.every(n=>n>0));assert.deepEqual(positionOn(route,0),{x:path[0][0],y:path[0][1]});assert.deepEqual(positionOn(route,route.length+20),{x:856,y:352});}
  }
  assert.equal(layouts.size,4);
});
check('replay seeds, daily stability and two entrances',()=>{
  assert.deepEqual(makeWaves(42,'kavky'),makeWaves(42,'kavky'));
  assert.notDeepEqual(makeWaves(42,'kavky'),makeWaves(43,'kavky'));
  const g=new Defender({mapId:'vinohrady',difficulty:'hard',seed:'kavka'}),replay=new Defender(g.options);
  assert.equal(g.code,replay.code);assert.deepEqual(g.waves,replay.waves);
  assert.equal(g.waves.length,8);assert.ok(g.waves.every(w=>w.some(e=>e.route===0)&&w.some(e=>e.route===1)));
  assert.equal(g.waves[7].filter(e=>ENEMIES[e.type].boss).length,1);
  assert.deepEqual(dailyChallenge(new Date(2026,9,24,1)),dailyChallenge(new Date(2026,9,24,23)));
  assert.notEqual(dailyChallenge(new Date(2026,9,24)).seed,dailyChallenge(new Date(2026,9,25)).seed);
});
check('clickbait splits once and keeps its entrance route',()=>{
  const g=arena({mapId:'vinohrady'}),e=g.spawn('clickbait',1,300);
  g.damage(e,{towerType:'reporter',damage:1000});
  const fragments=g.enemies.filter(e=>e.type==='fragment');assert.equal(fragments.length,2);
  assert.ok(fragments.every(f=>f.route===1&&f.distance<300));assert.equal(g.stopped,1);
  g.stop(e,{});assert.equal(g.enemies.filter(e=>e.type==='fragment').length,2);
});
check('troll regeneration and verified suppression',()=>{
  const g=arena(),e=g.spawn('troll');e.hp-=50;const injured=e.hp;g.update(1);close(e.hp,injured+7);
  g.damage(e,{towerType:'verify',damage:5});const verified=e.hp;g.update(1);close(e.hp,verified);
  for(let i=0;i<65;i++)g.update(.05);assert.ok(e.hp>verified);
});
check('armor, shields and lobby protection have distinct counters',()=>{
  const g=arena(),p=g.spawn('pressure');let hp=p.hp;
  g.damage(p,{towerType:'community',damage:20});close(hp-p.hp,14.4);hp=p.hp;
  g.damage(p,{towerType:'reporter',damage:20});close(hp-p.hp,20);
  const lobby=g.spawn('lobby'),shield=lobby.shield,h=lobby.hp;
  g.damage(lobby,{towerType:'verify',damage:20});close(shield-lobby.shield,34);close(lobby.hp,h);
  const neighbor=g.spawn('cut');hp=neighbor.hp;
  g.damage(neighbor,{towerType:'verify',damage:20});close(hp-neighbor.hp,15);hp=neighbor.hp;
  g.damage(neighbor,{towerType:'reporter',damage:20});close(hp-neighbor.hp,20);
  lobby.stun=2;hp=neighbor.hp;g.damage(neighbor,{towerType:'verify',damage:20});close(hp-neighbor.hp,20);
});
check('spin ignores slowing and community slows other threats',()=>{
  const g=arena(),spin=g.spawn('spin'),cut=g.spawn('cut');
  g.damage(spin,{towerType:'community',damage:1});g.damage(cut,{towerType:'community',damage:1});
  assert.equal(spin.slow,0);assert.ok(cut.slow>1);
  const beforeSpin=spin.distance,beforeCut=cut.distance;g.update(.1);
  close(spin.distance-beforeSpin,spin.speed*.1);close(cut.distance-beforeCut,cut.speed*.52*.1);
});
check('forms jam nearby towers, do not stack, and can be stunned',()=>{
  const g=new Defender({seed:1}),t=g.build(0,'verify'),base=g.stats(t).interval;
  const a=g.spawn('form');a.x=t.x;a.y=t.y;
  assert.equal(g.stats(t).jammed,true);close(g.stats(t).interval,base*1.4);
  const b=g.spawn('form');b.x=t.x;b.y=t.y;close(g.stats(t).interval,base*1.4);
  a.stun=b.stun=2;assert.equal(g.stats(t).jammed,false);close(g.stats(t).interval,base);
});
check('map perks change tower behavior',()=>{
  const park=new Defender({seed:1}),city=new Defender({mapId:'vinohrady',seed:1}),region=new Defender({mapId:'region',seed:1}),night=new Defender({mapId:'noc',seed:1});
  close(city.stats({type:'reporter',level:1}).range,park.stats({type:'reporter',level:1}).range*1.15);
  close(region.stats({type:'community',level:1}).range,park.stats({type:'community',level:1}).range*1.3);
  const inCoffee=night.stats({type:'reporter',level:1,x:496,y:352}),outside=night.stats({type:'reporter',level:1,x:104,y:88});
  assert.equal(inCoffee.coffee,true);assert.equal(outside.coffee,false);close(outside.interval/inCoffee.interval,1.3);
  const e=region.spawn('cut');region.damage(e,{towerType:'community',damage:1});assert.equal(e.slow,2.3);
});
check('conference summons a bounded escort',()=>{
  const g=arena(),boss=g.spawn('conference');g.health=10000;
  for(let i=0;i<640;i++)g.update(.05);
  assert.equal(boss.summons,4);assert.equal(g.serial,9,'one boss and eight escorts');
});
check('flock charges, cooldown, pause and movement stun',()=>{
  const g=arena(),e=g.spawn('pressure'),hp=e.hp,distance=e.distance;
  g.paused=true;assert.equal(g.callFlock(),false);g.update(10);assert.equal(e.distance,distance);
  g.paused=false;assert.equal(g.callFlock(),true);close(hp-e.hp,45);assert.equal(g.panicCharges,1);
  assert.equal(g.callFlock(),false);g.update(1);assert.equal(e.distance,distance);
  for(let i=0;i<230;i++)g.update(.05);
  assert.equal(g.callFlock(),true);assert.equal(g.panicCharges,0);
  g.skillCooldown=0;assert.equal(g.callFlock(),false);
  assert.equal(new Defender({seed:1}).callFlock(),false);
});
check('briefing freezes action and grants exactly one offered bonus',()=>{
  const g=new Defender({seed:123});
  for(let wave=1;wave<=2;wave++){g.startWave();g.queue=[];g.update(.05);}
  assert.equal(g.phase,'briefing');assert.equal(g.briefing.length,3);assert.equal(new Set(g.briefing).size,3);
  const time=g.time,money=g.money;g.update(20);assert.equal(g.time,time);assert.equal(g.startWave(),false);assert.equal(g.build(0,'verify'),false);
  assert.equal(g.chooseBonus('does-not-exist'),false);assert.equal(g.money,money);
  const chosen=g.briefing[0];assert.equal(g.chooseBonus(chosen),true);assert.equal(g.phase,'build');
  const after=g.money;assert.equal(g.chooseBonus(chosen),false);assert.equal(g.money,after);assert.deepEqual(g.chosenBonuses,[chosen]);
  const replay=new Defender(g.options);for(let wave=1;wave<=2;wave++){replay.startWave();replay.queue=[];replay.update(.05);}assert.equal(replay.briefing[0],chosen);
});
check('targeting respects remaining route, strength and speed',()=>{
  const g=new Defender({mapId:'vinohrady',seed:1}),t=g.build(0,'reporter');
  const first=g.spawn('cut',1,g.routes[1].length-50),strong=g.spawn('boss',0,100),fast=g.spawn('noise',0,90);
  for(const e of g.enemies){e.x=t.x;e.y=t.y;}
  assert.equal(g.targetFor(t,g.stats(t)),first);
  assert.equal(g.setTarget(t.id,'strong'),true);assert.equal(g.targetFor(t,g.stats(t)),strong);
  assert.equal(g.setTarget(t.id,'fast'),true);assert.equal(g.targetFor(t,g.stats(t)),fast);
  assert.equal(g.setTarget(t.id,'unknown'),false);
});
check('medal thresholds and hard score multiplier',()=>{
  const g=new Defender({seed:1});assert.equal(g.stars,0);g.phase='won';
  for(const [health,stars]of [[100,3],[95,3],[94,2],[60,2],[59,1],[1,1]]){g.health=health;assert.equal(g.stars,stars);}
  const hard=new Defender({difficulty:'hard',seed:1});hard.phase=g.phase;hard.health=g.health;close(hard.score,Math.round(g.score*DIFFICULTIES.hard.score));
});

const plans={
  kavky:[[4,'reporter'],[1,'verify'],[5,'community'],[7,'reporter'],[2,'verify'],[3,'reporter'],[8,'reporter'],[9,'community'],[6,'reporter']],
  vinohrady:[[6,'reporter'],[1,'verify'],[0,'verify'],[2,'community'],[5,'reporter'],[3,'reporter'],[8,'reporter'],[12,'verify'],[7,'reporter'],[10,'verify']],
  region:[[4,'reporter'],[2,'verify'],[5,'community'],[6,'reporter'],[7,'reporter'],[1,'verify'],[8,'reporter'],[10,'community'],[3,'verify']],
  noc:[[4,'reporter'],[1,'verify'],[5,'community'],[6,'reporter'],[7,'reporter'],[2,'verify'],[8,'reporter'],[9,'community'],[3,'reporter']]
};
function play(g,defend=true){
  let steps=0;
  while(!['won','lost'].includes(g.phase)&&steps++<35000){
    if(g.phase==='briefing'){
      const prefs=g.health<80?['cable','thermos','microphone','receipts','staples','neighbours','flock']:['thermos','microphone','receipts','staples','neighbours','cable','flock'];
      assert.equal(g.chooseBonus(prefs.find(id=>g.briefing.includes(id))),true);
    }
    if(g.phase==='build'){
      if(defend){for(const [slot,type]of plans[g.mapId])if(!g.occupied(slot))g.build(slot,type);for(const t of [...g.towers].sort((a,b)=>b.kills-a.kills))if(t.type==='reporter')g.upgrade(t.id);}
      assert.equal(g.startWave(),true);
    }
    if(defend&&g.enemies.filter(e=>e.hp>0).length>=7)g.callFlock();
    g.update(.05);assert.ok(g.money>=0);assert.ok(g.towers.length<=g.slots.length);
  }
  assert.ok(steps<35000,'game must reach a result');return g;
}
let victories=0;
check('36 complete shifts across all maps, modes and three seeds',()=>{
  for(const mapId of Object.keys(MAPS))for(const difficulty of Object.keys(DIFFICULTIES))for(const seed of [1,42,299]){
    const g=play(new Defender({mapId,difficulty,seed}));
    if(difficulty!=='hard'||seed===1)assert.equal(g.phase,'won',`${mapId}/${difficulty}/${seed} must be winnable with this mixed plan`);
    if(g.phase==='won'){victories++;assert.equal(g.wave,8);assert.equal(g.chosenBonuses.length,3);assert.ok(g.stars>=1);}
  }
  const a=play(new Defender({mapId:'kavky',difficulty:'hard',seed:1})),b=play(new Defender(a.options));
  assert.deepEqual([a.health,a.stopped,a.score,a.chosenBonuses],[b.health,b.stopped,b.score,b.chosenBonuses]);
});
check('unprotected maps lose without a soft lock',()=>{
  for(const mapId of Object.keys(MAPS)){const g=play(new Defender({mapId,seed:42}),false);assert.equal(g.phase,'lost');assert.equal(g.health,0);assert.equal(g.stars,0);}
});
console.log(`Defender: ${checks} groups passed; 36 complete mixed-strategy shifts, ${victories} wins; 4 unprotected losses and deterministic replay verified.`);
