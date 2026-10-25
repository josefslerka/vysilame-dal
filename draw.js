(function(root){
  'use strict';
  const {TOWERS,ENEMIES}=root.MediaGames;
  const ink='#14202a',white='#fffce7',yellow='#f5ed43';
  const palettes={
    park:{ground:'#7b9c57',patch:'#8eaa62',shade:'#658748',road:'#cbd0af',edge:'#30443b',dash:'#f5f2d3',leaf:'#416a42'},
    city:{ground:'#969f9d',patch:'#a7afa7',shade:'#818e89',road:'#d6d7c9',edge:'#283f43',dash:'#faf9de',leaf:'#477550'},
    region:{ground:'#a3b763',patch:'#b6c77a',shade:'#879e51',road:'#d9ca9b',edge:'#455335',dash:'#fcf1c5',leaf:'#4d7844'},
    night:{ground:'#222a49',patch:'#2d3655',shade:'#1a233e',road:'#7885a3',edge:'#0d182f',dash:'#bdc7c3',leaf:'#384c56'}
  };
  function line(c,points,color,width=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineCap='butt';c.lineJoin='miter';c.stroke();}
  function box(c,x,y,w,h,fill,stroke=ink,width=2){if(fill){c.fillStyle=fill;c.fillRect(x,y,w,h);}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.strokeRect(x,y,w,h);}}
  function poly(c,points,fill,stroke=ink,width=2){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
  function circle(c,x,y,r,fill,stroke,width=2){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
  function text(c,value,x,y,size=14,color=ink,align='left'){c.font='bold '+size+'px "Courier New",monospace';c.fillStyle=color;c.textAlign=align;c.fillText(value,x,y);c.textAlign='left';}
  function tree(c,x,y,size,p){c.save();c.translate(x,y);c.scale(size,size);box(c,-18,9,42,15,p.shade,null);box(c,-3,2,8,25,'#655944');poly(c,[[-23,4],[-23,-10],[-15,-10],[-15,-23],[-5,-23],[-5,-31],[11,-31],[11,-23],[21,-23],[21,-10],[27,-10],[27,5],[12,5],[12,11],[-13,11],[-13,4]],p.leaf);box(c,-12,-21,9,6,'#88a66a',null);box(c,-20,-6,9,5,'#668f56',null);c.restore();}
  function bird(c,x,y,size=1,flap=0){c.save();c.translate(x,y);c.scale(size,size);poly(c,[[-13,5],[-7,-2],[-5,-10],[3,-10],[3,-16],[12,-16],[17,-9],[23,-7],[15,-3],[13,5],[5,11],[-2,10],[-13,14]],ink,null);box(c,8,-12,5,5,white,null);box(c,10,-11,2,3,ink,null);if(flap)poly(c,[[-5,-2],[-15,-15-flap*5],[4,-3],[12,7]],'#4b5d60',null);else box(c,-4,-1,9,6,'#455759',null);line(c,[[0,10],[0,15],[-4,15]],ink,2);line(c,[[7,10],[8,15],[12,15]],ink,2);c.restore();}
  function sign(c,x,y,first,second,w=144){box(c,x+5,y+6,w,43,'#3b4b3a55',null);box(c,x,y,w,41,white);box(c,x,y,w,6,yellow,null);text(c,first,x+w/2,y+21,11,ink,'center');text(c,second,x+w/2,y+34,11,ink,'center');}
  function house(c,x,y,w=52,color=white){box(c,x+4,y+9,w,42,'#24372b44',null);box(c,x,y,w,40,color);poly(c,[[x-5,y],[x+w/2,y-23],[x+w+5,y]],'#bd5d44');box(c,x+9,y+10,12,12,'#507d98');box(c,x+w-18,y+17,11,23,'#6b5b46');}
  function background(c,g,compact=false){
    const p=palettes[g.map.theme],night=g.map.theme==='night',city=g.map.theme==='city';
    box(c,0,0,960,576,p.ground,null);
    for(let i=0;i<170;i++){const x=(i*137+30)%952,y=(i*71+36)%568;box(c,x,y,4+(i%4)*2,2,p.patch,null);}
    if(city){
      for(const [x,y,w,h] of [[24,219,102,88],[43,380,82,92],[370,26,154,41],[605,22,100,42],[828,55,103,45],[840,221,82,45],[830,478,91,43],[336,371,58,46]]){
        box(c,x+6,y+7,w,h,'#41585866',null);box(c,x,y,w,h,'#c8cbb9');box(c,x,y,w,7,'#627e87',null);
        for(let wx=x+10;wx<x+w-8;wx+=19)for(let wy=y+16;wy<y+h-8;wy+=20)box(c,wx,wy,9,10,'#345f85');
      }
      line(c,[[22,543],[936,543]],'#455653',2);line(c,[[22,554],[936,554]],'#455653',2);
      box(c,727,524,114,27,'#d95b43');box(c,727,524,114,6,white,null);
      for(let x=737;x<814;x+=18)box(c,x,533,12,10,'#334f73');box(c,819,533,15,18,'#b8c7bd');
      circle(c,749,554,5,ink);circle(c,819,554,5,ink);if(!compact)text(c,'12',714,544,14,white,'right');
    }else if(g.map.theme==='region'){
      for(const [x,y,w,h] of [[232,230,78,77],[465,164,92,60],[511,438,79,60],[742,483,145,49]]){
        box(c,x,y,w,h,'#d3b873');for(let yy=y+7;yy<y+h;yy+=12)line(c,[[x+5,yy],[x+w-5,yy]],'#ac904e',2);
      }
      house(c,40,65,46);house(c,900,78,44,'#dbe2c8');house(c,337,512,43);
      if(!compact)text(c,'KOLÁČE →',550,520,14,'#485836');
    }else if(night){
      for(let i=0;i<42;i++){const x=(i*137+31)%950,y=(i*59+12)%570;box(c,x,y,i%3===0?4:2,i%3===0?4:2,i%3===0?'#e2e4ab':'#657fa0',null);}
      poly(c,[[871,27],[897,27],[897,35],[909,35],[909,65],[897,65],[897,73],[871,73],[871,65],[859,65],[859,35],[871,35]],'#ece9b1',null);
      box(c,885,27,26,30,p.ground,null);box(c,899,47,12,18,p.ground,null);
    }else{
      box(c,285,254,99,65,'#8da863',null);box(c,315,235,35,105,'#8da863',null);
      if(!compact)sign(c,285,261,'ZÁKAZ KRMENÍ','LOBBISTŮ',130);
      for(const [x,y]of [[568,505],[590,515],[552,526]])bird(c,x,y,.8);
      box(c,521,478,30,13,'#a99d68');line(c,[[524,491],[524,499],[547,499],[547,491]],ink,2);
    }
    g.map.paths.forEach(path=>line(c,path,p.edge,76));
    g.map.paths.forEach(path=>line(c,path,p.road,66));
    c.save();c.setLineDash([12,14]);g.map.paths.forEach(path=>line(c,path,p.dash,2));c.restore();
    g.map.trees.forEach(t=>tree(c,...t,p));
    if(g.map.coffee){const f=g.map.coffee;c.save();c.setLineDash([5,8]);circle(c,f.x,f.y,f.radius,'#f5ed430a','#c2bd6277',2);c.restore();box(c,f.x-21,f.y-25,42,49,'#b7b9aa');box(c,f.x-17,f.y-19,34,16,'#2d3d49');box(c,f.x-14,f.y-15,15,5,yellow,null);box(c,f.x+6,f.y-14,7,7,'#fa7555');box(c,f.x-14,f.y+3,28,17,ink);box(c,f.x-7,f.y+6,12,12,white);line(c,[[f.x+5,f.y+8],[f.x+10,f.y+8],[f.x+10,f.y+13],[f.x+5,f.y+13]],white,2);if(!compact)text(c,'KÁVOVAR',f.x,f.y+42,14,yellow,'center');}
    if(!compact){box(c,16,16,Math.max(185,g.map.short.length*8+21),27,ink);text(c,g.map.short,26,35,14,white);}
    g.map.paths.forEach((path,i)=>{const fromRight=path[0][0]>900,x=fromRight?901:24,y=path[0][1]-40;if(!compact)text(c,g.map.paths.length>1?'VSTUP '+(i+1):'VSTUP',x,y,12,night?white:ink,fromRight?'right':'left');poly(c,fromRight?[[914,y+11],[931,y+3],[931,y+19]]:[[26,y+3],[43,y+11],[26,y+19]],'#ee6447');});
    if(!compact){if(g.wave===0){box(c,19,543,438,22,ink);text(c,'VYBER OBRANU. KLIKNI NA +. SPUSŤ VLNU.',28,558,12,yellow);}
    else{box(c,380,17,210,27,ink);text(c,g.phase==='wave'?'VLNA '+g.wave+' / 8  •  ON AIR':g.phase==='briefing'?'REDAKČNÍ PORADA':'PŘESTÁVKA NA KÁVU',485,35,12,yellow,'center');}}
  }
  function station(c,g,time,compact=false){
    c.save();c.translate(850,294);
    box(c,-61,13,151,70,'#101b2a55',null);box(c,-66,7,144,68,'#d8decf');box(c,-66,7,144,12,'#364f8b',null);
    box(c,-66,62,144,13,'#abb9a8',null);box(c,-17,31,30,44,'#243e63');box(c,-12,36,9,31,'#72a3bd');
    for(const x of [-55,-35,27,47]){box(c,x,28,12,24,'#365e83');line(c,[[x,40],[x+12,40]],'#e4ebdb',2);}
    if(!compact){box(c,-49,-18,95,26,white);text(c,g.mapId==='vinohrady'?'ROZHLAS':'TELEVIZE',-2,-1,15,ink,'center');}
    box(c,-18,-31,32,13,'#8b9c9d');line(c,[[-1,-31],[-1,-82]],ink,4);line(c,[[-16,-66],[14,-66]],ink,4);line(c,[[-11,-77],[9,-77]],ink,4);
    box(c,-6,-88,10,8,g.health>35?'#f6533e':yellow);
    if(g.health>0&&Math.floor(time*2)%2===0){line(c,[[-18,-91],[-26,-97]],yellow,3);line(c,[[15,-91],[23,-97]],yellow,3);}
    if(!compact){box(c,29,-39,50,23,g.health>0?'#ed5340':ink);text(c,g.health>0?'ON AIR':'TICHO',54,-23,12,white,'center');}
    if(!compact){box(c,-66,82,144,23,ink);text(c,'VEŘEJNÁ SLUŽBA',6,98,13,white,'center');}bird(c,73,3,.75);
    c.restore();
  }
  function tower(c,t,selected,g){
    const stats=g.stats(t),color=TOWERS[t.type].color;
    c.save();c.translate(t.x,t.y);
    box(c,-24,21,52,9,'#15271977',null);box(c,-25,-22,50,48,color);line(c,[[-25,20],[25,20]],ink,4);
    if(selected){c.save();c.setLineDash([6,4]);box(c,-32,-31,64,64,null,white,2);c.restore();}
    if(t.type==='verify'){
      box(c,-9,-19,19,17,white);box(c,-9,-22,19,6,ink,null);box(c,-11,-13,10,7,ink);box(c,3,-13,10,7,ink);line(c,[[-1,-10],[3,-10]],ink,2);
      box(c,-14,1,29,14,'#3e5d73');box(c,-18,5,14,13,white);circle(c,12,7,8,null,ink,3);line(c,[[17,13],[22,19]],ink,4);
    }else if(t.type==='reporter'){
      box(c,-10,-20,19,18,'#f4dfbe');box(c,-11,-23,21,7,ink);box(c,5,-12,4,3,ink,null);line(c,[[-2,-3],[4,-3]],ink,2);
      box(c,-15,-1,29,20,'#416282');box(c,-3,1,6,13,white,null);box(c,-1,2,3,12,'#ed6a49',null);
      line(c,[[11,6],[22,0]],ink,5);box(c,18,-11,8,14,'#b9d9d9');box(c,20,-9,4,7,ink,null);
    }else{
      for(const [x,y]of [[-14,0],[13,1],[0,-9]]){box(c,x-5,y-12,11,11,white);box(c,x-8,y,17,15,x===0?'#df6546':'#426979');box(c,x-6,y-15,13,5,ink,null);}
      line(c,[[-20,7],[-26,1]],ink,3);line(c,[[21,8],[26,2]],ink,3);
    }
    for(let i=0;i<t.level;i++)box(c,-10+i*9,24,6,5,white,ink,1);
    if(stats.coffee){box(c,16,-29,14,11,yellow);line(c,[[29,-27],[33,-27],[33,-21],[29,-21]],yellow,2);}
    if(stats.jammed){box(c,-26,-39,52,17,'#d6c6ed');text(c,'A38!',0,-26,12,ink,'center');}
    c.restore();
  }
  function feet(c,age,r,color=ink){const step=Math.floor(age*5)%2?3:-3;box(c,-r+1,r-1,7,7+step,color,null);box(c,r-8,r-1,7,7-step,color,null);}
  function enemy(c,e,portrait=false,labelScale=1){
    const big=!!e.boss,r=big?28:['pressure','lobby','form'].includes(e.type)?17:e.type==='fragment'?9:e.type==='noise'?13:15;
    c.save();c.translate(Math.round(e.x/2)*2,Math.round(e.y/2)*2);
    box(c,-r+2,r+5,r*2,6,'#14242455',null);
    if(!portrait&&e.type==='lobby'&&e.stun<=0){c.save();c.setLineDash([4,9]);circle(c,0,0,90,null,'#a08b4b88',2);c.restore();}
    if(e.shield>0){poly(c,[[-r-8,-r-9],[r+8,-r-9],[r+9,r/2],[0,r+13],[-r-9,r/2]],'#afd4e330','#b4edee',3);}
    if(e.slow>0)box(c,-r-4,-r-4,r*2+8,r*2+8,null,'#a5e2ff',2);
    if(e.stun>0){text(c,'Z Z',0,-r-14,14,yellow,'center');}
    if(e.type==='cut'){
      feet(c,e.age,14);box(c,-14,-14,28,29,e.color);box(c,-14,-14,28,6,'#af452d',null);
      circle(c,-6,5,4,null,ink,2);circle(c,6,5,4,null,ink,2);line(c,[[-5,1],[6,-8]],ink,3);line(c,[[5,1],[-6,-8]],ink,3);
      box(c,-19,-7,5,14,ink,null);box(c,14,-2,5,10,ink,null);
    }else if(e.type==='noise'){
      poly(c,[[-17,-8],[-10,-8],[-10,-15],[0,-11],[7,-17],[11,-10],[19,-7],[13,0],[18,9],[9,11],[3,17],[-3,11],[-15,14],[-14,3],[-20,0]],e.color);
      text(c,'?',0,7,20,ink,'center');
    }else if(e.type==='clickbait'){
      feet(c,e.age,17);poly(c,[[-19,-14],[-9,-14],[-6,-22],[1,-15],[12,-20],[14,-10],[23,-6],[16,2],[21,12],[10,14],[7,22],[-2,16],[-12,21],[-14,10],[-22,5],[-16,-3]],'#f8cd3c');box(c,-17,-8,35,19,'#f25e42');text(c,'ŠOK',0,6,14,white,'center');
    }else if(e.type==='fragment'){feet(c,e.age,8);box(c,-5,-12,10,15,e.color);box(c,-5,7,10,5,e.color);}
    else if(e.type==='troll'){
      feet(c,e.age,15);poly(c,[[-15,-10],[-24,-19],[-9,-19],[-9,-24],[11,-24],[12,-19],[24,-19],[16,-8],[17,13],[-15,13]],e.color);
      line(c,[[-11,-9],[-3,-5]],ink,3);line(c,[[11,-9],[3,-5]],ink,3);box(c,-9,0,5,4,white,null);box(c,5,0,5,4,white,null);line(c,[[-6,8],[7,8]],ink,2);
      box(c,-18,13,37,14,'#7d9197');text(c,'@',0,24,14,ink,'center');if(e.suppressed<=0&&e.hp<e.maxHp)text(c,'+',23,-16,17,'#e6ff88');
    }else if(e.type==='form'){
      feet(c,e.age,15);box(c,-10,-23,30,35,'#8a90a4');box(c,-14,-19,30,35,'#ddd9ee');box(c,-18,-15,30,35,white);box(c,-12,-19,17,6,'#61566e');line(c,[[-13,-8],[6,-8]],'#75817d',2);line(c,[[-13,-3],[6,-3]],'#75817d',2);text(c,'A38',-3,11,12,'#7d4261','center');
    }else if(e.type==='spin'){
      feet(c,e.age,14);box(c,-15,-16,30,30,e.color);c.save();c.rotate(Math.floor(e.age*3)%4*Math.PI/2);line(c,[[-8,6],[-8,-7],[7,-7],[7,4]],white,4);poly(c,[[2,2],[13,2],[7,9]],white,null);c.restore();
    }else if(e.type==='lobby'){
      feet(c,e.age,18,'#b57c55');box(c,-12,-24,24,18,'#e6c39d');box(c,-12,-26,24,5,'#8d826d');box(c,-10,-18,9,5,ink);box(c,3,-18,9,5,ink);box(c,-17,-4,34,25,'#927d59');box(c,-2,-2,5,18,'#df563f');box(c,-24,8,18,15,'#6f513c');text(c,'€',-15,20,11,white,'center');
    }else if(e.type==='conference'){
      box(c,-12,-44,25,21,'#dfb79d');box(c,-12,-45,25,6,ink);line(c,[[-6,-29],[7,-29]],ink,3);box(c,-20,-22,40,19,'#53667b');box(c,-30,-6,60,37,'#304f7f');box(c,-25,0,50,22,white);text(c,'BEZ',0,10,11,ink,'center');text(c,'DOTAZŮ',0,21,10,ink,'center');line(c,[[-20,-5],[-23,-20],[23,-20],[20,-5]],ink,3);box(c,-27,-24,9,9,ink);box(c,19,-24,9,9,ink);feet(c,e.age,29);
    }else if(e.type==='boss'){
      feet(c,e.age,28);box(c,-22,-24,52,42,'#6a7990');box(c,-30,-16,54,42,e.color);box(c,-20,-8,49,39,'#8e9aa9');box(c,-15,1,35,21,white);text(c,'PŘÍLOHA',2,15,10,ink,'center');poly(c,[[-20,-28],[-20,-46],[-10,-37],[0,-51],[10,-37],[22,-46],[22,-28]],yellow);
    }else{
      feet(c,e.age,17);box(c,-8,-24,17,9,'#9cb0b5');box(c,-18,-17,37,34,e.color);line(c,[[-18,-5],[19,-5]],ink,3);box(c,-3,-8,7,8,'#f7da63');
    }
    if(big&&!portrait){const w=Math.max(140,(e.short.length*8+16)*labelScale);box(c,-w/2,-54-22*labelScale,w,22*labelScale,ink);text(c,e.short.toUpperCase(),0,-54-6*labelScale,12*labelScale,white,'center');}
    if(!portrait&&(e.hp<e.maxHp||big)){const w=big?56:30,y=big?-53:-r-12;box(c,-w/2-1,y-1,w+2,7,ink,null);box(c,-w/2,y,w*Math.max(0,e.hp/e.maxHp),5,big?'#f26547':'#ecf366',null);}
    c.restore();
  }
  function draw(canvas,g,view,time){
    // Keep the 960 × 576 game coordinates, but rasterize text at display resolution.
    // Enlarging a low-resolution intermediate canvas also enlarged antialiased glyphs.
    const bounds=canvas.getBoundingClientRect(),ratio=root.devicePixelRatio||1;
    if(!bounds.width||!bounds.height)return;
    const width=Math.max(1,Math.round(bounds.width*ratio)),height=Math.max(1,Math.round(bounds.height*ratio));
    if(canvas.width!==width)canvas.width=width;
    if(canvas.height!==height)canvas.height=height;
    const c=canvas.getContext('2d');c.setTransform(width/960,0,0,height/576,0,0);c.imageSmoothingEnabled=false;background(c,g,view.mobile);
    const active=g.towers.find(t=>t.id===view.selectedTower),hover=Number.isInteger(view.hoverSlot)?view.hoverSlot:-1;
    if(active){const s=g.stats(active);c.save();c.setLineDash([7,6]);circle(c,active.x,active.y,s.range,'#f5ed4315',yellow,2);c.restore();}
    else if(hover>=0&&!g.occupied(hover)){const[x,y]=g.slots[hover],s=g.stats({type:view.selectedType,level:1,x,y});c.save();c.setLineDash([7,6]);circle(c,x,y,s.range,'#f5ed4315',yellow,2);c.restore();}
    if(!view.mobile||view.overview)g.slots.forEach(([x,y],i)=>{if(g.occupied(i))return;const on=i===hover;box(c,x-23,y-23,46,46,'#182c252c',on?yellow:'#d1dbc3',2);box(c,x-19,y-19,38,38,on?yellow:'#e6e7c4',ink,2);line(c,[[x-8,y],[x+8,y]],ink,4);line(c,[[x,y-8],[x,y+8]],ink,4);if(on){box(c,x-13,y+29,26,19,ink);text(c,String(i+1).padStart(2,'0'),x,y+43,12,yellow,'center');}});
    if(!view.mobile||view.overview)g.towers.forEach(t=>tower(c,t,t.id===view.selectedTower,g));g.enemies.forEach(e=>enemy(c,e,false,view.mobile?Math.max(1,960/bounds.width):1));station(c,g,time,view.mobile);
    for(const s of g.shots){const angle=Math.atan2(s.target.y-s.y,s.target.x-s.x);line(c,[[s.x-Math.cos(angle)*12,s.y-Math.sin(angle)*12],[s.x,s.y]],ink,4);box(c,s.x-3,s.y-3,7,7,TOWERS[s.towerType].color,ink,1);}
    for(const e of g.effects){const f=e.age/e.life;c.save();c.globalAlpha=1-f;if(e.type==='flock'){for(let i=0;i<14;i++)bird(c,-110+f*1250-i*42,70+(i%4)*105+Math.sin(f*20+i)*15,1.7,Math.floor(f*15)%2);c.restore();continue;}
      if(e.type==='hit'){line(c,[[e.x-12,e.y-12],[e.x-4,e.y-4]],yellow,4);line(c,[[e.x+5,e.y+5],[e.x+13,e.y+13]],white,4);}else{text(c,e.text,e.x,e.y-25-f*25,18,e.type==='leak'?'#ff5a3d':white,'center');}c.restore();}
    const hovered=g.enemies.find(e=>e.id===view.hoverEnemy);if(hovered){const x=Math.max(120,Math.min(840,hovered.x)),y=Math.max(80,hovered.y-64);box(c,x-119,y-29,238,48,ink);text(c,hovered.name,x,y-9,14,white,'center');text(c,hovered.quip.length>33?hovered.quip.slice(0,32)+'…':hovered.quip,x,y+9,10,yellow,'center');}
  }
  const portraits=new Map();
  function portrait(type){
    if(portraits.has(type))return portraits.get(type);
    const d=ENEMIES[type];if(!d)return '';
    const sample=document.createElement('canvas');sample.width=48;sample.height=48;const ctx=sample.getContext('2d');ctx.scale(.5,.5);ctx.translate(48,d.boss?56:49);if(!d.boss)ctx.scale(1.65,1.65);
    enemy(ctx,{...d,type,x:0,y:0,age:0,hp:d.hp,maxHp:d.hp,shield:0,slow:0,stun:0,suppressed:0},true);
    const url=sample.toDataURL('image/png');portraits.set(type,url);return url;
  }
  root.MediaDraw={draw,portrait};
})(window);
