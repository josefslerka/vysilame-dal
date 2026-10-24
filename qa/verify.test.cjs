const assert=require('node:assert/strict');
const {Verify,VERIFY_FILES,VERIFY_DESKS,VERIFY_CATEGORIES,VERIFY_BADGES,verifyDailyChallenge}=require('../verify.js');
const ids=cards=>cards.map(c=>c.id);
assert.equal(VERIFY_FILES.length,40);
assert.equal(new Set(VERIFY_FILES.map(f=>f.id)).size,40);
for(const file of VERIFY_FILES){
  assert.ok(VERIFY_CATEGORIES[file.category]);
  for(const field of ['source','why','detail']){assert.equal(file[field].length,2);assert.ok(file[field].every(text=>typeof text==='string'&&text.length>25));assert.notEqual(file[field][0],file[field][1]);}
}
const seen=new Set();
for(const deskId of Object.keys(VERIFY_DESKS))for(let seed=1;seed<=300;seed++){
  const g=new Verify({seed,deskId}),replay=new Verify(g.options);
  assert.deepEqual(g.cards,replay.cards,'the same shift must replay exact dossiers, evidence and order');
  assert.equal(g.total,VERIFY_DESKS[deskId].count);assert.equal(g.cards.filter(c=>c.ready).length,g.total/2);
  assert.equal(new Set(g.cards.map(c=>c.family)).size,g.total,'a shift cannot repeat the other variant of an earlier dossier');
  for(const card of g.cards){seen.add(card.id);assert.ok(VERIFY_DESKS[deskId].categories.includes(card.category));assert.ok(card.source&&card.why&&card.detail&&card.quip);}
  if(['morning','night'].includes(deskId))assert.equal(new Set(g.cards.slice(0,8).map(c=>c.category)).size,8);
  if(deskId==='night'){assert.equal(g.cards.at(-1).boss,true);assert.equal(VERIFY_FILES.find(f=>f.id===g.cards.at(-1).family).level,2);}
}
assert.equal(seen.size,80,'all eighty evidence variants must be reachable');
const previous=new Verify({seed:42,deskId:'data'}),recent=previous.cards.map(c=>c.family);
const fresh=new Verify({seed:42,deskId:'data',recent});
assert.ok(fresh.cards.filter(c=>recent.includes(c.family)).length<previous.total,'new shifts prefer less recently seen files');
assert.deepEqual(new Verify(fresh.options).cards,fresh.cards,'repeat keeps the original history snapshot');
assert.notDeepEqual(ids(new Verify(41).cards),ids(new Verify(42).cards));
const day=verifyDailyChallenge(new Date('2026-10-24T12:00:00Z'));
assert.equal(day.daily,'2026-10-24');assert.equal(day.practice,false);
assert.deepEqual(day,verifyDailyChallenge(new Date('2026-10-23T22:30:00Z')),'daily edition uses the Czech calendar date');
assert.notEqual(day.seed,verifyDailyChallenge(new Date('2026-10-24T22:30:00Z')).seed);
assert.deepEqual(new Verify({...day,recent}).cards,new Verify(day).cards,'daily edition ignores individual play history');
assert.equal(new Verify({...day,practice:true}).practice,false);

const g=new Verify({seed:42});
assert.equal(g.submit(true),false);assert.equal(g.inspect(),false);assert.equal(g.next(),false);
assert.equal(g.start(),true);assert.equal(g.start(),false);g.update(5);assert.equal(g.remaining,115);
g.paused=true;assert.equal(g.submit(true),false);assert.equal(g.inspect(),false);g.update(100);assert.equal(g.remaining,115);g.paused=false;
assert.equal(g.submit('true'),false);assert.equal(g.submit(null),false);
assert.ok(g.submit(g.card.ready).correct);assert.equal(g.score,100);
assert.equal(g.submit(g.card.ready),false);assert.equal(g.inspect(),false);g.update(500);assert.equal(g.remaining,115);
g.paused=true;assert.equal(g.next(),false);g.paused=false;assert.equal(g.next(),true);
const detail=g.inspect();assert.equal(detail,g.card.detail);assert.equal(g.remaining,107);assert.equal(g.checks,2);assert.equal(g.inspect(),false);assert.equal(g.hintsUsed,1);
g.submit(g.card.ready);assert.equal(g.feedback.points,95,'second correct answer earns 115 minus 20 for the detail');g.next();assert.equal(g.detailOpen,false);
g.submit(!g.card.ready);assert.equal(g.feedback.correct,false);assert.equal(g.feedback.points,0);assert.equal(g.combo,0);g.next();
g.submit(g.card.ready);assert.equal(g.feedback.points,100);g.next();
while(g.phase==='playing'){g.submit(g.card.ready);g.next();}
assert.equal(g.phase,'won');assert.equal(g.correct,9);assert.equal(g.stars,3);assert.ok(g.badges.includes('help'));assert.ok(!g.badges.includes('clean'));
assert.equal(g.submit(true),false);assert.equal(g.inspect(),false);assert.equal(g.next(),false);
assert.equal(g.events.filter(e=>e.type==='won').length,1);

const limits=new Verify({seed:2});limits.start();
for(let i=0;i<limits.desk.checks;i++){assert.ok(limits.inspect());limits.submit(limits.card.ready);limits.next();}
assert.equal(limits.checks,0);assert.equal(limits.inspect(),false);
const timeout=new Verify(1);timeout.start();timeout.update(NaN);timeout.update(-5);assert.equal(timeout.remaining,120);timeout.update(121);timeout.update(5);assert.equal(timeout.phase,'lost');assert.equal(timeout.events.filter(e=>e.type==='lost').length,1);assert.equal(timeout.stars,0);assert.equal(timeout.submit(true),false);
const expensive=new Verify(1);expensive.start();expensive.update(112);assert.ok(expensive.inspect());assert.equal(expensive.phase,'lost','a detail can consume the last eight seconds');assert.equal(expensive.submit(true),false);
const practice=new Verify({seed:1,practice:true});practice.start();practice.update(99999);practice.inspect();assert.equal(practice.remaining,120);assert.equal(practice.phase,'playing');assert.equal(practice.checks,2);
for(const [correct,stars] of [[10,3],[9,3],[8,2],[7,1],[6,1],[5,0]]){
  const result=new Verify(44);result.start();for(let i=0;i<result.total;i++){result.submit(i<correct?result.card.ready:!result.card.ready);result.next();}assert.equal(result.stars,stars);assert.equal(result.history.length,result.total);
  assert.ok(result.badges.every(id=>VERIFY_BADGES[id]));if(correct===10){assert.equal(result.score,1450);assert.ok(result.badges.includes('clean'));assert.ok(result.badges.includes('streak'));}
}
console.log('Ověřeno!: 1,200 reproducible shifts, all 80 variants, topic balance, fresh decks, Czech daily edition, scoring, details, pause, timeout, practice and medals pass.');
