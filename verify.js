(function(root){
  'use strict';
  const VERIFY_CATEGORIES={
    origin:{name:'Původ zprávy',glyph:'↳'},time:{name:'Čas a místo',glyph:'◷'},numbers:{name:'Čísla a měřítka',glyph:'%'},polls:{name:'Ankety a výběry',glyph:'▥'},context:{name:'Citace a kontext',glyph:'„“'},images:{name:'Obraz a zvuk',glyph:'▣'},research:{name:'Výzkum a závěry',glyph:'⌕'},ethics:{name:'Redakční odpovědnost',glyph:'§'}
  };
  const VERIFY_DESKS={
    morning:{id:'morning',name:'Ranní směna',label:'VŠECHNO SE HODÍ',glyph:'☀',count:10,seconds:120,checks:3,categories:Object.keys(VERIFY_CATEGORIES),description:'Od výluky po vědecký objev. Deset zpráv, jeden hrnek a telefon, který neumí mlčet.',quip:'Káva je ověřená. Zbytek je na tobě.'},
    data:{id:'data',name:'Čísla a čáry',label:'DATOVÁ REDAKCE',glyph:'%',count:8,seconds:110,checks:2,categories:['numbers','polls','research'],description:'Procenta, ankety a výzkumy. Kalkulačka nedává rozhovory, ale má co říct.',quip:'Graf stoupá. Možná jen někdo otočil monitor.'},
    picture:{id:'picture',name:'Obrazová redakce',label:'VIDĚT ≠ VĚDĚT',glyph:'▣',count:8,seconds:110,checks:2,categories:['images','time','context'],description:'Staré fotky, nové popisky, ustřižené věty. Osm zásilek z oddělení „vždyť je to vidět“.',quip:'Šest prstů? Třeba jen dvě ruce v koalici.'},
    night:{id:'night',name:'Noční uzávěrka',label:'POSLEDNÍ VYDÁNÍ',glyph:'☾',count:12,seconds:120,checks:2,categories:Object.keys(VERIFY_CATEGORIES),description:'Dvanáct zpráv napříč redakcí. Na konci uzávěrkový chyták. Automat na bagety už nespolupracuje.',quip:'Je 23:58. Šéfredaktor napsal „jen drobnost“.'}
  };
  // Each dossier has two independently playable versions: supported / unsupported.
  // The headline alone never determines the answer. All cases are fictional.
  function dossier(id,category,headline,source,why,detail,quip,level=1){return {id,category,headline,source,why,detail,quip,level};}
  const VERIFY_FILES=[
    dossier('tramvaj','origin','Od pondělí pojede tramvaj číslo 7 přes náměstí.',
      ['Dopravní podnik zveřejnil aktuální výlukový jízdní řád. Sedí linka, zastávky i datum začátku.','Přeposlaný obrázek jízdního řádu nemá datum ani autora. V platném oznámení podniku změna není.'],
      ['Aktuální primární zdroj potvrzuje přesně tu změnu, kterou titulek popisuje.','Nejdřív ověř platnost a původ jízdního řádu. Přeposlání nenahradí dopravní podnik.'],
      ['Dispečer potvrdil, že oznámení platí pro linku 7 od příštího pondělí.','Soubor se jmenuje final_FINAL_2019.png. Dispečer o aktuální výluce neví.'],
      'Tramvaj může mít zpoždění. Ověření nemusí.'),
    dossier('skoly','origin','Město zítra zavře všechny své základní školy.',
      ['Městský krizový štáb vydal dnešní rozhodnutí kvůli poruše vody. Seznam zahrnuje všechny městské základní školy.','Screenshot z rodičovského chatu tvrdí „všechny školy“. Autora neznáme, škola ani město uzavření nepotvrdily.'],
      ['Máme aktuální rozhodnutí a správně omezený rozsah: městské základní školy.','Rodičovský chat je tip, nikoli rozhodnutí o provozu všech škol.'],
      ['Ředitelé uvedených škol informaci nezávisle potvrdili.','Původní pisatel napsal jen „u nás zítra neteče voda“.'],
      'Třídní chat zvládne vyhlásit prázdniny rychleji než ministerstvo.'),
    dossier('rozpocet','origin','Zastupitelstvo schválilo dva miliony na knihovnu.',
      ['Zveřejněné usnesení z včerejška uvádí schválené dva miliony. Ověřili jsme i výsledek hlasování.','Dva miliony jsou v návrhu rozpočtu. O něm se teprve bude hlasovat příští týden.'],
      ['Schválení dokládá platné usnesení. Titulek popisuje rozhodnutí, nikoli jeho budoucí splnění.','Návrh a schválené rozhodnutí jsou dvě různé zprávy. Titulek předbíhá hlasování.'],
      ['Bod 12 usnesení prošel 17 hlasy. Částka souhlasí.','V hlavičce dokumentu je „pracovní návrh k projednání“.'],
      'Knihovna má ráda fikci. Rozpočtové zpravodajství o něco méně.'),
    dossier('triweby','origin','Plovárna se v sobotu otevře po rekonstrukci.',
      ['Provozovatel oznámil termín. Stavební úřad potvrdil povolení provozu a správce uvedl sobotní otevírací dobu.','Tři weby mají stejný text z jednoho anonymního příspěvku. Provozovatel zatím termín otevření nepotvrdil.'],
      ['Máme relevantní zdroje pro termín i možnost provozu.','Tři kopie jednoho tvrzení nejsou tři nezávislá potvrzení.'],
      ['Správce i úřad odpověděli vlastními slovy a popsali svou část věci.','Všechny tři články mají stejný překlep „bazén s vyhřívanou vodkou“.'],
      'Ctrl+C není terénní reportér.'),
    dossier('agentura','origin','Svoz odpadu se ve čtvrtek přesune na pátek.',
      ['Zpráva agentury odkazuje na aktuální harmonogram technických služeb. Otevřeli jsme ho a ověřili naši čtvrť.','Automatické shrnutí bez odkazů tvrdí, že svoz bude v pátek. Neuvádí město, datum ani původ informace.'],
      ['Převzatá informace může být použitelná, když ověříme její původ a platnost.','Plynulá věta z generátoru nedokládá harmonogram svozu. Potřebujeme konkrétní podklad.'],
      ['V originálu je naše čtvrť a stejný termín.','Generátor na dotaz nabídl tři různé termíny a přál hezký víkend.'],
      'Halucinující popelnice pořád není veřejná služba.'),

    dossier('povoden','time','Fotografie ukazuje dnešní zaplavené nádraží.',
      ['Fotograf dodal původní snímky z dnešního rána. Místo odpovídá nádraží a zaplavení potvrdil místní reportér.','Stejný snímek dohledáváme v článku starém šest let. Aktuální stav nádraží jsme nezjistili.'],
      ['Čas i místo fotografie potvrzují další podklady.','Autentická stará fotografie nedokazuje dnešní událost. Popisek potřebuje opravu.'],
      ['Reportér poznal i nově postavený podchod a poslal vlastní záběr.','V původním článku je navíc jiné město.'],
      'Archiv není časostroj. Jen v něm člověk stráví celé odpoledne.'),
    dossier('festival','time','Letošní festival navštívilo 12 tisíc lidí.',
      ['Pořadatel dodal závěrečnou bilanci právě skončeného ročníku. Číslo odpovídá evidovaným vstupům a nezahrnuje opakované průchody.','V tiskové zprávě stojí „příští rok očekáváme 12 tisíc návštěvníků“. Letošní bilance chybí.'],
      ['Číslo se týká dokončeného letošního ročníku a víme, co počítá.','Očekávání pro příští rok není letošní výsledek.'],
      ['Datovaný závěrečný přehled uvádí unikátní návštěvníky.','Pořadatel potvrdil, že jde o cíl do příštího roku.'],
      'Výhledy návštěvnosti se zatím u vstupu nekontrolují.'),
    dossier('most','time','Most bude o tomto víkendu zavřený.',
      ['Správce silnice zveřejnil aktuální uzavírku od soboty do neděle. Město potvrdilo stejný most i termín.','Sdílená zpráva neobsahuje rok. Původní oznámení se týká uzavírky, která skončila loni.'],
      ['Ověřili jsme konkrétní místo i platné časové rozmezí.','Stará uzavírka potřebuje nové ověření. Datum sdílení není datum události.'],
      ['V aktuální evidenci uzavírek je tento most i tento víkend.','Pod článkem je sice dnešní komentář, ale oznámení je rok staré.'],
      'Most přes minulost nemá schválenou objízdnou trasu.'),
    dossier('primenos','time','Záběr ukazuje právě probíhající jednání rady.',
      ['Živý přenos na webu města má dnešní program. Obraz odpovídá současnému bodu, který potvrzuje přítomný reportér.','Video má červený nápis LIVE, ale v originálu jde o záznam jednání z minulého měsíce.'],
      ['Aktuálnost záběru ověřuje program i člověk na místě.','Nápis LIVE lze vložit do libovolného videa. Tady neodpovídá skutečnému času.'],
      ['Reportér právě slyšel stejnou otázku jako diváci přenosu.','Původní video má v názvu datum minulého měsíce.'],
      'Červená tečka umí svítit i při repríze.'),
    dossier('casovazona','time','Start soutěže je v sobotu v 18 hodin našeho času.',
      ['Pořadatel uvádí sobotu 16:00 UTC. Pro datum konání jsme ověřili český letní čas UTC+2.','Pořadatel uvádí 18:00 UTC. Redakce přepsala čas jako 18:00 v Česku, kde v daný den platí UTC+2.'],
      ['Převod odpovídá konkrétnímu datu i časovému pásmu.','UTC a místní čas nejsou totéž. V popsaném případě by český čas byl 20:00.'],
      ['Kontrola kalendáře potvrzuje, že se ten den čas nemění.','V originálu je za časem výslovně UTC, nikoli místní čas.'],
      'Časová pásma: jediná věc, která přidá dvě hodiny i bez porady.',2),

    dossier('parkovne','numbers','Parkovné v centru zdražilo o polovinu.',
      ['Platné ceníky centrální zóny ukazují zvýšení z 20 na 30 korun za hodinu. Srovnáváme stejný typ stání.','Platné ceníky centrální zóny ukazují zvýšení z 30 na 40 korun za hodinu. Srovnáváme stejný typ stání.'],
      ['Rozdíl 10 korun vůči původním 20 činí 50 %. Tady titulek sedí.','Rozdíl 10 korun vůči původním 30 je přibližně třetina, nikoli polovina. Titulek potřebuje opravu.'],
      ['Výpočet je (30 − 20) / 20 = 0,5.','Výpočet je (40 − 30) / 30, tedy přibližně 33,3 %.'],
      'Parkování zdražilo. Jmenovatel se nezměnil.',2),
    dossier('procentnibody','numbers','Podíl cyklistů vzrostl o pět procentních bodů.',
      ['Stejná metodika měření ukazuje růst z 10 % na 15 %. Titulek výslovně mluví o procentních bodech.','Podíl vzrostl z 10 % na 10,5 %. Autor zaměnil pětiprocentní relativní růst za pět procentních bodů.'],
      ['Rozdíl mezi 10 a 15 procenty je pět procentních bodů.','Z 10 % na 10,5 % je půl procentního bodu. Procenta a procentní body se nedají zaměňovat.'],
      ['Relativní růst by byl 50 %, to ale titulek netvrdí.','Pět procent z původních deseti procent je 0,5 procentního bodu.'],
      'Procentní bod není puntík za procentem.',2),
    dossier('prumer','numbers','Medián odměny v podniku činí 35 tisíc korun.',
      ['Ověřená tabulka odměn má prostřední hodnotu 35 tisíc. Titulek správně používá medián, nikoli průměr.','Podnik uvedl pouze aritmetický průměr 35 tisíc. Rozložení odměn ani prostřední hodnotu neznáme.'],
      ['Medián označuje prostřední hodnotu uspořádaných dat. Máme ho skutečně spočítaný.','Z průměru medián nevyčteme. Titulek přisuzuje datům údaj, který nemáme.'],
      ['Polovina uvedených odměn je nejvýše na této hodnotě a polovina nejméně na ní.','Jedna vysoká odměna může průměr výrazně zvednout, aniž víme, kde leží medián.'],
      'Průměrný redaktor má jednu ruku v kávě a druhou v tabulce.',2),
    dossier('obyvatele','numbers','Obec A má více knihoven na obyvatele než obec B.',
      ['A má dvě knihovny na 2 000 obyvatel, B tři na 9 000. Definice knihovny i rok údajů jsou stejné.','A má dvě knihovny, B tři. Počet obyvatel redakce nedohledala.'],
      ['A má jednu knihovnu na tisíc obyvatel, B jednu na tři tisíce. Srovnání sedí.','Absolutní počty nestačí k závěru na obyvatele. Chybí jmenovatel.'],
      ['Přepočet na tisíc obyvatel vychází 1 proti přibližně 0,33.','Bez velikosti obou obcí nelze tento poměr spočítat.'],
      'Obyvatelstvo se do grafu samo nedopočítá.'),
    dossier('kumulace','numbers','V květnu přibylo 40 žádostí o komunitní zahrádku.',
      ['Kumulativní přehled měl na konci dubna 100 žádostí a na konci května 140. Jde o stejnou evidenci.','Kumulativní přehled uvádí na konci května celkem 40 žádostí od ledna. Dubnový stav neznáme.'],
      ['Rozdíl dvou srovnatelných kumulativních stavů dokládá květnový přírůstek.','Celkový stav od ledna není přírůstek za květen. Chybí předchozí stav.'],
      ['Evidence nepřesouvala ani nemaže starší žádosti, hodnoty jsou srovnatelné.','Číslo 40 zahrnuje i žádosti z ledna, února, března a dubna.'],
      'Kumulativní graf je jako dřez: ukazuje i včerejší hrnky.',2),

    dossier('anketa','polls','Většina obyvatel města podporuje novou kašnu.',
      ['Reprezentativní výzkum dospělých obyvatel s popsaným výběrem a otázkou uvádí 72 % podpory. Známe termín i nejistotu ±3 body.','Pro kašnu hlasovalo 72 % z 28 členů facebookové skupiny Milujeme nové kašny.'],
      ['Výzkum je vymezený na obyvatele města a výsledek je s rezervou nad polovinou.','Dobrovolná anketa mezi příznivci kašny nevypovídá o většině města.'],
      ['Zveřejněná metodika potvrzuje výběr napříč městem, nikoli jen příznivce projektu.','Skupinu založil prodejce zahradních fontán. Počet členů města v ní neznáme.'],
      'Ve skupině Kašna navždy vyhrála překvapivě kašna.'),
    dossier('tesnypruzkum','polls','Ve vzorku průzkumu získal návrh A o dva body víc než B.',
      ['Tabulka uvádí A 31 %, B 29 %, nejistota je přibližně ±3 body. Text výslovně upozorňuje, že těsný rozdíl může být náhodný.','Tisková zpráva říká „A jasně vítězí“. Tabulku ani údaje o vzorku nemáme a nejistotu jsme nezjišťovali.'],
      ['Přesně popsaný výsledek vzorku s upozorněním na nejistotu můžeme uvést. Není to jistý výsledek celé populace.','Bez tabulky a metodiky nemáme podklad ani pro přesný rozdíl. Reklamní shrnutí ho nenahrazuje.'],
      ['V titulku není tvrzení o jistém vítězi, pouze popis naměřeného vzorku.','Na dotaz po číslech agentura zatím neodpověděla.'],
      'Statistická nejistota neodejde, když ji napíšeme menším písmem.',2),
    dossier('otazka','polls','V anketě webu volilo 60 % hlasujících opravu parku.',
      ['Anketa nabídla opravu parku, parkoviště a možnost ani jedno. Uvádíme počet hlasů a to, že nejde o reprezentativní výzkum.','Otázka zněla „Jste pro opravu zanedbaného parku, nebo pro další odporné parkoviště?“ Text toto znění zatajuje.'],
      ['Omezený výsledek ankety lze popsat s jasnými hranicemi a zněním otázky.','Sugestivní otázka ovlivňuje odpovědi. Bez jejího znění je prezentace ankety zavádějící.'],
      ['Článek obsahuje přesné znění otázky i všechny možnosti.','Obě možnosti obsahují hodnotící slova a článek je vydává za neutrální volbu.'],
      'Otázka už hlasovala. Respondenti přišli jen podržet urnu.'),
    dossier('navratnost','polls','Devět z deseti oslovených knihoven má otevřeno v sobotu.',
      ['Oslovili jsme deset konkrétních knihoven a všech deset odpovědělo. Devět uvedlo sobotní provoz; článek je všechny jmenuje.','Oslovili jsme sto knihoven, odpovědělo deset a devět z nich otevírá v sobotu. Titulek mluví o všech oslovených.'],
      ['Titulek se přesně omezuje na deset oslovených a úplný soubor odpovědí.','Devět z deseti odpovídajících není devět z deseti oslovených. Devadesát odpovědí chybí.'],
      ['V tabulce je deset oslovených i deset doložených odpovědí.','V evidenci je 100 oslovení a jen 10 odpovědí.'],
      'Mlčení není souhlas. Ani vyplněný dotazník.',2),
    dossier('trend','polls','Podpora návrhu v průzkumu od března vzrostla.',
      ['Stejná agentura stejnou otázkou a metodikou naměřila v březnu 30 % a v červnu 45 %. Nejistota je v obou případech ±3 body.','V březnu jsme měřili podporu celého návrhu, v červnu jen jedné oblíbené části. Vzorky a otázky nejsou srovnatelné.'],
      ['Srovnatelné měření a dostatečně velká změna podporují tvrzení o růstu.','Změna otázky může změnit výsledek. Bez srovnatelných měření nemáme časový trend.'],
      ['Metodické listy potvrzují stejné cílové skupiny i doslovné znění otázky.','Březnová otázka řešila zdražení, červnová výsadbu stromů.'],
      'Jablka s hruškami jsou kompot. Ne časová řada.',2),

    dossier('citace','context','Radní: „Opravu stihneme do konce roku.“',
      ['Celý záznam potvrzuje přesnou větu bez podmínky. Článek ji připisuje radní a nepředstírá, že jde o hotovou opravu.','Celá věta zní „Kdybychom získali povolení, mohli bychom říct: opravu stihneme do konce roku.“ Povolení zatím není.'],
      ['Přesný a správně připsaný výrok lze publikovat jako slib.','Ustřižená podmínka mění smysl výroku. Citace potřebuje doplnit.'],
      ['Předchozí ani následující věta slib nepodmiňují.','Krátký klip vynechal prvních sedm sekund s podmínkou.'],
      'Nůžky jsou kancelářská pomůcka, ne spoluautor citace.'),
    dossier('satira','context','Město zřídilo úřad pro kontrolu délky tkaniček.',
      ['Město zveřejnilo platné usnesení o malém úřadu pro kontrolu délky tkaniček na městském kluzišti. Titulek doplňuje přesný účel v podtitulku.','Jediným zdrojem je rubrika Satirické pondělí. Stránka výslovně označuje text za vymyšlený vtip.'],
      ['Podivnost sama není důvod k odmítnutí. Tady máme dokument i vysvětlený kontext.','Satiru nemůžeme předat jako skutečnou zprávu. Nejdřív opravit rámování.'],
      ['Tiskové oddělení potvrdilo usnesení i kontrolu na kluzišti.','Pod článkem je „všechny citované tkaničky jsou smyšlené“.'],
      'Realita občas ukradne satiře pracovní místo.',2),
    dossier('slib','context','Město dokončilo nový cyklostojan u úřadu.',
      ['Reportér stojan viděl na místě, pořídil aktuální snímek a správce potvrdil převzetí hotové instalace.','Radní v rozhovoru slíbila „do měsíce tu stojan bude“. Na místě zatím nic není.'],
      ['Dokončenou instalaci potvrzuje pozorování i převzetí.','Slib budoucí instalace není hotový stojan. Titulek musí odpovídat stavu.'],
      ['Na reportérově snímku je stojan i dnešní vydání místních novin.','Objednávka byla teprve odeslána dodavateli.'],
      'Slib zamčené kolo neudrží.'),
    dossier('porovnani','context','Citovaný odborník doporučuje pro srovnání delší období.',
      ['Máme celý rozhovor. Odborník mluví o této datové řadě a výslovně doporučuje více let. Citace i odbornost sedí.','Klip spojil dvě různé odpovědi. Odborník větu o delším období řekl o jiné otázce a jiných datech.'],
      ['Máme přesný výrok relevantního odborníka ve správném kontextu.','Slepením odpovědí vznikl nový význam. Potřebujeme původní kontext.'],
      ['Nezkrácená odpověď zůstává u stejného grafu.','Mezi oběma větami je v originálu šest minut a změna tématu.'],
      'Střižna zvládne vytvořit experta na cokoliv. Redakce by neměla.'),
    dossier('parodie','context','Ředitel divadla oznámil, že vstupenky zlevní.',
      ['Jde o ověřený profil skutečného ředitele, celé oznámení je i na webu divadla a obsahuje nový ceník.','Příspěvek pochází z účtu ŘeditelSkoroPravý. V popisu je „parodický účet“, divadlo změnu nepotvrdilo.'],
      ['Identitu mluvčího i konkrétní změnu máme potvrzené.','Podobné jméno účtu není ověření identity. Tady jde výslovně o parodii.'],
      ['Odkaz na profil vede přímo z oficiálního webu divadla.','Profil má stejnou fotografii, ale odlišné uživatelské jméno a popis parodie.'],
      'Modrá fajfka neumí hrát Hamleta. Ani ověřit kontext.'),

    dossier('orez','images','Na náměstí se sešly stovky lidí.',
      ['Současné široké snímky i reportér na místě potvrzují zaplněné náměstí. Odhad řádově stovek odpovídá ploše i hustotě.','Těsný výřez ukazuje dvacet lidí. Celkový záběr chybí a nikdo počet na místě neověřil.'],
      ['Obraz má kontext a odhad podporuje i pozorování na místě.','Těsný výřez nedokládá počet mimo záběr. Odhad stovek zatím nemáme z čeho udělat.'],
      ['Široký záběr pokrývá celé místo a reportér popsal způsob odhadu.','Za hranou snímku může být dav i stánek s langoši. Zatím to nevíme.'],
      'Zoom je optika. Sčítání lidu je jiná živnost.'),
    dossier('generovano','images','Fotografie ukazuje novou kašnu před radnicí.',
      ['Autorka dodala původní sérii z místa. Reportér kašnu navštívil a její podobu ověřil.','Obrázek pochází z generátoru, autor ho označil jako návrh. Na místě se zatím nic nestaví.'],
      ['Místo i skutečnou podobu kašny ověřují další podklady.','Vizualizace návrhu není fotografie hotové stavby. Obrázek lze použít jen se správným označením.'],
      ['Na dalších snímcích je instalace z více úhlů.','Původní popisek zní „můj AI sen pro město“.'],
      'Voda na obrázku redakční kávovar nedoplní.'),
    dossier('detektor','images','Video z depozitu zachycuje skutečný historický vlak.',
      ['Máme původní soubor od kameramana. Muzeum potvrdilo konkrétní vůz, místo i datum natáčení.','Jediným podkladem je automatický detektor s výsledkem „92 % autentické“. Původ souboru ani místo neznáme.'],
      ['Původ a obsah ověřují lidé i konkrétní identifikace místa a vozidla.','Skóre detektoru samo autenticitu nedokazuje. Potřebujeme původ a další ověření.'],
      ['Inventární číslo vozu odpovídá záběru a záznamu muzea.','Detektor nepřipojil původní soubor, metadata ani vysvětlení výsledku.'],
      'Devadesát dva procent přesvědčivě zní i od kávovaru.',2),
    dossier('dabing','images','Nahrávka zachycuje starostovo vyjádření k plovárně.',
      ['Celou tiskovou konferenci zaznamenali dva přítomní reportéři. Výrok souhlasí s oběma nahrávkami i zveřejněným přenosem.','Krátký hlasový soubor přišel anonymně. Neznáme originál a máme jen dojem, že hlas zní podobně.'],
      ['Výrok potvrzuje plný kontext a více nezávislých záznamů stejné události.','Podobnost hlasu není ověření nahrávky. Potřebujeme původ, kontext a potvrzení.'],
      ['Oba reportéři výrok slyšeli na místě a mají navazující otázky.','Odesílatel odmítl uvést, kde a kdy měl záznam vzniknout.'],
      'Hlas může být známý. Původ souboru zatím cizí.'),
    dossier('geolokace','images','Záběry ukazují sníh na naší hlavní třídě.',
      ['Reportér porovnal domy a značení, získal původní dnešní záběr a na místě stav potvrdil.','Záběry mají stejný název ulice, ale jiný jazyk na obchodech. Původní autor je pořídil v jiném městě.'],
      ['Ověřili jsme konkrétní místo, datum i současný stav.','Stejný název ulice nezaručuje stejné město. Titulek má nesprávnou lokaci.'],
      ['Rohový dům i tramvajová zastávka přesně odpovídají místu.','Původní příspěvek označuje město vzdálené osm set kilometrů.'],
      'Hlavní třída je překvapivě populární adresa.'),

    dossier('robot','research','V testu robot roztřídil sponky rychleji než člověk.',
      ['Zpráva popisuje konkrétní laboratorní test: stejný počet sponek, stejný úkol, zveřejněné časy. Nezobecňuje na jiné činnosti.','Test porovnal robota se spícím figurantem. Titulek zamlčuje, že člověk úkol vůbec neprováděl.'],
      ['Úzce vymezené tvrzení odpovídá srovnatelnému experimentu.','Nesrovnatelné podmínky nedokládají běžný rozdíl rychlosti člověka a robota.'],
      ['Oběma běžely hodiny od stejného okamžiku a měli stejný úkol.','V protokolu je u figuranta napsáno „po noční, nereaguje“.'],
      'Robot nemá odbory. Zatím má jen zásobník na sponky.'),
    dossier('souvislost','research','V datech spolu souvisejí prodej zmrzliny a návštěvy koupaliště.',
      ['Datový soubor ukazuje společný růst. Text upozorňuje na teplé počasí a výslovně netvrdí, že jedno způsobuje druhé.','Autor bez kontroly dalších vlivů tvrdí v podkladech, že prodej zmrzliny způsobuje návštěvy koupaliště. V článku to chce uvést jako dokázaný závěr.'],
      ['Pozorovanou souvislost můžeme popsat, pokud jasně vymezíme, co neprokazuje.','Zpráva chystá nepodložený kauzální závěr. Podklady a text potřebují opravu před vydáním.'],
      ['Závěr se omezuje na korelaci v popsaném souboru.','Teplota nebyla do analýzy zahrnuta a žádný kauzální test neproběhl.'],
      'Nanuk není tajný ředitel plovárny.',2),
    dossier('preprint','research','Předběžný výzkum popisuje nový způsob třídění knoflíků.',
      ['Máme plný preprint, jasně uvádíme, že neprošel odborným posouzením. Nezávislá expertka popsala jeho omezení.','Máme jen reklamní větu výrobce „věda potvrzuje revoluci“. Studii, metodu ani výsledky nám neposlal.'],
      ['I předběžný výzkum lze zpravodajsky popsat s jasným označením a ověřenými omezeními.','Marketingová věta nenahrazuje dostupný výzkum. Zatím nemáme co věcně popsat.'],
      ['Text nepředstírá vědecký konsenzus ani definitivní průlom.','Za odkazem na studii je formulář „objednat 10 000 knoflíků“.'],
      'Knoflíková revoluce zatím nemá zapnutý peer review.',2),
    dossier('vzorek','research','V malém testu uspělo nové řazení katalogu u osmi z deseti účastníků.',
      ['Test měl deset účastníků, osm dokončilo úkol. Text uvádí malý vzorek a nepřenáší výsledek na všechny uživatele.','Test měl deset účastníků, ale zveřejněny byly jen dva vybrané úspěšné pokusy. Výsledky ostatních osmi chybí.'],
      ['Přesný popis omezeného testu je v pořádku. Malý vzorek vyžaduje přiznané hranice.','Neúplná data nedokládají výsledek osmi z deseti. Potřebujeme celý průběh a výsledky.'],
      ['V anonymizované tabulce je všech deset pokusů včetně dvou neúspěchů.','Výzkumník potvrdil, že zatím poslal jen sestřih dvou demonstrací.'],
      'Dva povedené pokusy a osm schovaných: to umí i redakční tiskárna.'),
    dossier('replikace','research','Druhý tým zopakoval výsledek pokusu s papírovými letadly.',
      ['Nezávislý tým použil popsaný postup a publikoval srovnatelné měření. Ověřili jsme, že jde o nový experiment.','Druhý tým pouze přeložil tiskovou zprávu prvního. Žádná další letadla nevypouštěl.'],
      ['Máme skutečné nezávislé opakování, nikoli jen převzetí informace.','Překlad výsledku není replikace experimentu. Titulek připisuje výzkum týmu, který ho neprovedl.'],
      ['Druhý tým má vlastní datovou sadu, jinou laboratoř i datum měření.','Veškeré časy letu i fotografie jsou totožné s první zprávou.'],
      'Papírové letadlo potřebuje druhý hod. Ne druhý tiskový mluvčí.'),

    dossier('anonym','ethics','Kontrola zjistila chyby v zakázce na kancelářské židle.',
      ['Tip přišel anonymně, ale pravost úplné kontrolní zprávy jsme ověřili u vydavatele. Dotčený úřad dostal konkrétní otázky a jeho odpověď je v textu.','Máme anonymní neúplnou přílohu bez ověřené pravosti. Dotčeného úřadu jsme se zatím neptali.'],
      ['Anonymní tip může vést k ověřené zprávě. Podstatná je následná práce s důkazy a férový kontext.','Tip je začátek práce. Potřebujeme ověřit dokument, úplnost i vyjádření dotčených.'],
      ['Závěry v titulku odpovídají úplné zprávě a nepřidávají trestní obvinění.','Příloha začíná stranou 4 a končí uprostřed věty „nejde však o…“.'],
      'Zdroj chráníme. Pravost přílohy tím nevznikne.',2),
    dossier('reklama','ethics','Partnerský text: nový kávovar v redakci šetří čas.',
      ['Placený text je od začátku výrazně označen jako reklama. Konkrétní údaj o době přípravy je doložený srovnatelným testem.','Výrobce zaplatil text, ale chce odstranit označení reklamy. Srovnávací test nikdo neprovedl.'],
      ['Komerční povaha je jasná a věcné tvrzení doložené. V rámci hry může takto označený text ven.','Skrytá reklama a nedoložený údaj potřebují opravu. Platba není zdroj ověření.'],
      ['Označení reklamy je i ve výpisu článků a tvrzení se omezuje na podmínky testu.','V e-mailu stojí „ať to působí jako vaše nezávislá recenze“.'],
      'Kávovar může sponzorovat kávu. Pravdu má bez provize.'),
    dossier('soukromi','ethics','Reportáž popisuje spor nájemníků o hlučný výtah.',
      ['Máme ověřené podklady i stanoviska stran. Fotografie dokumentů zakrývají rodná čísla, soukromé telefony a podpisy, které nejsou pro zprávu nutné.','Podklady jsou ověřené, ale zveřejňovaná příloha zbytečně ukazuje rodná čísla a soukromé telefony všech nájemníků.'],
      ['Ověření je doplněné přiměřenou ochranou soukromí. Pro tvrzení nepotřebujeme vystavit osobní údaje.','Před vydáním je třeba odstranit zbytečné osobní údaje. Pravdivý obsah sám neřeší způsob zveřejnění.'],
      ['Redakční kopie zachovává relevantní část sporu, citlivé údaje jsou zakryté.','Čtenářům stačí předmět stížnosti; soukromá čísla nikoho z nájemníků nepotřebují.'],
      'Výtah už slyší celý dům. Telefonní seznam přidávat nemusíme.',2),
    dossier('oprava','ethics','Oprava: otevření knihovny je ve čtvrtek, nikoli ve středu.',
      ['Knihovna potvrdila čtvrtek. Text viditelně uvádí naši původní chybu, správný údaj a čas opravy.','Nový termín máme jen z neověřeného komentáře. Původní chybu chceme potichu přepsat bez poznámky.'],
      ['Ověřená a viditelná oprava pomáhá obnovit důvěru a opravuje konkrétní chybu.','Nejdřív ověř nový údaj. Oprava má také čtenářům jasně říct, co se změnilo.'],
      ['Odkaz na aktuální oznámení knihovny souhlasí s potvrzením její ředitelky.','Komentátor má přezdívku VevodaZKopírky a žádný odkaz nepřiložil.'],
      'Guma není publikační strategie.'),
    dossier('obvineni','ethics','Policie prověřuje poškození obecní sochy.',
      ['Policie potvrdila prověřování. Článek rozlišuje podezření od prokázané viny a nikoho bez podkladů neoznačuje za pachatele.','Jediný komentář na síti označil souseda za viníka. Policejní prověřování jsme nepotvrdili, v textu už je jméno údajného pachatele.'],
      ['Ověřené procesní sdělení s přesným jazykem nepředbíhá výsledek.','Nemáme potvrzenou ani popisovanou policejní činnost. Nepodložené obvinění konkrétního člověka nemůže ven.'],
      ['Mluvčí výslovně mluví o prověřování, ne o odsouzení.','Komentátor uvedl jako důkaz „má doma podobné kladivo“.'],
      'Komentářová sekce nemá soudní razítko.',2)
  ];
  const VERIFY_BADGES={
    clean:{name:'Čisté razítko',glyph:'✓',text:'Celá směna správně bez dohledávání.'},
    brakes:{name:'Ruční brzda',glyph:'Ⅱ',text:'Alespoň čtyři správně zadržené zprávy.'},
    courage:{name:'Bez paranoie',glyph:'↗',text:'Alespoň čtyři správně vydané zprávy.'},
    streak:{name:'Redakční šňůra',glyph:'≋',text:'Osm správných rozhodnutí za sebou.'},
    night:{name:'Noční sova',glyph:'☾',text:'Noční uzávěrka s alespoň 90 % správných odpovědí.'},
    help:{name:'Telefon na zdroj',glyph:'☎',text:'Dohledání detailu a poté správné rozhodnutí.'}
  };
  function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function shuffle(items,r){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function hash(text){let h=2166136261;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function verifyDailyChallenge(date=new Date()){
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Prague',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(x=>[x.type,x.value]));
    const day=p.year+'-'+p.month+'-'+p.day,seed=hash('overeno-v3-'+day),modes=Object.keys(VERIFY_DESKS);
    return {seed,deskId:modes[seed%modes.length],daily:day,practice:false};
  }
  class Verify{
    constructor(options=Date.now()){
      if(typeof options==='number')options={seed:options};
      const deskId=VERIFY_DESKS[options.deskId]?options.deskId:'morning';
      this.options={seed:(options.seed??Date.now())>>>0,deskId,practice:!options.daily&&!!options.practice,daily:options.daily||'',recent:options.daily?[]:(Array.isArray(options.recent)?options.recent.filter(id=>VERIFY_FILES.some(f=>f.id===id)).slice(-40):[])};
      this.reset();
    }
    reset(){
      this.seed=this.options.seed;this.deskId=this.options.deskId;this.desk=VERIFY_DESKS[this.deskId];this.practice=this.options.practice;this.daily=this.options.daily;
      this.code=this.seed.toString(36).toUpperCase().padStart(7,'0');
      const r=random(this.seed),categories=shuffle(this.desk.categories,r),selected=new Set(),deck=[];
      const decisions=shuffle(Array.from({length:this.desk.count},(_,i)=>i%2===0),r);
      for(let i=0;i<this.desk.count;i++){
        const category=categories[i%categories.length],boss=this.deskId==='night'&&i===this.desk.count-1;
        let candidates=VERIFY_FILES.filter(f=>!selected.has(f.id)&&(boss?f.level===2:f.category===category));
        const penalty=f=>{const at=this.options.recent.lastIndexOf(f.id);return at<0?0:at+1;};
        candidates=shuffle(candidates,r).sort((a,b)=>penalty(a)-penalty(b));
        const f=candidates[0],ready=decisions[i],v=ready?0:1;selected.add(f.id);
        deck.push({id:f.id+':'+(ready?'ok':'stop'),family:f.id,category:f.category,headline:f.headline,source:f.source[v],ready,why:f.why[v],detail:f.detail[v],quip:f.quip,boss});
      }
      this.cards=deck;this.index=0;this.correct=0;this.score=0;this.combo=0;this.bestCombo=0;this.remaining=this.desk.seconds;this.checks=this.desk.checks;this.hintsUsed=0;this.detailOpen=false;this.phase='ready';this.paused=false;this.feedback=null;this.history=[];this.events=[];this.recorded=false;
    }
    get card(){return this.cards[this.index];}
    get total(){return this.cards.length;}
    get stars(){return this.phase==='won'?(this.correct/this.total>=.9?3:this.correct/this.total>=.75?2:this.correct/this.total>=.6?1:0):0;}
    get badges(){const good=this.history.filter(h=>h.correct),ids=[];if(this.phase==='won'&&this.correct===this.total&&!this.hintsUsed)ids.push('clean');if(good.filter(h=>!h.answer).length>=4)ids.push('brakes');if(good.filter(h=>h.answer).length>=4)ids.push('courage');if(this.bestCombo>=8)ids.push('streak');if(this.phase==='won'&&this.deskId==='night'&&this.correct/this.total>=.9)ids.push('night');if(good.some(h=>h.checked))ids.push('help');return ids;}
    start(){if(this.phase!=='ready')return false;this.phase='playing';return true;}
    inspect(){
      if(this.phase!=='playing'||this.paused||this.feedback||this.detailOpen||this.checks<=0)return false;
      this.checks--;this.hintsUsed++;this.detailOpen=true;
      if(!this.practice){this.remaining=Math.max(0,this.remaining-8);if(this.remaining===0)this.finish('lost');}
      this.events.push({type:'inspect'});return this.card.detail;
    }
    submit(answer){
      if(typeof answer!=='boolean'||this.phase!=='playing'||this.paused||this.feedback)return false;
      const correct=answer===this.card.ready;let points=0;
      if(correct){this.correct++;this.combo++;this.bestCombo=Math.max(this.bestCombo,this.combo);points=100+Math.min(4,this.combo-1)*15-(this.detailOpen?20:0);this.score+=points;}else this.combo=0;
      this.feedback={correct,why:this.card.why,points,expected:this.card.ready};
      this.history.push({card:this.card,answer,correct,checked:this.detailOpen,points});this.events.push({type:correct?'correct':'incorrect'});return this.feedback;
    }
    next(){
      if(!this.feedback||this.phase!=='playing'||this.paused)return false;
      this.feedback=null;this.detailOpen=false;this.index++;
      if(this.index===this.total)this.finish('won');return true;
    }
    finish(phase){if(this.phase!=='playing')return;this.phase=phase;this.events.push({type:phase});}
    update(dt){if(this.phase!=='playing'||this.paused||this.feedback||this.practice||!Number.isFinite(dt)||dt<=0)return;this.remaining=Math.max(0,this.remaining-dt);if(this.remaining===0)this.finish('lost');}
  }
  const api={Verify,VERIFY_CATEGORIES,VERIFY_DESKS,VERIFY_FILES,VERIFY_BADGES,verifyDailyChallenge};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VerifyGame=api;
})(typeof window!=='undefined'?window:globalThis);
