(() => {
  'use strict';
  const {Defender,Verify,Signal,TOWERS,MAPS,DIFFICULTIES,ENEMIES,BONUSES,TARGET_MODES,WAVE_NAMES,dailyChallenge}=window.MediaGames;
  const $=id=>document.getElementById(id);
  const format=n=>Math.round(n).toLocaleString('cs-CZ');
  const icons={
    verify:'<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true"><path d="M8 16h18v13H8Z" fill="#416282" stroke="#14202a" stroke-width="2"/><path d="M11 3h13v12H11Z" fill="#fffce7" stroke="#14202a" stroke-width="2"/><path d="M10 2h15v4H10Zm-1 6h7v5H9Zm10 0h7v5h-7Z" fill="#14202a"/><path d="M16 10h3" stroke="#14202a" stroke-width="2"/><path d="M4 20h11v10H4Z" fill="#fffce7" stroke="#14202a" stroke-width="2"/><circle cx="23" cy="22" r="5" fill="#e5f041" stroke="#14202a" stroke-width="2"/><path d="m26 26 5 5" stroke="#14202a" stroke-width="3"/></svg>',
    reporter:'<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true"><path d="M7 15h18v15H7Z" fill="#416282" stroke="#14202a" stroke-width="2"/><path d="M11 3h12v11H11Z" fill="#f4dfbe" stroke="#14202a" stroke-width="2"/><path d="M10 1h14v5H10Zm10 6h3v2h-3Z" fill="#14202a"/><path d="M14 16h5v11h-5Z" fill="#fffce7"/><path d="M16 16h2v9h-2Z" fill="#ed6a49"/><path d="m23 22 5-7" stroke="#14202a" stroke-width="3"/><path d="M25 7h6v10h-6Z" fill="#b9d9d9" stroke="#14202a" stroke-width="2"/></svg>',
    community:'<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 21h12v9H1Zm19 0h11v9H20Z" fill="#426979" stroke="#14202a" stroke-width="2"/><path d="M4 12h8v8H4Zm17 0h8v8h-8ZM12 3h10v10H12Z" fill="#fffce7" stroke="#14202a" stroke-width="2"/><path d="M10 16h14v14H10Z" fill="#df6546" stroke="#14202a" stroke-width="2"/><path d="M12 1h10v4H12ZM4 10h8v3H4Zm17 0h8v3h-8Z" fill="#14202a"/></svg>'
  };
  const meta={
    defender:{kicker:'P101 / STRATEGICKÁ OBRANA VYSÍLÁNÍ',title:'KAVKY <span>DEFENDER</span>',description:'Škrty jdou po kabelu. Ty jdeš po nich.',note:'REŽIE, POZOR.<br>MÁME TU ŠKRTY.',welcome:'Vysílání tě potřebuje.',welcomeText:'Postav obrany na +. Přežij osm vln, na poradě vybírej bonusy a v nouzi přivolej kavčí nálet klávesou K. Kávovar je strategický cíl.',start:'Jdu bránit vysílání',icon:'◉',hint:'<span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> vyber obranu</span><span><kbd>←</kbd><kbd>→</kbd> stanoviště <kbd>Enter</kbd> postav</span><span><kbd>K</kbd> kavčí nálet <kbd>mezerník</kbd> vlna / pauza</span>'},
    verify:{kicker:'02 / VE SLUŽBĚ FAKTŮM',title:'OVĚŘENO<span>!</span>',description:'Rychlost je fajn. Důvěra je víc. Rozhodni, které zprávy<br class="desktop-break"> mají dost podkladů k vydání — a které potřebují ještě práci.',note:'Každá dobrá zpráva<br>začíná dobrou otázkou.',welcome:'Titulek není celý příběh.',welcomeText:'Osm zpráv, 60 sekund čistého času. Čti podklady a rozhodni: může zpráva ven, nebo potřebuje ještě ověřit? Vysvětlení si můžeš přečíst v klidu.',start:'Zasednout do redakce',icon:'✓',hint:'<span><kbd>F</kbd> ještě ověřit</span><span><kbd>J</kbd> může ven</span><span><kbd>Enter</kbd> další zpráva <kbd>mezerník</kbd> pauza</span>'},
    signal:{kicker:'03 / AŤ JE NÁS SLYŠET',title:'DRŽ <span>SIGNÁL</span>',description:'Dobrá informace má najít cestu ke každému.<br class="desktop-break"> Otoč dílky, propoj vysílání a překonej tři zamotané okruhy.',note:'Spojení, na kterém<br>záleží.',welcome:'Najdi společnou vlnu.',welcomeText:'Kliknutím otáčej dílky o čtvrt otáčky. Spoj studio vlevo s veřejností vpravo. Zelená linka ukazuje, kudy už signál teče. Tři okruhy, každý na 90 sekund.',start:'Naladit se',icon:'≋',hint:'<span><kbd>kliknutí</kbd> otočit dílek</span><span><kbd>šipky</kbd> pohyb po mapě <kbd>Enter</kbd> otočit</span><span><kbd>mezerník</kbd> pauza</span>'}
  };
  const controllers={
    defender:{engine:new Defender(),started:false,speed:1,view:{selectedType:'verify',selectedTower:null,hoverSlot:-1,hoverEnemy:null}},
    verify:{engine:new Verify(),started:false,speed:1},
    signal:{engine:new Signal(),started:false,speed:1}
  };
  let current='defender',lastFrame=0,lastUI=0,overlayKey='',sound=false,audioContext=null,toastTimeout,dialogPause=null;
  let best={};try{const raw=JSON.parse(localStorage.getItem('vysilame-dal-scores')||'{}');for(const key of Object.keys(controllers))if(Number.isFinite(raw[key])&&raw[key]>=0)best[key]=raw[key];}catch{}
  let defenderRecords={};
  try{const raw=JSON.parse(localStorage.getItem('kavky-records-v2')||'{}');for(const mapId of Object.keys(MAPS))for(const mode of Object.keys(DIFFICULTIES)){const key=mapId+':'+mode,r=raw[key];if(r&&Number.isFinite(r.score)&&r.score>=0)defenderRecords[key]={score:r.score,stars:Math.max(0,Math.min(3,Number(r.stars)||0)),wins:Math.max(0,Number(r.wins)||0)};}}catch{}
  const recordKey=g=>g.mapId+':'+g.difficulty;
  const active=()=>controllers[current],game=()=>active().engine;
  const setText=(id,value)=>{const el=$(id);if(el.textContent!==String(value))el.textContent=value;};
  const renderedHTML=new WeakMap();
  const setHTML=(id,value)=>{const el=$(id);if(renderedHTML.get(el)!==value){el.innerHTML=value;renderedHTML.set(el,value);}};
  function toast(message){clearTimeout(toastTimeout);$('toast').textContent=message;$('toast').classList.add('visible');toastTimeout=setTimeout(()=>$('toast').classList.remove('visible'),3100);}
  function note(frequency=440,duration=.09,type='sine'){
    if(!sound)return;
    try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type;osc.frequency.setValueAtTime(frequency,audioContext.currentTime);gain.gain.setValueAtTime(.045,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration);}catch{}
  }
  function saveBest(){const g=game(),score=g.score;
    if(current==='defender'){
      if(g.recorded)return;g.recorded=true;const key=recordKey(g),old=defenderRecords[key]||{score:0,stars:0,wins:0};
      defenderRecords[key]={score:Math.max(old.score,score),stars:Math.max(old.stars,g.stars),wins:old.wins+(g.phase==='won'?1:0)};
      try{localStorage.setItem('kavky-records-v2',JSON.stringify(defenderRecords));}catch{}
    }else if(Number.isFinite(score)&&score>(best[current]||0)){best[current]=score;try{localStorage.setItem('vysilame-dal-scores',JSON.stringify(best));}catch{}}
  }
  function events(){const g=game();for(const event of g.events.splice(0)){
    if(event.type==='build')note(370,.08,'triangle');
    if(event.type==='upgrade')note(620,.13,'triangle');
    if(event.type==='wave')toast('Vlna '+event.wave+': '+event.name+'. Zobáky do pohotovosti.');
    if(event.type==='arrival'){const enemy=ENEMIES[event.enemy];g.quip=enemy.quip;toast('Do éteru vstupuje '+enemy.name+'. Atlas poradí, co na něj.');}
    if(event.type==='clear'){toast('Vlna vyřízena. +'+event.bonus+' podpory. Kávu si hradíme sami.');note(660,.15);}
    if(event.type==='bonus'){note(740,.15);toast(BONUSES[event.bonus].name+': '+BONUSES[event.bonus].text);}
    if(event.type==='flock'){note(980,.2,'triangle');toast(g.quip);}
    if(event.type==='leak')note(150,.15,'triangle');
    if(event.type==='correct'||event.type==='connected')note(660,.13);
    if(event.type==='incorrect')note(190,.15);
    if(event.type==='turn')note(330,.035,'triangle');
    if(event.type==='won'){saveBest();note(880,.3);}
    if(event.type==='lost'){saveBest();note(130,.28,'triangle');}
  }}
  function minimap(map){const ground={park:'#7b9c57',city:'#969f9d',region:'#a3b763',night:'#222a49'}[map.theme],road=map.theme==='night'?'#7885a3':'#d6d7bc';return '<svg viewBox="0 0 960 576" shape-rendering="crispEdges" aria-hidden="true"><rect width="960" height="576" fill="'+ground+'"/>'+map.paths.map(path=>'<polyline points="'+path.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#14202a" stroke-width="88" stroke-linejoin="miter"/><polyline points="'+path.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="'+road+'" stroke-width="60" stroke-linejoin="miter"/>').join('')+map.slots.map(([x,y])=>'<rect x="'+(x-15)+'" y="'+(y-15)+'" width="30" height="30" fill="#f3ee7a"/>').join('')+'<rect x="797" y="290" width="106" height="75" fill="#213d78"/><rect x="812" y="300" width="76" height="21" fill="#fffce7"/></svg>';}
  function medalStars(count){return '✦'.repeat(count)+'·'.repeat(3-count);}
  function renderDefenderSetup(){
    const c=controllers.defender,g=c.engine,locked=c.started&&!['won','lost'].includes(g.phase)&&(g.wave>0||g.towers.length>0);
    for(const b of $('map-list').children){const id=b.dataset.map,r=defenderRecords[id+':'+g.difficulty];b.classList.toggle('selected',id===g.mapId);b.setAttribute('aria-pressed',String(id===g.mapId));b.disabled=locked;const stars=b.querySelector('.map-medals');stars.textContent=medalStars(r?.stars||0);stars.setAttribute('aria-label','Získáno '+(r?.stars||0)+' ze 3 medailí');}
    $('difficulty-select').value=g.difficulty;$('difficulty-select').disabled=locked;
    $('daily-button').classList.toggle('selected',!!g.daily);setText('shift-code',(g.daily?'DNEŠNÍ · ':'SMĚNA № ')+g.code);
    setText('map-picker-title',c.started?g.map.name+' · '+DIFFICULTIES[g.difficulty].name:'MAPA: '+g.map.name);
    const won=Object.keys(MAPS).filter(id=>Object.keys(DIFFICULTIES).some(mode=>(defenderRecords[id+':'+mode]?.stars||0)>0)).length;
    setText('campaign-progress',locked?'Rozehraná směna. Novou začneš tlačítkem ↻.':'ZACHRÁNĚNO '+won+' / 4');
    setText('map-rule',g.map.name+' — '+g.map.rule);
  }
  function newDefender(options){const c=controllers.defender;c.engine=new Defender(options);c.started=false;c.speed=1;c.view={selectedType:'verify',selectedTower:null,hoverSlot:-1,hoverEnemy:null};overlayKey='';$('defender-map-picker').open=!matchMedia('(max-width:540px)').matches;render(true);}
  function atlas(){return '<h2>Kdo nám leze do éteru?</h2><p>Jedenáct druhů smyšlené škodné. V přírodě by se měly krmit. Tady stačí důsledné otázky.</p><div class="enemy-album">'+Object.entries(ENEMIES).map(([id,e])=>'<article class="enemy-file"><img class="enemy-portrait" src="'+window.MediaDraw.portrait(id)+'" alt=""><h3>'+e.name+'</h3><p class="enemy-quip">„'+e.quip+'“</p><p>'+e.ability+'</p><p class="enemy-counter"><strong>Co na něj:</strong> '+e.counter+'</p></article>').join('')+'</div>';}
  function selectGame(name){
    if(!controllers[name])return;
    if(name!==current&&active().started&&!['won','lost'].includes(game().phase))game().paused=true;
    current=name;overlayKey='';
    for(const button of document.querySelectorAll('[data-game]')){const selected=button.dataset.game===name;button.classList.toggle('active',selected);button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1;}
    $('game-panel').setAttribute('aria-labelledby','tab-'+name);
    setText('game-kicker',meta[name].kicker);setHTML('game-title',meta[name].title);setHTML('game-description',meta[name].description);setHTML('intro-note',meta[name].note);setHTML('keyboard-hint',meta[name].hint);
    $('defender-canvas').hidden=name!=='defender';$('verify-view').hidden=name!=='verify';$('signal-view').hidden=name!=='signal';
    for(const id of Object.keys(controllers))$(id+'-tools').hidden=id!==name;
    $('defender-legend').hidden=name!=='defender';$('speed-button').hidden=name!=='defender';$('defender-setup').hidden=name!=='defender';$('defender-action-bar').hidden=name!=='defender';document.body.classList.toggle('is-defender',name==='defender');
    document.title=({defender:'Kavky Defender',verify:'Ověřeno!',signal:'Drž signál'})[name]+' — Vysíláme dál.';
    render(true);requestAnimationFrame(alignSignalEnds);
  }
  function start(){active().started=true;if(current!=='defender')game().start();else{$('defender-map-picker').open=false;game().quip=game().say('welcome');}game().paused=false;overlayKey='';render(true);note(440,.1);if(current==='defender')toast('Redakce má službu. Postav obrany a spusť vlnu.');}
  function reset(same=false){const c=active();if(current==='verify')c.engine=new Verify();else if(current==='signal')c.engine=new Signal();else{const g=c.engine;c.engine=new Defender(same===true?g.options:{mapId:g.mapId,difficulty:g.difficulty});c.view={selectedType:'verify',selectedTower:null,hoverSlot:-1,hoverEnemy:null};$('defender-map-picker').open=!matchMedia('(max-width:540px)').matches;}c.started=false;c.speed=1;overlayKey='';render(true);}
  function togglePause(){if(!active().started||['won','lost','round-won','briefing'].includes(game().phase))return;game().paused=!game().paused;overlayKey='';render(true);}
  function primaryAction(){const g=game();if(!active().started){start();return;}if(g.paused)return;if(current==='defender')g.startWave();else if(current==='verify'&&g.feedback)g.next();else if(current==='signal'&&g.phase==='round-won')g.next();events();overlayKey='';render(true);}
  function overlay(){
    const c=active(),g=game(),m=meta[current];let kind=!c.started?(current==='defender'?'':'welcome'):g.paused?'paused':['won','lost','round-won','briefing'].includes(g.phase)?g.phase:'';
    const key=current+':'+kind+':'+(g.round||0)+':'+(g.wave||0)+':'+(g.code||'');if(key===overlayKey)return;overlayKey=key;$('board-overlay').hidden=!kind;if(!kind)return;
    let html='',extraClass='';
    if(kind==='welcome')html='<div class="overlay-icon" aria-hidden="true">'+m.icon+'</div><p class="eyebrow">'+(current==='defender'?g.map.name.toUpperCase()+' · '+DIFFICULTIES[g.difficulty].name.toUpperCase():'MALÁ HRA. VELKÁ VĚC.')+'</p><h2>'+m.welcome+'</h2><p>'+m.welcomeText+'</p><button class="primary-button" data-action="start">'+m.start+' <span aria-hidden="true">→</span></button><span class="overlay-caption">MYŠ · DOTYK · KLÁVESNICE</span>';
    else if(kind==='paused')html='<div class="overlay-icon" aria-hidden="true">Ⅱ</div><p class="eyebrow">ODBOROVĚ SCHVÁLENÉ NADECHNUTÍ</p><h2>Jsme tu pořád.</h2><p>Hra stojí. Kvído hledá svůj hrnek. Až budeš připravený, můžeme pokračovat.</p><button class="primary-button" data-action="resume">Pokračovat <span aria-hidden="true">▶</span></button>';
    else if(kind==='briefing'){
      extraClass=' briefing-card';html='<p class="eyebrow">REDAKČNÍ PORADA · PO VLNĚ '+g.wave+'</p><h2>Tohle mohla být káva.</h2><p>Vyber jednu výhodu pro zbytek směny. Zápis z porady tentokrát netřeba.</p><div class="bonus-choices">'+g.briefing.map(id=>{const b=BONUSES[id];return '<button class="bonus-choice" data-action="bonus" data-bonus="'+id+'"><span class="bonus-icon">'+b.icon+'</span><span><strong>'+b.name+'</strong><small>'+b.text+'</small><em>'+b.quip+'</em></span><span aria-hidden="true">→</span></button>';}).join('')+'</div>';
    }else if(kind==='round-won')html='<div class="overlay-icon" aria-hidden="true">✓</div><p class="eyebrow">OKRUH '+(g.round+1)+' / 3</p><h2>Jsme ve spojení.</h2><p>Signál našel cestu k veřejnosti. Teď zkusíme o něco zamotanější okruh.</p><button class="primary-button" data-action="next-round">Další okruh <span aria-hidden="true">→</span></button>';
    else{
      const won=kind==='won';let title,body;
      if(current==='defender'){
        title=won?g.stars===3?'Zlatá kavka!':g.stars===2?'Stříbrný zobák!':'Bronzová sponka!':'Dneska vede příloha.';
        body=won?'Osm vln za námi. '+g.health+' % signálu přežilo. '+g.quip:'Signál se odmlčel. '+g.quip+' Stejná směna má stejné vlny — můžeš zkusit lepší plán.';
      }else if(current==='verify'){title=g.correct>=7?'Důvěra zasloužená.':g.correct>=5?'Dobrá redakční směna.':'Ještě jednu kontrolu.';body='Správně '+g.correct+' z 8 zpráv. '+(won?'Každá ověřená zpráva je malý kousek důvěry.':'Čas vypršel. Nezodpovězené zprávy zůstaly nevydané. Zkus další směnu.');}
      else{title=won?'Signál pro všechny.':'Tady to ještě šumí.';body=won?'Tři okruhy, jedno spojení. Dobré informace mají najít cestu ke každému.':'Čas došel. Začni od studia a sleduj zelenou linku. Každý dílek může být ten správný.';}
      html='<div class="overlay-icon" aria-hidden="true">'+(won?'✳':'↺')+'</div><p class="eyebrow">'+(current==='defender'?g.map.name.toUpperCase()+' · SMĚNA '+g.code:won?'HOTOVO. DÍKY ZA HRU.':'KAŽDÝ POKUS SE POČÍTÁ.')+'</p><h2>'+title+'</h2>'+(current==='defender'&&won?'<div class="result-medals" aria-label="'+g.stars+' ze 3 medailí">'+medalStars(g.stars)+'</div>':'')+'<p>'+body+'</p><div class="overlay-score">'+format(g.score)+' <small style="font-size:10px">BODŮ</small></div><button class="primary-button" data-action="replay">'+(current==='defender'?'Stejná směna, lepší plán':'Zahrát znovu')+' <span aria-hidden="true">↺</span></button>'+(current==='defender'?'<div class="result-actions"><button class="text-button" data-action="new-shift">Jiná směna ↻</button><button class="text-button" data-action="choose-map">Jiná scéna ↗</button></div>':'<button class="text-button" data-action="next-game">Vyzkoušet další hru →</button>');
    }
    $('board-overlay').innerHTML='<div class="overlay-card'+extraClass+'">'+html+'</div>';
  }
  function metrics(){const g=game();let labels,values,icons_,tag;
    if(current==='defender'){labels=['SÍLA SIGNÁLU','PODPORA','VLNA'];values=[g.health+'<span> %</span>',format(g.money),g.wave+'<span> / '+g.waveCount+'</span>'];icons_=['◉','✳','≋'];tag=g.phase==='build'?'PŘÍPRAVA':g.phase==='wave'?'VYSÍLÁME':g.phase==='briefing'?'PORADA':g.phase==='won'?'UDRŽENO':'DOHRÁNO';$('health-track').hidden=false;$('health-track').firstElementChild.style.width=g.health+'%';$('health-track').firstElementChild.style.background=g.health>40?'#edfa45':'#ff6b4a';}
    else if(current==='verify'){labels=['ZBÝVÁ ČASU','SPRÁVNĚ','ZPRÁVA'];values=[Math.ceil(g.remaining)+'<span> s</span>',g.correct+'<span> / 8</span>',Math.min(g.index+1,8)+'<span> / 8</span>'];icons_=['◷','✓','▤'];tag=g.feedback?'ČTEME KONTEXT':'REDAKCE';$('health-track').hidden=true;}
    else{labels=['ZBÝVÁ ČASU','OTOČENÍ','OKRUH'];values=[Math.ceil(g.remaining)+'<span> s</span>',format(g.moves),(g.round+1)+'<span> / 3</span>'];icons_=['◷','↻','≋'];tag=g.solved?'SPOJENO':'LADÍME';$('health-track').hidden=true;}
    labels.forEach((v,i)=>{setText('metric-label-'+(i+1),v);setHTML('metric-value-'+(i+1),values[i]);setText('metric-icon-'+(i+1),icons_[i]);});setText('metric-tag',g.paused?'PAUZA':tag);const record=current==='defender'?defenderRecords[recordKey(g)]?.score:best[current];setText('best-score',record?format(record)+' b.':'—');
  }
  function controls(){const c=active(),g=game(),finished=['won','lost'].includes(g.phase),b=$('wave-button');
    if(!c.started){b.disabled=current==='defender';b.innerHTML=current==='defender'?'Postav obranu na +':'<span aria-hidden="true">▶</span> Začít hrát';}
    else if(current==='defender'){b.disabled=g.phase!=='build'||g.paused;b.innerHTML=g.phase==='briefing'?'Vyber bonus z porady':g.phase==='wave'?'Vlna '+g.wave+' probíhá':'<span aria-hidden="true">▶</span> '+(g.wave?'Další vlna':'Spustit vlnu');}
    else if(current==='verify'){b.disabled=!g.feedback||g.paused||finished;b.innerHTML=g.feedback?'Další zpráva →':'Rozhodni nad zprávou';}
    else{b.disabled=g.phase!=='round-won'||g.paused;b.innerHTML=g.phase==='round-won'?'Další okruh →':'Propoj dílky';}
    if(finished)b.disabled=true;
    $('pause-button').disabled=!c.started||finished||['round-won','briefing'].includes(g.phase);setText('pause-button',g.paused?'▶':'Ⅱ');$('pause-button').setAttribute('aria-label',g.paused?'Pokračovat ve hře':'Pozastavit hru');
    $('speed-button').disabled=!c.started||finished;$('speed-button').classList.toggle('active',c.speed===2);setText('speed-button',c.speed+'×');$('speed-button').setAttribute('aria-label','Rychlost hry: '+c.speed+'×');
    if(current==='signal')$('signal-restart-round').disabled=!c.started||g.phase!=='playing'||g.paused;
    if(current==='defender'){$('flock-button').disabled=!c.started||g.phase!=='wave'||g.paused||!g.enemies.length||g.panicCharges<=0||g.skillCooldown>0;setText('flock-count',g.panicCharges);setText('flock-hint',g.skillCooldown>0?'Kavky si rovnají peří: '+Math.ceil(g.skillCooldown)+' s.':g.panicCharges?'Zastaví protivníky a zobne do nich. Po 4. vlně přijde posila.':'Zobáky vyčerpány. Porada může přivolat posily.');}
  }
  function towers(){
    const c=controllers.defender,g=c.engine;renderDefenderSetup();
    for(const button of $('tower-options').children){const type=button.dataset.tower;button.classList.toggle('selected',c.view.selectedType===type&&!c.view.selectedTower);button.classList.toggle('unaffordable',g.money<g.cost(type));button.setAttribute('aria-pressed',String(c.view.selectedType===type&&!c.view.selectedTower));}
    const t=g.towers.find(t=>t.id===c.view.selectedTower);$('tower-detail').hidden=!t;
    if(t){const d=g.stats(t),cost=g.upgradeCost(t),locked=g.paused||!['build','wave'].includes(g.phase);setHTML('tower-detail','<h3>'+d.name+' · úroveň '+t.level+'/3</h3><p>Dosah '+Math.round(d.range)+' · zásah '+Math.round(d.damage)+'<br>Zastaveno: '+t.kills+(d.coffee?' · ☕ kofein aktivní':'')+(d.jammed?' · papírování A38!':'')+'</p><button class="target-button" data-target="'+t.id+'" '+(locked?'disabled':'')+'>Přednost: '+TARGET_MODES[t.target]+' ↻</button><div class="detail-actions"><button class="primary-button" data-upgrade="'+t.id+'" '+(t.level>=3||g.money<cost||locked?'disabled':'')+'>'+(t.level>=3?'Maximum':'Vylepšit · '+cost+' ✳')+'</button><button class="sell-button" data-sell="'+t.id+'" '+(locked?'disabled':'')+'>Prodat · '+Math.round(t.spent*.65)+'</button></div>');}
    const preview=g.preview();setText('wave-preview-label',g.phase==='wave'?'PRÁVĚ V ÉTERU':'PŘÍŠTÍ VLNA');setText('wave-preview-title',g.phase==='won'?'Konec směny. Krá.':g.phase==='wave'?WAVE_NAMES[g.wave-1]:WAVE_NAMES[g.wave]||'Signál se odmlčel.');
    const data=g.phase==='wave'?Object.values(g.enemies.reduce((all,e)=>{if(!all[e.type])all[e.type]={...ENEMIES[e.type],type:e.type,count:0};all[e.type].count++;return all;},{})):preview;
    setHTML('wave-preview-list',data.map(e=>'<span class="preview-enemy" title="'+e.name+': '+e.ability+'"><i style="background:'+e.color+'">'+e.glyph+'</i>'+e.count+'× '+e.short+'</span>').join('')||'<span class="preview-empty">Ani tlačítko „odpovědět všem“ už nic nepřivolá.</span>');
    setText('defender-tip',g.quip);
  }
  function renderVerify(){const g=controllers.verify.engine;if(!g.card)return;setText('story-number',String(g.index+1).padStart(2,'0')+' / 08');setText('story-headline',g.card.headline);setText('story-source',g.card.source);$('verify-choices').hidden=!!g.feedback;$('verify-feedback').hidden=!g.feedback;$('next-story').hidden=!g.feedback;if(g.feedback){$('verify-feedback').classList.toggle('wrong',!g.feedback.correct);setHTML('verify-feedback','<strong>'+(g.feedback.correct?'Přesně tak.':'Tady ještě pozor.')+'</strong>'+g.feedback.why);setText('next-story',g.index===7?'Dokončit směnu →':'Další zpráva →');}}
  const portNames={1:'sever',2:'východ',4:'jih',8:'západ'};
  function pipeSVG(mask){let d='';for(const [bit,x,y] of [[1,50,0],[2,100,50],[4,50,100],[8,0,50]])if(mask&bit)d+='M50 50 L'+x+' '+y+' ';return '<svg viewBox="0 0 100 100" aria-hidden="true"><path class="pipe-shadow" d="'+d+'"/><path class="pipe-line" d="'+d+'"/><circle class="pipe-center" cx="50" cy="50" r="9"/></svg>';}
  function renderSignal(){const g=controllers.signal.engine,grid=$('pipe-grid');if(!grid.children.length){for(let i=0;i<25;i++){const b=document.createElement('button');b.className='pipe-tile';b.dataset.tile=i;grid.appendChild(b);}}
    for(let i=0;i<25;i++){const b=grid.children[i],m=g.tiles[i],connected=g.connected.has(i);if(b.dataset.mask!==String(m)){b.innerHTML=pipeSVG(m);b.dataset.mask=m;}b.classList.toggle('connected',connected);b.setAttribute('aria-label','Řádek '+(Math.floor(i/5)+1)+', sloupec '+(i%5+1)+'. Spojení '+Object.keys(portNames).filter(v=>m&Number(v)).map(v=>portNames[v]).join(' a ')+'. '+(connected?'Signál připojen.':'Čeká na spojení.'));b.disabled=g.phase!=='playing'||g.paused;}
    setText('circuit-number','OKRUH '+String(g.round+1).padStart(2,'0'));$('signal-target').classList.toggle('reached',g.solved);alignSignalEnds();
  }
  function alignSignalEnds(){if(current!=='signal')return;const tile=$('pipe-grid').firstElementChild;if(!tile)return;const g=controllers.signal.engine,h=tile.getBoundingClientRect().height,gap=parseFloat(getComputedStyle($('pipe-grid')).gap)||0;for(const [id,row] of [['signal-source',g.sourceRow],['signal-target',g.targetRow]]){const circle=$(id).firstElementChild.getBoundingClientRect().height;$(id).style.top=row*(h+gap)+(h-circle)/2+'px';}}
  function render(force=false){metrics();controls();if(current==='defender')towers();else if(current==='verify')renderVerify();else renderSignal();overlay();}
  $('tower-options').innerHTML=Object.entries(TOWERS).map(([type,t],i)=>'<button class="tower-option '+(i===0?'selected':'')+'" data-tower="'+type+'" aria-pressed="'+(i===0)+'" title="'+t.description+'"><span class="tower-icon" style="--tower-color:'+t.color+'">'+icons[type]+'</span><span><strong>'+t.name+'</strong><small>'+t.tag+'</small></span><span class="tower-cost">'+t.cost+' ✳</span><kbd>'+(i+1)+'</kbd></button>').join('');
  $('tower-options').addEventListener('click',e=>{const b=e.target.closest('[data-tower]');if(!b)return;const c=controllers.defender;c.view.selectedType=b.dataset.tower;c.view.selectedTower=null;render();});
  $('tower-detail').addEventListener('click',e=>{const up=e.target.closest('[data-upgrade]'),sell=e.target.closest('[data-sell]'),target=e.target.closest('[data-target]');if(target){const g=controllers.defender.engine,t=g.towers.find(t=>t.id===Number(target.dataset.target));if(t){const modes=Object.keys(TARGET_MODES);g.setTarget(t.id,modes[(modes.indexOf(t.target)+1)%modes.length]);}}if(up)controllers.defender.engine.upgrade(Number(up.dataset.upgrade));if(sell){controllers.defender.engine.sell(Number(sell.dataset.sell));controllers.defender.view.selectedTower=null;}events();render();});
  function pickSlot(index){const c=controllers.defender,g=c.engine;if(g.paused||!['build','wave'].includes(g.phase))return;if(!c.started)start();c.view.hoverSlot=index;const t=g.occupied(index);if(t){c.view.selectedTower=t.id;render();return;}c.view.selectedTower=null;const type=c.view.selectedType;if(g.money<g.cost(type)){toast('Na tuto obranu chybí '+(g.cost(type)-g.money)+' podpory.');return;}g.build(index,type);events();render();}
  const canvas=$('defender-canvas');canvas.width=960*Math.min(devicePixelRatio||1,2);canvas.height=576*Math.min(devicePixelRatio||1,2);
  function pointerSlot(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*960,y=(e.clientY-r.top)/r.height*576;let index=-1,distance=Math.max(33,22*960/r.width);controllers.defender.engine.slots.forEach(([a,b],i)=>{const d=Math.hypot(x-a,y-b);if(d<distance){index=i;distance=d;}});return index;}
  canvas.addEventListener('pointermove',e=>{const c=controllers.defender,r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*960,y=(e.clientY-r.top)/r.height*576;c.view.hoverSlot=pointerSlot(e);c.view.hoverEnemy=c.engine.enemies.find(n=>Math.hypot(n.x-x,n.y-y)<24)?.id||null;});canvas.addEventListener('pointerleave',()=>{controllers.defender.view.hoverSlot=-1;controllers.defender.view.hoverEnemy=null;});canvas.addEventListener('click',e=>{const i=pointerSlot(e);if(i>=0)pickSlot(i);});
  $('pipe-grid').addEventListener('click',e=>{const b=e.target.closest('[data-tile]');if(!b)return;game().turn(Number(b.dataset.tile));events();render();});
  $('pipe-grid').addEventListener('keydown',e=>{const b=e.target.closest('[data-tile]');if(!b)return;const i=Number(b.dataset.tile),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-5,ArrowDown:5}[e.key];if(delta){e.preventDefault();e.stopPropagation();const next=i+delta;if(next>=0&&next<25&&(Math.abs(delta)===5||Math.floor(next/5)===Math.floor(i/5)))$('pipe-grid').children[next].focus();}});
  function answer(value){if(current!=='verify')return;game().submit(value);events();render();}
  $('hold-story').addEventListener('click',()=>answer(false));$('publish-story').addEventListener('click',()=>answer(true));$('next-story').addEventListener('click',()=>{game().next();events();render();});
  $('wave-button').addEventListener('click',primaryAction);$('pause-button').addEventListener('click',togglePause);$('reset-button').addEventListener('click',()=>reset());
  $('speed-button').addEventListener('click',()=>{active().speed=active().speed===1?2:1;render();});
  $('signal-restart-round').addEventListener('click',()=>{if(current!=='signal')return;const g=game();if(!active().started||g.phase!=='playing'||g.paused)return;g.generate();overlayKey='';render();toast('Okruh znovu naladěn.');});
  $('sound-button').addEventListener('click',()=>{sound=!sound;$('sound-button').setAttribute('aria-pressed',String(sound));$('sound-button').setAttribute('aria-label',sound?'Vypnout zvuk':'Zapnout zvuk');$('sound-button').title=sound?'Vypnout zvuk':'Zapnout zvuk';$('sound-button').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="'+(sound?'M17 8q6 4 0 8m-1-6q3 2 0 4':'m17 9 5 6m0-6-5 6')+'" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';if(sound)note(550,.12);});
  document.querySelectorAll('[data-game]').forEach((b,i,array)=>{b.addEventListener('click',()=>selectGame(b.dataset.game));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:2))%3;selectGame(array[next].dataset.game);array[next].focus();}});});
  $('board-overlay').addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;if(action==='start')start();if(action==='resume'){game().paused=false;overlayKey='';render();}if(action==='replay'){reset(true);start();}if(action==='new-shift'){reset();start();}if(action==='choose-map'){reset();$('defender-map-picker').open=true;$('defender-setup').scrollIntoView({behavior:'smooth',block:'start'});}if(action==='bonus'){game().chooseBonus(b.dataset.bonus);events();overlayKey='';render();}if(action==='next-game'){const names=Object.keys(controllers);selectGame(names[(names.indexOf(current)+1)%3]);}if(action==='next-round'){game().next();overlayKey='';render();}});
  const help={
    defender:'<h2>Jak udržet Kavky v éteru</h2><ol><li>Vyber Ověřovnu, Reportéra nebo Komunitu. Kliknutím na stanoviště <b>+</b> ji postavíš.</li><li>Spusť vlnu. Obrana zasahuje automaticky.</li><li>Za zastavený tlak získáš podporu. Kliknutím na postavenou obranu ji můžeš vylepšit nebo prodat.</li><li>Přežij všech osm vln s alespoň částí signálu. Kombinuj dosah reportérů se zpomalením komunity.</li></ol><p>Klávesy <b>1–3</b> vybírají obranu, <b>šipky</b> stanoviště, <b>Enter</b> staví nebo vybírá. <b>Mezerník</b> spustí další vlnu nebo pozastaví hru. Tlačítkem <b>1× / 2×</b> měníš rychlost. <b>K</b> přivolá nálet: 45 bodů zásahu a 2,2 sekundy zastavení. Začínáš se dvěma nálety, po čtvrté vlně přibude jeden.</p><p>Po vlnách 2, 4 a 6 si vybereš jeden trvalý bonus. U obrany můžeš měnit cíl: nejblíž cíli, nejsilnější nebo nejrychlejší. Všechny mapy jsou dostupné od začátku. Zlatá kavka vyžaduje alespoň 95 % signálu, stříbrná 60 %. Rekordy se ukládají zvlášť pro scénu i obtížnost.</p><p>Stejná směna opakuje stejné vlny i nabídky bonusů. Jiná směna je promíchá. Dnešní výzva má během jednoho dne stejné zadání.</p>',
    verify:'<h2>Rychle, ale s rozmyslem.</h2><p>Přečti titulek i podklady. Pokud tvrzení zatím není dostatečně doložené, zvol <b>Ještě ověřit (F)</b>. Když podklady sedí, zvol <b>Může ven (J)</b>.</p><p>Za správné rozhodnutí získáš 100 bodů, za sérii správných odpovědí bonus. Po každé odpovědi si přečti vysvětlení. Při něm se čas zastaví. Čeká tě osm smyšlených redakčních situací.</p>',
    signal:'<h2>Doveď signál až k lidem.</h2><p>Kliknutím otočíš dílek o 90° po směru hodinových ručiček. Spoj studio vlevo s veřejností vpravo. Živý signál poznáš podle zelené barvy.</p><p>Ne všechny dílky musíš využít. Na každý ze tří okruhů máš 90 sekund. Za dokončený okruh získáš 300 bodů a 5 bodů za každou zbývající sekundu. Po mapě se můžeš pohybovat šipkami, otáčet Enterem.</p>'
  };
  function openDialog(content,eyebrow,wide=false){if($('info-dialog').open)return;dialogPause={name:current,paused:game().paused};game().paused=true;setText('dialog-eyebrow',eyebrow);$('info-dialog').classList.toggle('wide-dialog',wide);$('dialog-content').innerHTML=content;$('info-dialog').showModal();render();}
  const about='<h2>Malé hry za velkou věc.</h2><p>Vysíláme dál je autorská série her na podporu nezávislých médií veřejné služby. Jejich smyslem je přístup k ověřeným informacím, kultuře, vzdělávání a hlasům z celé společnosti.</p><p>V každé hře pomáhá něco jiného: silná redakce, kritické myšlení nebo propojení s veřejností. Herní škrty, šum a tlak jsou zjednodušené metafory.</p><p>Podklad k aktuální debatě: <a href="https://www.ebu.ch/news/2026/10/concern-over-fast-tracked-debate-on-czech-public-service-media-funding" target="_blank" rel="noopener noreferrer">společné stanovisko EBU a dalších organizací z 23. října 2026</a>.</p><p>Nezávislý fanouškovský projekt. Není produktem České televize ani Českého rozhlasu. Hry fungují bez účtu; rekordy si pamatuje jen tvůj prohlížeč.</p>';
  $('about-button').addEventListener('click',()=>openDialog(about,'O PROJEKTU'));$('footer-about').addEventListener('click',()=>openDialog(about,'PROČ HRAJEME'));$('help-button').addEventListener('click',()=>openDialog(help[current],'JAK HRÁT'));
  $('close-dialog').addEventListener('click',()=>$('info-dialog').close());$('info-dialog').addEventListener('click',e=>{if(e.target===$('info-dialog')){const r=$('info-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('info-dialog').close();}});$('info-dialog').addEventListener('close',()=>{if(dialogPause){controllers[dialogPause.name].engine.paused=dialogPause.paused;dialogPause=null;}overlayKey='';render();});
  document.addEventListener('keydown',e=>{if($('info-dialog').open||e.ctrlKey||e.metaKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(e.target.closest('[role="tablist"]'))return;if(e.target.tagName==='BUTTON'&&[' ','Enter'].includes(e.key))return;const c=active(),g=game();
    if(e.key===' '){e.preventDefault();if(!c.started)start();else if(current==='defender'&&g.phase==='build'&&!g.paused)primaryAction();else togglePause();return;}
    if((!c.started&&current!=='defender')||g.paused||['won','lost','round-won','briefing'].includes(g.phase))return;
    if(current==='defender'){if(e.key.toLowerCase()==='k'){g.callFlock();events();render();}if(['1','2','3'].includes(e.key)){c.view.selectedType=Object.keys(TOWERS)[Number(e.key)-1];c.view.selectedTower=null;render();}if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();const delta=['ArrowLeft','ArrowUp'].includes(e.key)?-1:1;c.view.hoverSlot=(Math.max(0,c.view.hoverSlot)+delta+g.slots.length)%g.slots.length;canvas.focus();}if(e.key==='Enter'){e.preventDefault();pickSlot(Math.max(0,c.view.hoverSlot));}}
    if(current==='verify'){if(e.key.toLowerCase()==='f')answer(false);if(e.key.toLowerCase()==='j')answer(true);if(e.key==='Enter'&&g.feedback){e.preventDefault();g.next();events();render();}}
  });
  document.addEventListener('visibilitychange',()=>{lastFrame=0;if(document.hidden&&active().started&&!['won','lost'].includes(game().phase)){game().paused=true;overlayKey='';render();}});
  if(window.ResizeObserver)new ResizeObserver(alignSignalEnds).observe($('pipe-grid'));
  window.addEventListener('resize',alignSignalEnds);
  function frame(now){const dt=lastFrame?Math.min((now-lastFrame)/1000,.1):0;lastFrame=now;const c=active();if(c.started&&!document.hidden)c.engine.update(dt*c.speed);events();if(current==='defender')window.MediaDraw.draw(canvas,c.engine,c.view,now/1000);if(now-lastUI>100){render();lastUI=now;}requestAnimationFrame(frame);}
  $('map-list').innerHTML=Object.values(MAPS).map((map,i)=>'<button class="map-card" data-map="'+map.id+'" aria-pressed="false">'+minimap(map)+'<span class="map-card-heading"><b>'+String(i+1).padStart(2,'0')+' / '+map.name+'</b><span class="map-medals">···</span></span><small>'+map.subtitle+'</small></button>').join('');
  $('map-list').addEventListener('click',e=>{const button=e.target.closest('[data-map]');if(!button||button.disabled)return;newDefender({mapId:button.dataset.map,difficulty:controllers.defender.engine.difficulty});});
  $('difficulty-select').addEventListener('change',()=>newDefender({mapId:controllers.defender.engine.mapId,difficulty:$('difficulty-select').value}));
  $('new-shift-button').addEventListener('click',()=>newDefender({mapId:controllers.defender.engine.mapId,difficulty:controllers.defender.engine.difficulty}));
  $('daily-button').addEventListener('click',()=>newDefender(dailyChallenge()));
  $('bestiary-button').addEventListener('click',()=>openDialog(atlas(),'ATLAS NEVYŽÁDANÝCH NÁVŠTĚV',true));
  $('flock-button').addEventListener('click',()=>{if(current==='defender'){game().callFlock();events();render();}});
  $('defender-map-picker').open=!matchMedia('(max-width:540px)').matches;selectGame('defender');requestAnimationFrame(frame);
})();
