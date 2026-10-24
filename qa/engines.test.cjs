const assert=require('node:assert/strict');
const {Signal}=require('../engine.js');
require('./defender.test.cjs');
require('./verify.test.cjs');

for(let seed=1;seed<=30;seed++){
  const signal=new Signal(seed);assert.equal(signal.solved,false);signal.start();
  for(let round=0;round<3;round++){
    for(let i=0;i<25&&signal.phase==='playing';i++){
      let rotations=0;
      while(signal.tiles[i]!==signal.solution[i]&&signal.phase==='playing'&&rotations<4){signal.turn(i);rotations++;}
      assert.ok(rotations<4);
    }
    assert.ok(signal.solved,'Every generated circuit has a valid route.');
    assert.equal(signal.phase,round===2?'won':'round-won');
    if(round<2)assert.equal(signal.next(),true);
  }
}
const signalTimeout=new Signal(1);signalTimeout.start();signalTimeout.update(91);assert.equal(signalTimeout.phase,'lost');
console.log('Signal: 90 generated circuits are solvable; all round transitions and timeout pass.');
console.log('All engine checks passed.');
