(function (root) {
  'use strict';
  const defense=typeof module!=='undefined'&&module.exports?require('./defender.js'):root.DefenderGame;
  const STORIES=[
    {headline:'Od pondělí pojede tramvaj jinudy.',source:'Aktuální jízdní řád přímo od dopravního podniku. Datum i číslo linky souhlasí.',ready:true,why:'Máme aktuální primární zdroj a ověřené podrobnosti. Zpráva může ven.'},
    {headline:'Starosta prý zítra zavře všechny školy.',source:'Přeposlaný screenshot bez odkazu. Autor ani datum nejsou známé.',ready:false,why:'Screenshot není potvrzení. Najdi původ zprávy a vyžádej si stanovisko města.'},
    {headline:'Město schválilo peníze na novou knihovnu.',source:'Zveřejněné usnesení zastupitelstva. Částka i výsledek hlasování jsou ověřené.',ready:true,why:'Rozhodnutí dokládá veřejný dokument. Přesný rozsah usnesení máme ověřený.'},
    {headline:'Tahle fotografie zachycuje dnešní povodeň.',source:'Obrázek ze sociální sítě. Vyhledávání našlo stejnou fotografii už před pěti lety.',ready:false,why:'Fotografie patří k jiné události. Bez ověření místa a času by titulek klamal.'},
    {headline:'V centru zdražilo parkování o třetinu.',source:'Nový a předchozí oficiální ceník. Výpočet se týká centrální zóny uvedené v titulku.',ready:true,why:'Srovnání má jasnou základnu, platné ceníky i správně vymezený rozsah.'},
    {headline:'Nezaměstnanost raketově roste!',source:'Graf bez popisků os, období a původu dat. Není jasné, co vlastně ukazuje.',ready:false,why:'Nejdřív zjisti zdroj, období a měřítko grafu. Obrázek sám tvrzení nedokládá.'},
    {headline:'Most bude o víkendu uzavřený.',source:'Aktuální oznámení správce silnice. Termín jsme ověřili také u města.',ready:true,why:'Dva relevantní zdroje potvrzují stejný termín a rozsah omezení.'},
    {headline:'Všichni obyvatelé podporují novou stavbu.',source:'Anketa ve skupině příznivců projektu. Odpovědělo 28 lidí.',ready:false,why:'Výběrová anketa nepopisuje všechny obyvatele. Uveď, kdo a jak se jí účastnil.'},
    {headline:'Zastupitelka slíbila dokončit opravu letos.',source:'Celý záznam veřejného jednání. Citace je přesná a její kontext jsme poslechli.',ready:true,why:'Přesnost citace i kontext máme ověřené. Slib jasně připisujeme jeho autorce.'},
    {headline:'Tajný dokument odhaluje velký skandál.',source:'Anonymní e-mail s neúplnou přílohou. Pravost dokumentu zatím nikdo nepotvrdil.',ready:false,why:'Tip je začátek práce. Ověř pravost dokumentu a dej dotčeným prostor k vyjádření.'},
    {headline:'Letos přišlo na festival 12 tisíc lidí.',source:'Pořadatel dodal pouze odhad pro příští ročník. Letošní výsledek neznáme.',ready:false,why:'Odhad budoucnosti není výsledek minulosti. Číslo i časový údaj potřebují opravu.'},
    {headline:'Ve středu se otevře nové dětské oddělení knihovny.',source:'Potvrzený termín od knihovny a zveřejněná otevírací doba. Adresa ověřena.',ready:true,why:'Máme ověřený termín, místo i praktické informace pro čtenáře.'}
  ];
  function random(seed){let a=seed>>>0;return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
  class Verify {
    constructor(seed=Date.now()){this.seed=seed;this.reset();}
    reset(){const r=random(this.seed);this.cards=[...STORIES];for(let i=this.cards.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[this.cards[i],this.cards[j]]=[this.cards[j],this.cards[i]];}this.cards=this.cards.slice(0,8);this.index=0;this.correct=0;this.score=0;this.combo=0;this.remaining=60;this.phase='ready';this.paused=false;this.feedback=null;this.events=[];}
    get card(){return this.cards[this.index];}
    start(){if(this.phase==='ready'){this.phase='playing';return true;}return false;}
    submit(ready){if(this.phase!=='playing'||this.paused||this.feedback)return false;const correct=ready===this.card.ready;if(correct){this.correct++;this.combo++;this.score+=100+Math.max(0,this.combo-1)*15;}else this.combo=0;this.feedback={correct,why:this.card.why};this.events.push({type:correct?'correct':'incorrect'});return this.feedback;}
    next(){if(!this.feedback||this.phase!=='playing')return false;this.feedback=null;this.index++;if(this.index>=this.cards.length){this.phase='won';this.events.push({type:'won'});}return true;}
    update(dt){if(this.phase!=='playing'||this.paused||this.feedback)return;this.remaining=Math.max(0,this.remaining-dt);if(this.remaining===0){this.phase='lost';this.events.push({type:'lost'});}}
  }
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
  const api={...defense,Verify,Signal,rotate,PUZZLE_PATHS};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MediaGames=api;
})(typeof window!=='undefined'?window:globalThis);
