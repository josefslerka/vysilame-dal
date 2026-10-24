// Vytvoří jeden přenositelný HTML soubor bez závislostí a sestavovacích balíčků.
const fs=require('node:fs');
const path=require('node:path');
let html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const name of ['style.css','defender.css','verify.css','signal.css'])html=html.replace('<link rel="stylesheet" href="'+name+'">',()=>'<style>\n'+fs.readFileSync(path.join(__dirname,name),'utf8')+'\n</style>');
for(const name of ['defender.js','verify.js','signal.js','engine.js','draw.js','app.js']){
  const code=fs.readFileSync(path.join(__dirname,name),'utf8');
  if(/<\/script/i.test(code))throw new Error('Closing script tag in '+name);
  html=html.replace('  <script src="'+name+'" defer></script>\n',()=>'');
  html=html.replace('</body>',()=>'<script>\n'+code+'\n</script>\n</body>');
}
const icon=encodeURIComponent(fs.readFileSync(path.join(__dirname,'icon.svg'),'utf8'));
html=html.replace('href="icon.svg"','href="data:image/svg+xml,'+icon+'"');
const target=path.join(__dirname,'hry.html');
fs.writeFileSync(target,html);
console.log('Vytvořeno hry.html ('+Math.round(Buffer.byteLength(html)/1024)+' kB).');
