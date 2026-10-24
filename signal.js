(function(root){
  'use strict';
  const N=1,E=2,S=4,W=8;
  const DIRS=[{bit:N,dx:0,dy:-1,op:S},{bit:E,dx:1,dy:0,op:W},{bit:S,dx:0,dy:1,op:N},{bit:W,dx:-1,dy:0,op:E}];
  const SIGNAL_AREAS={
    obec:{id:'obec',name:'Obecní rozhlas',glyph:'⌂',size:4,seconds:120,color:'#a3c477',label:'NEJDŘÍV NAJDI KABEL',description:'Čtyři krát čtyři. Jeden přijímač, potom první přepojovače a pevné spoje. Hlášení o ztracené slepici má přednost.',targets:[1,1,1,1,1,1],relays:[0,0,0,0,1,1],walls:[0,0,0,0,0,0],locks:[0,0,0,1,1,2]},
    mesto:{id:'mesto',name:'Městský uzel',glyph:'▥',size:5,seconds:150,color:'#84b8ed',label:'JEDEN SIGNÁL, VÍC UŠÍ',description:'Pět krát pět. Rozvětvi síť k více přijímačům. Knihovna, škola i radnice chtějí slyšet něco jiného. Dostanou stejný signál.',targets:[2,2,2,2,3,3],relays:[0,1,1,1,1,1],walls:[0,0,1,2,2,2],locks:[0,0,1,1,2,2]},
    teren:{id:'teren',name:'Přenos z terénu',glyph:'⌁',size:6,seconds:200,color:'#f0b17e',label:'SKŘÍŇ SE NEUHNE',description:'Šest krát šest. Obejdi skříně a zapoj povinné přepojovače R. Technický vůz parkuje přesně tam, kde nemá.',targets:[1,2,2,2,2,3],relays:[1,1,2,2,2,2],walls:[3,4,4,5,5,6],locks:[0,1,1,2,2,3]},
    noc:{id:'noc',name:'Noční rozvaděč',glyph:'☾',size:6,seconds:210,color:'#b5a5e4',label:'NIKDO NA NIC NESAHAL',description:'Šest krát šest, více přijímačů, relé a pevných spojů. Předchozí směna nic neměnila. Jen všechno přepojila.',targets:[2,2,3,3,3,3],relays:[1,2,2,2,3,3],walls:[2,3,4,4,5,6],locks:[2,3,3,4,4,5]}
  };
  const JOB_TEXT={
    obec:[
      ['Slepice ve vysílání','Obec čeká na ranní hlášení. Najdi cestu od studia k přijímači. Ostatní kabely mohou odpočívat.','Slepice se našla. Teď hledáme člověka, který si vyžádal živý vstup.'],
      ['Pozor, zkouška mikrofonu','Mikrofon funguje. Kabely mají tvůrčí pauzu. Zelená ukazuje, kam už signál došel.','Jedna, dvě, tři. Čtvrtá už by chtěla honorář.'],
      ['Tajemství dolního šuplíku','Zásuvka je správná. Všechno mezi ní a studiem už méně. Nepotřebuješ zapojit každý dílek.','V šuplíku jsou tři redukce a návod na jiný šuplík.'],
      ['Spoj pod plombou','Dílek s malým zámkem je pevný. Už je správně natočený, obsluž okolní kabely.','Plombu neporušovat. Podepsal ji někdo, kdo už tu nepracuje.'],
      ['Přepojovač u vrátnice','Kromě přijímače musí dostat signál také dílek R1. Nestačí ho jen minout.','Vrátnice se ptá, jestli máme na průchod signálu papír.'],
      ['Poutní speciál','Přijímač i přepojovač R1 čekají na spojení. Pevné dílky ti napoví, kudy se dá jít.','Reprobedna chce hrát dechovku. Zatím hraje jen prodlužovačku.']
    ],
    mesto:[
      ['Škola a knihovna','Připoj oba přijímače vpravo. Když svítí jen jeden, veřejná služba má ještě nedodělek.','Knihovna žádá ticho. Škola žádá zesílit. Vyváženost v praxi.'],
      ['Odbočka na radnici','Dva přijímače a přepojovač R1. Třícestné dílky umějí signál rozdělit.','Odbočka schválena. Podmínkou je, že se nebude nazývat odbočka.'],
      ['Skříň pro vedení','Skříň s křížem nepřestěhuješ. Obejdi ji a udrž v síti oba přijímače i relé.','Skříň nemá kompetenci uhýbat. Má jen klíček.'],
      ['Dva odbory, jeden kabel','Pevné spoje se neotáčejí. Zbytek je na tobě. Všechny cíle musejí svítit současně.','Kabel zatím nemá připomínky. Oba odbory ano.'],
      ['Třetí do éteru','Tři přijímače, jeden přepojovač. Stav každého uvidíš na technickém panelu.','Tři lidé slyší totéž. Čtyři stížnosti už jsou na cestě.'],
      ['Velká městská smyčka','Rozděl signál ke všem třem přijímačům. Zbytečné odbočky nevadí, chybějící posluchač ano.','Zkratka přes podatelnu trvá šest až osm týdnů.']
    ],
    teren:[
      ['Vůz za kulturákem','Najdi průchod mezi skříněmi. Přijímač i R1 musejí mít živý signál.','Přenosový vůz stojí na kabelu. Řidič říká, že jen na minutku.'],
      ['Výjezd bez redukce','Dva přijímače, jedna povinná zastávka R1. Zámky zůstávají na svém místě.','Redukce je v jiném voze. Ten vůz je v jiném kraji.'],
      ['Dvě mezistanice','Zapoj oba přepojovače R1 a R2 i oba přijímače. Žlutý rám označuje povinné relé.','Mezistanice nemá občerstvení. Jen napětí v kolektivu.'],
      ['Skříň, druhá skříň','Pět překážek. Dvě relé. Jeden technik, který si měl vzít delší kabel.','Ta skříň tu stojí od rekonstrukce. Rekonstrukce ještě nezačala.'],
      ['Kabel přes kopec','Sleduj, co je opravdu připojené ke studiu. Zelený ostrůvek bez zdroje v téhle hře nevznikne.','Na kopci je výhled. Signál se zatím dívá jinam.'],
      ['Živě odkudkoliv','Tři přijímače a dvě relé mezi skříněmi. Zkus si síť nejdřív přečíst, pak otáčet.','„Jsme na místě.“ To je zatím jediná ověřená technická informace.']
    ],
    noc:[
      ['Po kolegovi','Kolega nechal některé spoje napevno. Nepanikař: tyto dílky už mají správnou orientaci.','Předávací protokol: „Včera to šlo.“ Podpis nečitelný.'],
      ['Kávovar na jiné větvi','Dva přijímače, dvě relé a pár plomb. Kávovar do schématu raději nekreslíme.','Kávovar vysílá výrazně stabilněji než zbytek budovy.'],
      ['Nikdo nic neměnil','Tři přijímače. Udrž všechny pod proudem a připoj obě relé současně.','Nikdo nic neměnil. Jen se tu objevilo šest nových kabelů.'],
      ['Zámek bez klíče','Čtyři pevné spoje ti zůstávají jako opěrné body. Zkratka přes skříň nevede.','Klíč je v obálce. Obálka ve skříni. Skříň je zamčená.'],
      ['Tři relé do rána','Každé z relé R1–R3 je povinné. Přijímače samotné tentokrát nestačí.','Relé má předat signál dál. Na poradě by to bylo podezřelé chování.'],
      ['Poslední kabel v budově','Tři přijímače, tři relé, šest skříní. Zelená bude nakonec slušet všem.','Technický dluh splatný dnes. Úrok: další prodlužovačka.']
    ]
  };
  const SIGNAL_JOBS=Object.values(SIGNAL_AREAS).flatMap(a=>JOB_TEXT[a.id].map(([name,brief,quip],level)=>({id:a.id+'-'+(level+1),areaId:a.id,level,name,brief,quip})));
  const SIGNAL_BADGES={
    first:{name:'Jsme v éteru',glyph:'◉',text:'Dokonči první okruh.'},
    clean:{name:'Zlatý konektor',glyph:'✦',text:'Získej tři hvězdy na jednom okruhu.'},
    branches:{name:'Rozděl a vysílej',glyph:'⋔',text:'Připoj tři přijímače současně.'},
    relays:{name:'Přepojeno',glyph:'R',text:'Dokonči okruh s alespoň dvěma relé.'},
    field:{name:'Terénní pracovník',glyph:'⌁',text:'Dokonči okruh se šesti překážkami.'},
    night:{name:'Poslední zhasíná',glyph:'☾',text:'Dokonči poslední noční zakázku.'},
    daily:{name:'Dnešní přenos',glyph:'◷',text:'Dokonči všechny tři okruhy denního přenosu.'}
  };
  const TURN_QUIPS=['Signál je rychlejší než zápis z porady. Zatím se ale nehnul.','Tohle není změť. To je nezdokumentovaná infrastruktura.','Každý kabel někam vede. Některý bohužel jen za skříň.','Začíná to vypadat jako řešení. Nebo jako logo technického oddělení.','Kvído tvrdí, že to viděl už na školení. Školení nebylo.','Když nevíš, sleduj zelenou. To radil i účetní, ale z jiných důvodů.'];
  function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function hash(text){let h=2166136261;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function shuffle(items,r){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  const rotate=mask=>((mask<<1)&15)|((mask&8)?1:0);
  function rotationTo(from,to){let mask=from;for(let n=0;n<4;n++){if(mask===to)return n===3?-1:n;mask=rotate(mask);}return null;}
  function neighbors(index,size){const x=index%size,y=Math.floor(index/size);return DIRS.filter(d=>x+d.dx>=0&&x+d.dx<size&&y+d.dy>=0&&y+d.dy<size).map(d=>({index:(y+d.dy)*size+x+d.dx,...d}));}
  function freeConnected(size,blocked,excluded){const cells=Array.from({length:size*size},(_,i)=>i).filter(i=>!blocked.has(i)&&i!==excluded),seen=new Set([cells[0]]),queue=[cells[0]];for(let p=0;p<queue.length;p++)for(const n of neighbors(queue[p],size))if(n.index!==excluded&&!blocked.has(n.index)&&!seen.has(n.index)){seen.add(n.index);queue.push(n.index);}return seen.size===cells.length;}
  function makePuzzle(seed,areaId,level){
    const a=SIGNAL_AREAS[areaId],r=random(seed),size=a.size,sourceRow=Math.floor(r()*size),source=sourceRow*size,walls=new Set();
    // Keep the free board connected even without the source. It can then have
    // one outgoing wire, so any scrambled solved board can safely be disconnected.
    const interior=shuffle(Array.from({length:size*size},(_,i)=>i).filter(i=>i%size>0&&i%size<size-1&&Math.floor(i/size)>0&&Math.floor(i/size)<size-1),r);
    for(const i of interior){if(walls.size>=a.walls[level])break;walls.add(i);if(!freeConnected(size,walls,source))walls.delete(i);}
    const attach=shuffle(neighbors(source,size).filter(n=>!walls.has(n.index)),r)[0].index;
    const tree=Array.from({length:size*size},()=>[]),visited=new Set([attach]);let frontier=neighbors(attach,size).filter(n=>n.index!==source&&!walls.has(n.index)).map(n=>[attach,n.index]);
    while(frontier.length){const at=Math.floor(r()*frontier.length),[from,to]=frontier[at];frontier[at]=frontier.at(-1);frontier.pop();if(visited.has(to))continue;visited.add(to);tree[from].push(to);tree[to].push(from);for(const n of neighbors(to,size))if(n.index!==source&&!walls.has(n.index)&&!visited.has(n.index))frontier.push([to,n.index]);}
    tree[source].push(attach);tree[attach].push(source);
    const parent=Array(size*size).fill(-1),depth=Array(size*size).fill(0),queue=[source];parent[source]=source;
    for(let p=0;p<queue.length;p++)for(const next of tree[queue[p]])if(parent[next]===-1){parent[next]=queue[p];depth[next]=depth[queue[p]]+1;queue.push(next);}
    const rows=shuffle(Array.from({length:size},(_,i)=>i),r).slice(0,a.targets[level]).sort((x,y)=>x-y),names=shuffle(['Obec','Škola','Knihovna','Studio B','Klub','Náměstí'],r);
    const targets=rows.map((row,i)=>({row,index:row*size+size-1,name:names[i],online:false})),required=new Set([source]),edges=new Set();
    function addPath(index){while(index!==source){const previous=parent[index];required.add(index);required.add(previous);edges.add(Math.min(index,previous)+':'+Math.max(index,previous));index=previous;}}
    targets.forEach(t=>addPath(t.index));
    const relays=[];for(let i=0;i<a.relays[level];i++){
      const candidates=shuffle(queue.filter(n=>n%size>0&&n%size<size-1&&!relays.includes(n)),r).sort((x,y)=>Number(required.has(x))-Number(required.has(y)));
      const index=candidates[0];relays.push(index);addPath(index);
    }
    const shapes=[N|E,N|S,N|E,N|E|S,N],solution=Array.from({length:size*size},(_,i)=>walls.has(i)?0:required.has(i)?0:shapes[Math.floor(r()*shapes.length)]);
    for(const edge of edges){const [from,to]=edge.split(':').map(Number),d=neighbors(from,size).find(n=>n.index===to);solution[from]|=d.bit;solution[to]|=d.op;}
    solution[source]|=W;targets.forEach(t=>solution[t.index]|=E);
    const locked=new Set(shuffle([...required].filter(i=>i!==source&&!relays.includes(i)&&!targets.some(t=>t.index===i)&&rotate(solution[i])!==solution[i]),r).slice(0,a.locks[level]));
    const initial=solution.map((mask,i)=>{if(locked.has(i)||walls.has(i))return mask;for(let n=Math.floor(r()*4);n>0;n--)mask=rotate(mask);return mask;});
    // Start with a real task, never an already solved puzzle.
    while(initial[source]&W)initial[source]=rotate(initial[source]);
    const mutable=[...required].filter(i=>!locked.has(i));
    let baseline=mutable.reduce((sum,i)=>sum+Math.abs(rotationTo(initial[i],solution[i])),0);
    const desired=5+level+(size-4)*2;
    for(const i of shuffle(mutable,r)){
      if(baseline>=desired)break;let best=initial[i],cost=Math.abs(rotationTo(initial[i],solution[i])),mask=solution[i];
      for(let n=0;n<4;n++,mask=rotate(mask)){if(i===source&&(mask&W))continue;const next=Math.abs(rotationTo(mask,solution[i]));if(next>cost){cost=next;best=mask;}}
      baseline+=cost-Math.abs(rotationTo(initial[i],solution[i]));initial[i]=best;
    }
    return {size,sourceRow,source,targets,relays,walls,locked,solution,initial,required:[...required].sort((x,y)=>depth[x]-depth[y]),baseline};
  }
  function signalDailyChallenge(date=new Date()){
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(x=>[x.type,x.value]));
    const daily=p.year+'-'+p.month+'-'+p.day;return {mode:'daily',daily,seed:hash('signal-v3:'+daily),practice:false};
  }
  class Signal{
    constructor(options={}){
      if(typeof options==='number')options={seed:options,mode:'random'};
      const areaId=SIGNAL_AREAS[options.areaId]?options.areaId:'obec',level=Math.max(0,Math.min(5,Math.floor(Number(options.level)||0))),mode=['campaign','random','daily'].includes(options.mode)?options.mode:'campaign';
      this.options={areaId,level,mode,seed:(options.seed??(mode==='campaign'?hash('signal-campaign-v3:'+areaId+':'+level):Date.now()))>>>0,practice:mode!=='daily'&&!!options.practice,daily:mode==='daily'?options.daily||'':''};this.reset();
    }
    reset(){
      Object.assign(this,this.options);this.code=this.seed.toString(36).toUpperCase().padStart(7,'0');this.round=0;this.score=0;this.totalMoves=0;this.totalHints=0;this.phase='ready';this.paused=false;this.events=[];this.history=[];this.recorded=false;
      const r=random(this.seed),areas=shuffle(Object.keys(SIGNAL_AREAS),r);
      this.jobs=Array.from({length:this.mode==='campaign'?1:3},(_,i)=>{const areaId=this.mode==='daily'?areas[i]:this.areaId,level=this.mode==='daily'?i+2:Math.min(5,this.level+i),job=SIGNAL_JOBS.find(j=>j.areaId===areaId&&j.level===level);return {...job,seed:this.mode==='campaign'?this.seed:hash(this.seed+':'+i+':'+areaId)};});
      this.loadRound();
    }
    get job(){return this.jobs[this.round];}
    get roundCount(){return this.jobs.length;}
    get stars(){return this.phase==='won'?Math.min(...this.history.map(r=>r.stars)):0;}
    get badges(){const ids=[];if(this.history.length)ids.push('first');if(this.history.some(r=>r.stars===3))ids.push('clean');if(this.history.some(r=>r.targets>=3))ids.push('branches');if(this.history.some(r=>r.relays>=2))ids.push('relays');if(this.history.some(r=>r.walls>=6))ids.push('field');if(this.history.some(r=>r.jobId==='noc-6'))ids.push('night');if(this.mode==='daily'&&this.phase==='won')ids.push('daily');return ids;}
    loadRound(){
      this.area=SIGNAL_AREAS[this.job.areaId];const p=makePuzzle(this.job.seed,this.job.areaId,this.job.level);Object.assign(this,p);this.tiles=[...p.initial];this.moves=0;this.hintsUsed=0;this.hintsLeft=2;this.hint=null;this.restarts=0;this.undoStack=[];this.limit=this.area.seconds+this.job.level*10;this.remaining=this.limit;this.quip=this.job.quip;this.refresh();
    }
    start(){if(this.phase!=='ready')return false;this.phase='playing';return true;}
    refresh(){
      this.connected=new Set();if(this.tiles[this.source]&W){const queue=[this.source];this.connected.add(this.source);for(let p=0;p<queue.length;p++){const from=queue[p];for(const d of neighbors(from,this.size))if((this.tiles[from]&d.bit)&&(this.tiles[d.index]&d.op)&&!this.connected.has(d.index)){this.connected.add(d.index);queue.push(d.index);}}}
      for(const t of this.targets)t.online=this.connected.has(t.index)&&!!(this.tiles[t.index]&E);
      this.online=this.targets.filter(t=>t.online).length;this.relaysOnline=this.relays.filter(i=>this.connected.has(i)).length;this.solved=this.online===this.targets.length&&this.relaysOnline===this.relays.length;
    }
    canTurn(i){return this.phase==='playing'&&!this.paused&&Number.isInteger(i)&&i>=0&&i<this.tiles.length&&!this.walls.has(i)&&!this.locked.has(i);}
    turn(i,direction=1){
      if(!this.canTurn(i)||![1,-1].includes(direction))return false;const before=this.tiles[i];let after=before;for(let n=direction===1?1:3;n>0;n--)after=rotate(after);
      this.undoStack.push({i,before});this.tiles[i]=after;this.moves++;this.totalMoves++;if(this.hint?.index===i)this.hint=null;this.refresh();this.events.push({type:'turn'});
      if(this.moves%12===0)this.quip=TURN_QUIPS[(Math.floor(this.moves/12)+this.seed)%TURN_QUIPS.length];if(this.solved)this.completeRound();return true;
    }
    undo(){
      if(this.phase!=='playing'||this.paused||!this.undoStack.length)return false;const {i,before}=this.undoStack.pop();this.tiles[i]=before;this.moves++;this.totalMoves++;this.hint=null;this.quip='Krok zpět. To je v technice metoda, na poradě politický problém.';this.refresh();this.events.push({type:'turn'});return true;
    }
    askHint(){
      if(this.phase!=='playing'||this.paused)return false;if(this.hint)return this.hint;if(!this.hintsLeft)return false;
      const index=this.required.find(i=>!this.locked.has(i)&&this.tiles[i]!==this.solution[i]);if(index===undefined)return false;
      this.hintsLeft--;this.hintsUsed++;this.totalHints++;this.hint={index,turns:rotationTo(this.tiles[index],this.solution[index]),mask:this.solution[index]};this.quip='Kvído: „Vím, kam s tím. Do faktury napíšu konzultace.“';this.events.push({type:'signal-hint'});return this.hint;
    }
    restartRound(){
      if(this.phase!=='playing'||this.paused)return false;this.tiles=[...this.initial];this.moves=0;this.restarts++;this.undoStack=[];this.hint=null;this.remaining=this.limit;this.quip='Stejná síť, nový nádech. Počet restartů si ale technická knížka pamatuje.';this.refresh();this.events.push({type:'signal-restart'});return true;
    }
    completeRound(){
      if(this.phase!=='playing'||!this.solved)return;
      const stars=!this.hintsUsed&&!this.restarts&&this.moves<=this.baseline?3:this.hintsUsed<=1&&this.restarts<=1&&this.moves<=Math.max(this.baseline+4,Math.ceil(this.baseline*1.6))?2:1;
      const score=Math.max(100,Math.round(500+250*Math.min(1,this.baseline/Math.max(1,this.moves))-50*this.hintsUsed-40*this.restarts));
      this.history.push({jobId:this.job.id,areaId:this.job.areaId,name:this.job.name,seed:this.job.seed,stars,score,moves:this.moves,baseline:this.baseline,hints:this.hintsUsed,restarts:this.restarts,targets:this.targets.length,relays:this.relays.length,walls:this.walls.size,recorded:false});this.score+=score;
      this.phase=this.round===this.roundCount-1?'won':'round-won';this.quip='Všichni slyší. Teď prosím nezakopnout o ten poslední kabel.';this.events.push({type:this.phase==='won'?'won':'connected'});
    }
    next(){if(this.phase!=='round-won'||this.paused)return false;this.round++;this.loadRound();this.phase='playing';return true;}
    update(dt){if(this.phase!=='playing'||this.paused||this.practice||!Number.isFinite(dt)||dt<=0)return;this.remaining=Math.max(0,this.remaining-dt);if(!this.remaining){this.phase='lost';this.quip='Čas vypršel. V éteru zůstal jen povzdech technického oddělení.';this.events.push({type:'lost'});}}
  }
  const api={Signal,SIGNAL_AREAS,SIGNAL_JOBS,SIGNAL_BADGES,signalDailyChallenge,rotate,rotationTo,makePuzzle};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SignalGame=api;
})(typeof window!=='undefined'?window:globalThis);
