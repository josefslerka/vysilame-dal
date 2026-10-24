(function(root){
  'use strict';
  const MAPS={
    kavky:{id:'kavky',name:'Kavčí hory',short:'KAVČÍ HORY',subtitle:'Klasika s výhledem na rozpočet.',theme:'park',rule:'Za každou dokončenou vlnu dostaneš 15 podpory navíc. Kavky mají předplatné.',bonus:15,start:200,
      paths:[[[-40,160],[200,160],[200,416],[440,416],[440,160],[696,160],[696,352],[856,352]]],
      slots:[[112,88],[280,224],[112,352],[280,496],[368,336],[512,352],[512,88],[624,224],[776,224],[776,440],[840,112],[600,488]],
      trees:[[50,277,1.05],[50,331,.8],[337,132,.9],[349,181,.8],[532,478,.95],[876,459,1.05],[916,153,1],[877,195,.8],[48,452,1],[143,528,.7],[853,530,.85],[559,39,.9],[611,54,.75],[340,47,.75],[310,78,.8]],sign:'ZÁKAZ KRMENÍ LOBBISTŮ',signAt:[320,290]},
    vinohrady:{id:'vinohrady',name:'Vinohradská 12',short:'VINOHRADSKÁ / PRAHA',subtitle:'Tlak zleva, tlak zprava. Tramvaj má přednost.',theme:'city',rule:'Dva vstupy, jedna redakce. Reportéři mají o 15 % delší dosah.',reporterRange:1.15,start:225,
      paths:[[[-40,112],[264,112],[264,288],[568,288],[568,448],[760,448],[760,352],[856,352]],[[1000,112],[760,112],[760,224],[456,224],[456,448],[760,448],[760,352],[856,352]]],
      slots:[[144,192],[344,120],[344,352],[176,368],[384,512],[640,368],[632,144],[840,176],[840,448],[704,512],[112,40],[536,96],[520,512],[72,272]],trees:[[90,490,.85],[144,500,.6],[920,481,.75],[904,224,.8]],sign:'NEZAPOMEŇTE VYSTOUPIT Z BUBLINY',signAt:[200,540]},
    region:{id:'region',name:'Výjezd do regionu',short:'REGIONÁLNÍ VÝSADEK',subtitle:'Jeden kabel. Pět obcí. Tři druhy koláčů.',theme:'region',rule:'Místní znají zkratky. Komunita má o 30 % větší dosah a zpomaluje déle.',communityRange:1.3,communitySlow:2.3,start:210,
      paths:[[[-40,432],[136,432],[136,144],[360,144],[360,360],[632,360],[632,160],[856,160],[856,352]]],
      slots:[[64,304],[216,352],[216,224],[288,72],[432,208],[432,432],[552,288],[704,280],[776,88],[920,240],[776,424],[288,496],[552,96],[72,72]],trees:[[42,501,.9],[92,520,.7],[493,476,1.1],[540,512,.8],[913,466,1],[923,400,.8],[254,126,.7],[480,75,.8]],sign:'DO STUDIA ROVNĚ. ZA KOLÁČI TAKY.',signAt:[427,535]},
    noc:{id:'noc',name:'Noční směna',short:'NOČNÍ SMĚNA / 03:17',subtitle:'Kávovar je poslední nezávislá instituce.',theme:'night',rule:'Do 155 kroků od kávovaru střílí obrana o 30 % rychleji. Bezkofein se nepočítá.',coffee:{x:505,y:264,radius:155},start:210,
      paths:[[[-40,160],[176,160],[176,416],[416,416],[416,112],[648,112],[648,352],[856,352]]],
      slots:[[104,88],[248,224],[88,352],[256,496],[336,336],[496,352],[496,184],[576,224],[728,224],[760,440],[824,112],[568,488]],trees:[[60,270,.8],[328,140,.7],[328,200,.8],[882,460,.9],[917,169,.8],[49,482,.8]],sign:'JEŠTĚ JEDEN ŠÁLEK A JSME VYVÁŽENÍ',signAt:[305,540]}
  };
  const DIFFICULTIES={
    easy:{name:'Na pohodu',subtitle:'Káva ještě nevystydla.',hp:.8,speed:.94,money:60,reward:1.08,score:.8},
    normal:{name:'Redakční provoz',subtitle:'Uzávěrka je za pět minut.',hp:1.1,speed:1,money:0,reward:.95,score:1},
    hard:{name:'Krizový štáb',subtitle:'Tiskovka začala před deseti minutami.',hp:1.9,speed:1.2,money:0,reward:.85,score:1.7}
  };
  const TOWERS={
    verify:{name:'Ověřovna',cost:65,range:151,damage:22,interval:.65,color:'#e5f041',ink:'#49592c',tag:'Rozbije bublinu',description:'Rychle ověřuje. Potlačí trollí regeneraci, štíty rozebírá dvojnásobně.'},
    reporter:{name:'Reportér',cost:95,range:228,damage:48,interval:1.3,color:'#ef7950',ink:'#934f38',tag:'Projde odolností',description:'Ignoruje odolnost i lobbistickou ochranu. Dosáhne dál než tisková zpráva.'},
    community:{name:'Komunita',cost:80,range:142,damage:10,interval:.8,color:'#7fb4df',ink:'#3e6789',tag:'Zpomalí o 48 %',description:'Drží ostatním prostor. Pozor, názorový kotrmelec se zpomalit nenechá.'}
  };
  const ENEMIES={
    cut:{name:'Škrt obecný',short:'Škrt',glyph:'✂',hp:73,speed:56,reward:13,loss:8,color:'#ef8569',armor:0,ability:'Základní škrt. Prostě ukusuje ze signálu.',counter:'Ověřovna nebo reportér. Neškrtat vlastní obranu.',quip:'Jen drobná úspora. Náhodou má velikost celé redakce.'},
    noise:{name:'Šum domácí',short:'Šum',glyph:'?',hp:42,speed:95,reward:11,loss:5,color:'#aaa2d3',armor:0,ability:'Malý a rychlý. Umí proběhnout mezi pomalými zásahy.',counter:'Rychlá Ověřovna, případně zpomalující Komunita.',quip:'Prý se to říká. Kdo? To se taky neví.'},
    pressure:{name:'Tlak úřední',short:'Tlak',glyph:'▣',hp:190,speed:39,reward:23,loss:15,color:'#71859b',armor:.28,ability:'Má 28% odolnost vůči běžným zásahům.',counter:'Reportér odolnost ignoruje. Otázky nejsou v příloze.',quip:'Nejde o nátlak. Jen to opakujeme velmi důrazně.'},
    clickbait:{name:'Klikbait třaskavý',short:'Klikbait',glyph:'!',hp:62,speed:66,reward:13,loss:9,color:'#e9bb5b',armor:0,ability:'Po zastavení se rozpadne na dva rychlé Vykřičníky.',counter:'Rychlá obrana i za místem, kde praskne. Nálet odstraní i drobotinu.',quip:'NEUVĚŘÍTE, co se stane po kliknutí! My bohužel ano.'},
    fragment:{name:'Vykřičník na útěku',short:'Vykřičník',glyph:'!',hp:19,speed:102,reward:3,loss:3,color:'#e8c47e',armor:0,ability:'Malý zbytek klikbaitu. Dvakrát tolik dramatu v polovičním těle.',counter:'Ověřovna. Jeden rychlý zásah obvykle stačí.',quip:'Původní titulek už je pryč, ale emoce ještě běží.'},
    troll:{name:'Troll přesčasový',short:'Troll',glyph:'@',hp:158,speed:43,reward:21,loss:12,color:'#b09d78',armor:.08,ability:'Obnovuje si 7 životů za sekundu. Ověřovna regeneraci na 4 s vypne.',counter:'Ověřovna zastaví regeneraci, reportér dokončí práci.',quip:'Já jen kladu otázky. Všech sedm set z jednoho účtu.'},
    form:{name:'Formulář A38',short:'A38',glyph:'A38',hp:174,speed:34,reward:24,loss:13,color:'#b5aece',armor:.1,ability:'Do 105 kroků prodlouží obranám čas mezi výstřely o 40 %. Stohy se nesčítají.',counter:'Reportér má dostřel mimo papírování. Kavčí nálet ho na chvíli umlčí.',quip:'K razítku potřebujete potvrzení, že nepotřebujete jiné razítko.'},
    lobby:{name:'Lobbista v bačkorách',short:'Lobbista',glyph:'€',hp:216,speed:33,reward:28,loss:16,color:'#a38c69',armor:.15,shield:85,ability:'Má štít a chrání sousedy do 90 kroků: zásahy do nich jsou o 25 % slabší.',counter:'Ověřovna rychle zbourá štít. Reportér ignoruje ochranu sousedů.',quip:'Tohle není vliv. To je neformální výměna bačkor.'},
    spin:{name:'Názorový kotrmelec',short:'Kotrmelec',glyph:'↻',hp:100,speed:77,reward:18,loss:10,color:'#71aaa8',armor:0,ability:'Je imunní vůči zpomalení. Stanovisko mění za jízdy.',counter:'Ověřovna a reportér. Komunitou ho honit nemusíš.',quip:'To jsme nikdy neřekli. A pokud ano, mysleli jsme opak.'},
    boss:{name:'Král všech příloh',short:'Král příloh',glyph:'♛',hp:1450,speed:27,reward:150,loss:50,color:'#455b75',armor:.23,shield:180,boss:true,ability:'Velmi odolný boss se štítem. Nemá termín konce připomínkování.',counter:'Kombinuj rychlé ověřování štítu, silné reportéry a zpomalení.',quip:'Boss má přílohu. Příloha má přílohu. Vy máte noční směnu.'},
    conference:{name:'Velká tiskovka',short:'Tiskovka',glyph:'≋',hp:1300,speed:30,reward:150,loss:50,color:'#9b6b67',armor:.12,boss:true,ability:'Každých 7 s přidá dva Šumy. Nejvýše čtyřikrát, pak už má další schůzku.',counter:'Zacil nejsilnějšího reportéry, na doprovod nech Ověřovnu.',quip:'Na otázky bude prostor po otázkách. Které nebudou.'}
  };
  const BONUSES={
    thermos:{name:'Termoska solidarity',icon:'☕',text:'Všechny obrany střílí o 15 % rychleji.',quip:'Na osobu jeden hrnek. Na vyváženost dva.',apply:g=>{g.buffs.rate*=1.15;}},
    microphone:{name:'Mikrofon navíc',icon:'♩',text:'Reportéři mají o 22 % silnější zásah.',quip:'Druhá otázka? Tak to jsme opravdu nečekali.',apply:g=>{g.buffs.reporter*=1.22;}},
    receipts:{name:'Účtenky z šuplíku',icon:'✓',text:'Ověřovny mají o 25 % silnější zásah.',quip:'Zdroj: ta složka, o které tvrdili, že neexistuje.',apply:g=>{g.buffs.verify*=1.25;}},
    neighbours:{name:'Sousedská výpomoc',icon:'⌂',text:'Komunity mají o 35 kroků větší dosah.',quip:'Někdo přinesl koláč. Teď už je to síť.',apply:g=>{g.buffs.communityRange+=35;}},
    staples:{name:'Grant na sponky',icon:'✳',text:'Okamžitě získáš 90 podpory.',quip:'Sponky propojují dokumenty. Dokumenty propojují lidi.',apply:g=>{g.money+=90;}},
    cable:{name:'Kabel, co se neztratil',icon:'↝',text:'Obnoví 18 % signálu a všem přidá 10 kroků dosahu.',quip:'Nikdo ho neodnesl domů. Historický okamžik.',apply:g=>{g.health=Math.min(100,g.health+18);g.buffs.range+=10;}},
    flock:{name:'Kavčí posily',icon:'⌁',text:'Dva další nálety. Maximálně čtyři v zásobě.',quip:'Na DPP. Dohodu o ptačí pomoci.',apply:g=>{g.panicCharges=Math.min(4,g.panicCharges+2);}}
  };
  const WAVE_NAMES=['Rozpočtové drobné','Razítko na rozjezd','Internet to ví líp','Neformální návštěva','Všechno je jinak','Příloha k příloze','Mimořádně běžná situace','Závěrečná tiskovka'];
  const QUIPS={
    welcome:['Kavka se nedá koupit. Maximálně uplatit rohlíkem.','Vítá vás redakce. Židle vržou, páteř drží.','Naše vyváženost: káva v levé, mikrofon v pravé.'],
    build:['Nové pracovní místo. Už víme, kam se ztratily všechny židle.','Postaveno. Teď už jen vyřešit, kdo umyl hrnek.','Silná redakce začíná dobrým stolem a neoblomným zobákem.'],
    clear:['Vlna zastavena. Kávovar odmítl komentář.','Vysílání pokračuje. Rozpočet se tváří překvapeně.','Díky. Tahle porada mohla být e-mail. Ale nebyla.','Tlak opadl. Zůstala jen drobenka na klávesnici.'],
    leak:['Tohle prošlo i přes tři připomínková řízení.','Máme díru v signálu. Prý ji vyplní pracovní skupina.','Kabel to nebyl. Tentokrát doopravdy.'],
    skill:['Kavky v terénu! Zasedání se přerušuje z ptačích důvodů.','Nálet bez tiskové zprávy. Nezávislé zobáky v akci.'],
    upgrade:['Teď má reportáž větší dosah než konverzace u kopírky.','Vylepšeno. Žádné místo náměstka nepřibylo.','Investice do lidí. Hrozně radikální nápad.'],
    won:['Vysílání zachráněno. Tři hrnky nenalezeny.','Kavky drží. Tisková zpráva bude stručná: krá.'],
    lost:['Signál se odmlčel. Kávovar zvažuje vlastní podcast.','Dneska to nevyšlo. Páteř ale zůstala na skladě.']
  };
  function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function routeData(points){const segments=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));return {points,segments,length:segments.reduce((a,b)=>a+b,0)};}
  function positionOn(route,distance){for(let i=0;i<route.segments.length;i++){const length=route.segments[i];if(distance<=length){const p=route.points[i],q=route.points[i+1],t=Math.max(0,distance)/length;return{x:p[0]+(q[0]-p[0])*t,y:p[1]+(q[1]-p[1])*t};}distance-=length;}const p=route.points.at(-1);return{x:p[0],y:p[1]};}
  function normalizeSeed(seed){if(typeof seed==='string'){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}return Number.isFinite(seed)?seed>>>0:Date.now()>>>0;}
  function dailyChallenge(date=new Date()){const key=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');const seed=normalizeSeed('kavky-'+key),mapId=Object.keys(MAPS)[seed%4];return{mapId,difficulty:'normal',seed,daily:key};}
  function makeWaves(seed,mapId){
    const r=random(normalizeSeed(seed)^normalizeSeed(mapId));
    const pools=[['cut','cut','noise'],['cut','noise','form'],['cut','noise','clickbait','troll'],['cut','pressure','noise','lobby'],['spin','troll','clickbait','pressure'],['form','pressure','lobby','noise','clickbait'],['spin','troll','lobby','form','pressure','clickbait'],['spin','form','lobby','noise','pressure']];
    const guaranteed=[['cut','noise'],['form'],['clickbait','troll'],['lobby','pressure'],['spin'],['form','lobby'],['troll','spin','clickbait'],[]];
    const waves=pools.map((pool,i)=>{const count=8+i*2,types=[...guaranteed[i]];while(types.length<count)types.push(pool[Math.floor(r()*pool.length)]);for(let j=types.length-1;j>0;j--){const k=Math.floor(r()*(j+1));[types[j],types[k]]=[types[k],types[j]];}if(i===7)types.splice(5,0,r()<.5?'boss':'conference');return types.map((type,j)=>({type,route:j%MAPS[mapId].paths.length}));});
    return waves;
  }
  const TARGET_MODES={first:'Nejblíž cíli',strong:'Nejsilnější',fast:'Nejrychlejší'};
  class Defender{
    constructor(options={}){this.mapId=MAPS[options.mapId]?options.mapId:'kavky';this.difficulty=DIFFICULTIES[options.difficulty]?options.difficulty:'normal';this.seed=normalizeSeed(options.seed);this.daily=options.daily||null;this.reset();}
    reset(){
      this.map=MAPS[this.mapId];this.mode=DIFFICULTIES[this.difficulty];this.slots=this.map.slots;this.routes=this.map.paths.map(routeData);this.path=this.routes[0].points;this.pathLength=this.routes[0].length;this.waves=makeWaves(this.seed,this.mapId);this.waveCount=this.waves.length;
      this.money=this.map.start+this.mode.money;this.health=100;this.wave=0;this.phase='build';this.paused=false;this.towers=[];this.enemies=[];this.shots=[];this.effects=[];this.queue=[];this.events=[];this.stopped=0;this.time=0;this.spawnTimer=0;this.serial=0;this.lastBonus=0;this.panicCharges=2;this.skillCooldown=0;this.usedSkills=0;this.briefing=[];this.chosenBonuses=[];this.seen=new Set();this.buffs={rate:1,verify:1,reporter:1,range:0,communityRange:0};this.flavour=random(this.seed^1337);this.quip=this.say('welcome');
    }
    get code(){return this.seed.toString(36).toUpperCase().padStart(6,'0');}
    get stars(){return this.phase!=='won'?0:this.health>=95?3:this.health>=60?2:1;}
    get score(){return Math.round((this.stopped*100+this.wave*120+this.health*10+(this.phase==='won'?2000:0))*this.mode.score);}
    get options(){return{mapId:this.mapId,difficulty:this.difficulty,seed:this.seed,daily:this.daily};}
    say(kind){const list=QUIPS[kind]||QUIPS.welcome;return list[Math.floor(this.flavour()*list.length)];}
    occupied(slot){return this.towers.find(t=>t.slot===slot);}
    cost(type){return TOWERS[type]?.cost??Infinity;}
    build(slot,type){if(!TOWERS[type]||!Number.isInteger(slot)||!this.slots[slot]||this.occupied(slot)||this.money<this.cost(type)||this.paused||!['build','wave'].includes(this.phase))return false;const[x,y]=this.slots[slot],t={id:++this.serial,slot,type,x,y,level:1,cooldown:.1,spent:this.cost(type),angle:0,kills:0,target:'first'};this.money-=t.spent;this.towers.push(t);this.quip=this.say('build');this.events.push({type:'build',x,y});return t;}
    stats(t){
      const d=TOWERS[t.type],m=1+(t.level-1)*.48;let range=d.range+(t.level-1)*19+this.buffs.range,rate=this.buffs.rate;
      if(t.type==='reporter')range*=this.map.reporterRange||1;
      if(t.type==='community')range=range*(this.map.communityRange||1)+this.buffs.communityRange;
      const coffee=this.map.coffee&&Math.hypot(t.x-this.map.coffee.x,t.y-this.map.coffee.y)<=this.map.coffee.radius;if(coffee)rate*=1.3;
      const jammed=this.enemies.some(e=>e.type==='form'&&e.hp>0&&e.stun<=0&&Math.hypot(t.x-e.x,t.y-e.y)<=105);
      return{...d,damage:d.damage*m*(this.buffs[t.type]||1),range,interval:d.interval/(1+(t.level-1)*.1)/rate*(jammed?1.4:1),jammed,coffee:!!coffee};
    }
    upgradeCost(t){return Math.round(TOWERS[t.type].cost*(.8+.35*(t.level-1)));}
    upgrade(id){const t=this.towers.find(t=>t.id===id);if(!t||t.level>=3||this.paused||!['build','wave'].includes(this.phase))return false;const cost=this.upgradeCost(t);if(this.money<cost)return false;this.money-=cost;t.spent+=cost;t.level++;this.quip=this.say('upgrade');this.events.push({type:'upgrade',x:t.x,y:t.y});return true;}
    sell(id){const t=this.towers.find(t=>t.id===id);if(!t||this.paused||!['build','wave'].includes(this.phase))return false;this.money+=Math.round(t.spent*.65);this.towers=this.towers.filter(x=>x!==t);return true;}
    setTarget(id,target){const t=this.towers.find(t=>t.id===id);if(!t||!TARGET_MODES[target]||this.paused||!['build','wave'].includes(this.phase))return false;t.target=target;return true;}
    preview(){if(this.wave>=this.waveCount)return[];const counts={};for(const e of this.waves[this.wave])counts[e.type]=(counts[e.type]||0)+1;return Object.entries(counts).map(([type,count])=>({type,count,...ENEMIES[type]}));}
    startWave(){if(this.phase!=='build'||this.paused||this.wave>=this.waveCount)return false;this.queue=this.waves[this.wave].map(x=>({...x}));this.wave++;this.phase='wave';this.spawnTimer=0;this.events.push({type:'wave',wave:this.wave,name:WAVE_NAMES[this.wave-1]});this.quip='Vlna '+this.wave+': '+WAVE_NAMES[this.wave-1]+'. '+(this.wave===8?'Na otázky zbude čas, pokud nějaký zbude.':'Kavky zaujmou pracovní polohu.');return true;}
    spawn(type,route=0,distance=0){const d=ENEMIES[type];if(!d)return null;route=this.routes[route]?route:0;const scale=(1+Math.max(0,this.wave-1)*.06)*this.mode.hp;const e={...d,type,id:++this.serial,route,hp:d.hp*scale,maxHp:d.hp*scale,shield:(d.shield||0)*scale,maxShield:(d.shield||0)*scale,speed:d.speed*this.mode.speed,distance,slow:0,stun:0,suppressed:0,age:0,spawnClock:7,summons:0,...positionOn(this.routes[route],distance)};this.enemies.push(e);if(!this.seen.has(type)){this.seen.add(type);if(!['cut','noise','fragment'].includes(type))this.events.push({type:'arrival',enemy:type});}return e;}
    stop(e,shot){if(e.defeated||e.escaped)return;e.defeated=true;e.hp=0;const reward=Math.round(e.reward*this.mode.reward);this.money+=reward;this.stopped++;const t=this.towers.find(t=>t.id===shot?.towerId);if(t)t.kills++;this.effects.push({x:e.x,y:e.y,age:0,life:.85,type:'reward',text:'+'+reward});this.events.push({type:'stop'});if(e.type==='clickbait'){this.spawn('fragment',e.route,e.distance-10);this.spawn('fragment',e.route,e.distance-29);}}
    damage(e,shot){
      if(e.hp<=0||e.escaped)return;
      const type=shot.towerType,reporter=type==='reporter',crow=type==='crow';
      let damage=shot.damage*(reporter||crow?1:1-e.armor);
      if(type==='verify'&&['noise','fragment','troll'].includes(e.type))damage*=1.3;
      if(!reporter&&!crow&&this.enemies.some(n=>n!==e&&n.type==='lobby'&&n.hp>0&&n.stun<=0&&Math.hypot(n.x-e.x,n.y-e.y)<=90))damage*=.75;
      if(e.shield>0){const shieldPower=type==='verify'?2:1,absorbed=Math.min(e.shield,damage*shieldPower);e.shield-=absorbed;damage-=absorbed/shieldPower;}
      e.hp-=Math.max(0,damage);
      if(type==='verify')e.suppressed=4;
      if(type==='community'&&e.type!=='spin')e.slow=this.map.communitySlow||1.7;
      this.effects.push({x:e.x,y:e.y,age:0,life:.32,type:'hit',color:TOWERS[type]?.color||'#e4efb1'});
      if(e.hp<=0)this.stop(e,shot);
    }
    callFlock(){if(this.phase!=='wave'||this.paused||this.panicCharges<=0||this.skillCooldown>0||!this.enemies.some(e=>e.hp>0))return false;this.panicCharges--;this.usedSkills++;this.skillCooldown=12;for(const e of [...this.enemies]){if(e.hp<=0)continue;e.stun=2.2;this.damage(e,{damage:45,towerType:'crow'});}this.effects.push({type:'flock',x:480,y:280,age:0,life:2.3});this.quip=this.say('skill');this.events.push({type:'flock'});return true;}
    chooseBonus(id){if(this.phase!=='briefing'||this.paused||!this.briefing.includes(id)||!BONUSES[id])return false;BONUSES[id].apply(this);this.chosenBonuses.push(id);this.briefing=[];this.phase='build';this.quip=BONUSES[id].quip;this.events.push({type:'bonus',bonus:id});return true;}
    finishWave(){this.lastBonus=42+this.wave*8+(this.map.bonus||0);this.money+=this.lastBonus;this.shots=[];if(this.wave===4)this.panicCharges=Math.min(4,this.panicCharges+1);if(this.wave===this.waveCount){this.phase='won';this.quip=this.say('won');this.events.push({type:'won'});return;}this.quip=this.say('clear');this.events.push({type:'clear',bonus:this.lastBonus});if(this.wave%2===0){const pool=Object.keys(BONUSES),r=random(this.seed+this.wave*733+17);for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}this.briefing=pool.slice(0,3);this.phase='briefing';}else this.phase='build';}
    targetFor(t,stats){let chosen=null,rank=-Infinity;for(const e of this.enemies){if(e.hp<=0||Math.hypot(e.x-t.x,e.y-t.y)>stats.range)continue;const remaining=this.routes[e.route].length-e.distance;const value=t.target==='strong'?e.hp+e.shield:t.target==='fast'?e.speed:100000-remaining;if(value>rank){rank=value;chosen=e;}}return chosen;}
    update(dt){
      if(!Number.isFinite(dt)||dt<=0||this.paused||['won','lost','briefing'].includes(this.phase))return;
      this.time+=dt;this.skillCooldown=Math.max(0,this.skillCooldown-dt);this.effects.forEach(e=>e.age+=dt);this.effects=this.effects.filter(e=>e.age<e.life);
      if(this.phase!=='wave')return;
      this.spawnTimer-=dt;while(this.queue.length&&this.spawnTimer<=0){const next=this.queue.shift();this.spawn(next.type,next.route);this.spawnTimer+=this.wave===1?.95:.76;}
      for(const e of [...this.enemies]){if(e.hp<=0)continue;e.age+=dt;e.slow=Math.max(0,e.slow-dt);e.stun=Math.max(0,e.stun-dt);e.suppressed=Math.max(0,e.suppressed-dt);if(e.type==='troll'&&e.suppressed<=0&&e.stun<=0)e.hp=Math.min(e.maxHp,e.hp+7*dt);if(e.type==='conference'&&e.stun<=0&&e.summons<4){e.spawnClock-=dt;if(e.spawnClock<=0){e.spawnClock+=7;e.summons++;this.spawn('noise',e.route,Math.max(0,e.distance-17));this.spawn('noise',e.route,Math.max(0,e.distance-37));}}
        if(e.stun<=0)e.distance+=e.speed*(e.slow>0&&e.type!=='spin'?.52:1)*dt;
        Object.assign(e,positionOn(this.routes[e.route],e.distance));if(e.distance>=this.routes[e.route].length){this.health=Math.max(0,this.health-e.loss);e.escaped=true;e.hp=0;this.quip=this.say('leak');this.events.push({type:'leak',loss:e.loss});const last=this.routes[e.route].points.at(-1);this.effects.push({x:last[0],y:last[1],age:0,life:1,type:'leak',text:'−'+e.loss});}}
      if(this.health<=0){this.phase='lost';this.quip=this.say('lost');this.events.push({type:'lost'});return;}
      for(const t of this.towers){const s=this.stats(t);t.jammed=s.jammed;t.coffee=s.coffee;t.cooldown-=dt*(s.jammed?1/1.4:1);if(t.cooldown>0)continue;const target=this.targetFor(t,s);if(target){t.angle=Math.atan2(target.y-t.y,target.x-t.x);this.shots.push({x:t.x,y:t.y,target,damage:s.damage,towerType:t.type,towerId:t.id,age:0});t.cooldown=s.interval/(s.jammed?1.4:1);}}
      for(const shot of this.shots){shot.age+=dt;if(shot.target.hp<=0){shot.done=true;continue;}const dx=shot.target.x-shot.x,dy=shot.target.y-shot.y,d=Math.hypot(dx,dy),step=510*dt;if(d<=step){this.damage(shot.target,shot);shot.done=true;}else{shot.x+=dx/d*step;shot.y+=dy/d*step;}}
      this.shots=this.shots.filter(s=>!s.done&&s.age<3);this.enemies=this.enemies.filter(e=>e.hp>0);if(!this.queue.length&&!this.enemies.length)this.finishWave();
    }
  }
  const PATH=MAPS.kavky.paths[0],SLOTS=MAPS.kavky.slots,firstRoute=routeData(PATH),PATH_LENGTH=firstRoute.length,WAVES=makeWaves(1,'kavky');
  const api={Defender,MAPS,DIFFICULTIES,TOWERS,ENEMIES,BONUSES,TARGET_MODES,WAVE_NAMES,QUIPS,PATH,SLOTS,PATH_LENGTH,WAVES,position:d=>positionOn(firstRoute,d),positionOn,routeData,makeWaves,dailyChallenge};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DefenderGame=api;
})(typeof window!=='undefined'?window:globalThis);
