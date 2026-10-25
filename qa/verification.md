**Ověření rozšířeného Kavky Defender — 24. října 2026**

Automatické kontroly spustíš příkazy uvedenými v README.

- Kavky Defender: 16 skupin kontrol. Ekonomika, nákup, vylepšení, prodej, pauza, geometrie čtyř map, dva vstupy Vinohradské, reprodukovatelná zadání, denní výzva a medaile.
- Schopnosti: dělení Klikbaitu, regenerace trolla a její potlačení, odolnost, štíty, ochranná aura lobbisty, imunita Kotrmelce vůči zpomalení, nesčítající se papírování A38, omezený doprovod Tiskovky, mapové výhody, nálet a tři priority cílení. Porada zastaví čas a dovolí zvolit právě jeden nabízený bonus.
- Úplné simulace: čtyři mapy × tři obtížnosti × tři zadání (seedy 1, 42, 299), celkem 36 směn. Ukázkové smíšené strategie vyhrály 35krát. Na každé mapě existuje vítězná strategie i pro Krizový štáb; stejné rozmístění na Noční směně se seedem 42 prohrálo ve čtvrté vlně. Směny bez obrany prohrály na všech čtyřech mapách. Opakování stejné směny dalo totožný výsledek.
- Ověřeno!: všech osm karet, bodování, odmítnutí dvojí odpovědi, zastavení časovače při vysvětlení a vypršení času.
- Drž signál: 30 seedů × tři okruhy, celkem 90 řešitelných zadání; přechody mezi koly a vypršení času.
- Skutečný prohlížeč: výběr Noční směny a denní výzvy na Vinohradské, stavba obran klávesnicí, první dvě vlny, rychlost 2×, výběr bonusu, změna priority a vylepšení obrany. Při zkoušce byla odstraněna chyba, která zbytečným překreslováním detailu obrany přerušovala interakce. Po opravě prošla i kontrola odpovědi s vysvětlením v Ověřeno! a otáčení dílků v Drž signál.
- Mobilní rozložení: vizuální kontrola při šířce 390 px v samostatném rámci. Volba mapy a obtížnosti, regionální výjezd, stavba všech tří druhů obrany, kavčí nálet a bonusová porada po druhé vlně. Výška překryvných karet se přizpůsobuje obsahu; všechny tři volby jsou celé viditelné a výběr Termosky převede hru zpět do přípravy. Jde o kontrolu responzivního rozložení, nikoli o zkoušku na fyzickém telefonu.
- Přenosný soubor: čtyři syntakticky platné vložené skripty, dva vložené styly, 78 jedinečných HTML ID; všechny doslovné odkazy rozhraní míří na existující prvky. Žádné externí soubory nutné pro běh. Jediný vzdálený odkaz vede volitelně na podklad ke kontextu projektu.

Soubor hry.html byl otevřen a vyzkoušen přes místní HTTP server. Přímou navigaci na file:// testovací prohlížeč nepovoluje; toto omezení nebylo obcházeno.

**Výtvarná revize — televizní arkáda**

- Překreslené všechny čtyři scény, studio, tři obrany a jedenáct protivníků. Kresba používá plochu 480 × 288 bodů se zvětšením bez vyhlazování. Atlas ukazuje stejné postavy jako hra; portréty vznikají místně, bez stahování obrázků.
- Změněna typografie, barvy, výběr map a ovládací prvky všech tří her. Kavky Defender nemá úvodní překryv: první stavba zahájí směnu, spuštění vlny zůstává samostatné. Na telefonu začíná výběr map sbalený.
- Prohlížeč: přímá stavba klávesnicí, běh vlny, vykreslení všech jedenácti portrétů v atlasu a náhled městské a noční mapy. Ověřeno i zodpovězení zprávy v Ověřeno! a otočení dílku v Drž signál.
- Rám o šířce 390 px: výběr lehkého tempa, přímá stavba všech tří obran, dvě dokončené vlny, celá bonusová porada a volba Grantu na sponky. Podpora správně vzrostla ze 476 na 566 a hra pokračovala přípravou.
- Kontroly herních jader i přenosného HTML prošly. Pravidla, ekonomika, mapové trasy a uložené rekordy zůstávají kompatibilní.
- Nové snímky: kavky-defender-teletext.png a kavky-mobile-teletext.png. Starší snímky zachycují předchozí výtvarnou verzi.

Neověřeno: všechny možné strategie, dlouhodobé vyvážení obtížnosti a fyzická mobilní zařízení. Úspěch jedné automatické strategie není zárukou stejné obtížnosti pro začínajícího hráče.

**Ověřeno! — rozšíření redakce, 24. října 2026**

- Nové jádro v `verify.js`: 40 spisů, 80 variant podkladů, osm témat a čtyři redakční směny. V jednom zadání se spis neopakuje, vyvážení připouští vydané i zadržené zprávy. Při novém losování se zohledňuje nedávná historie; přesné opakování zachovává její původní snímek. Denní zadání místní historii ignoruje.
- Automatické ověření 300 seedů pro každou redakci, celkem 1 200 zadání. Pokryto všech 80 variant, správný tematický rozsah, vyvážení, závěrečný noční chyták, opakování stejného zadání i upřednostnění méně hraných spisů. Kontrola českého data denní výzvy zahrnuje půlnoc v Europe/Prague.
- Kontroly bodování a horního limitu série, chyby a resetu série, odmítnutí dvojí odpovědi, omezeného počtu dohledání, ceny 8 sekund a 20 bodů, zastavení času při vysvětlení a pauze. Ověřen časový konec při dohledání, odmítnutí odpovědi po konci, ignorování neplatného času, hraní bez časovače a hranice všech razítek.
- Přenosná hra má pět vložených skriptů a tři styly. Test spouští její skutečná vložená herní jádra v izolovaném prostředí a dokončí celou směnu; kontroluje také jedinečná HTML ID a existenci používaných prvků.
- Skutečný prohlížeč: dokončená Obrazová redakce bez časovače s jednou záměrnou chybou a jedním dohledáním. Výsledek 7/8, 890 bodů, stříbrné razítko; rozbor ukázal původní podklady, zvolená rozhodnutí a vysvětlení. Přesné opakování vrátilo stejný kód i první zprávu a její podklady. Klávesy D, F, J a Enter prošly, fokus přechází na pokračování a další zprávu.
- Mobilní rozložení v rámci o šířce 390 px: nabídka všech čtyř redakcí, volba denního vydání, vynucený časovač, zahájení Noční uzávěrky a dohledání detailu. Správná odpověď přidala 80 bodů, čas při vysvětlení stál. Zdroj, detail, vysvětlení a tlačítko pokračování zůstaly čitelné a dosažitelné svislým posunem. Jde o kontrolu rozložení, nikoli fyzického telefonu.

Snímek mobilní kontroly je uložen v `qa/overeno-mobile.png`. Automatické kontroly všech tří her zůstávají součástí GitHub Actions. Zpravodajské situace jsou autorské fikce; nejde o tvrzení o skutečných osobách či událostech.

**Drž signál — technická pohotovost, 24. října 2026**

- Samostatné jádro `signal.js`: 24 stálých zakázek ve čtyřech oblastech, velikosti 4 × 4 až 6 × 6. Další losované sítě mění skutečné cesty a větvení. Generátor vybere překážky při zachování propojené volné desky, vytvoří strom a připojí vstup, všechny přijímače i povinná relé. Pevné dílky mají správnou orientaci, ale hráč může využít i jinou platnou cestu. Každý hlavolam začíná nevyřešený.
- Automatické kontroly dokončily 1 314 hlavolamů: 24 stálých zakázek, 100 seedů × čtyři oblasti × tři okruhy a 30 denních přenosů po třech okruzích. Nezávislý průchod grafem ověřuje vygenerovanou cestu, všechny přijímače a relé. Kontroluje se dostupnost variant, změna struktury sítí, správné překážky, pevné spoje a přesné opakování zadání.
- Samostatné případy prověřují izolovanou smyčku bez napájení, chybějící relé i při napojených přijímačích, druhý odpojený přijímač, neprůchodnou překážku a nemožnost přejít z pravého okraje na levý okraj dalšího řádku.
- Ověřeny oba směry otáčení, krok zpět bez vracení započteného tahu, odmítnutí zásahů do pevných spojů a překážek, limity nápověd, ochrana před dvojím účtováním stejné nápovědy, restart bez doplnění nápověd, bodování a medaile. Pauza, časový konec, neplatné časové vstupy, režim bez časovače i přechod mezi okruhy mají kontroly. Denní přenos používá české kalendářní datum a tři různé oblasti.
- Skutečný prohlížeč: Obec-1 dokončena klávesnicí v pěti tazích, 750 bodů a tři hvězdy. Vzorové zapojení vykreslilo odpovídající cestu. Následující zakázka, nápověda H, otočení, krok zpět Z, restart a pauza P prošly. Postup po opětovném otevření hry zůstal uložený.
- Mobilní rám 390 px: vybrána poslední noční zakázka bez časovače. Všech 36 polí, tři přijímače, tři relé, šest skříní a pět pevných spojů bylo čitelných. Dokončení v 17 tazích přidělilo 750 bodů, tři hvězdy a příslušné odznaky. Obrácení směru fungovalo tlačítkem. Stav 2/3 přijímačů a 3/3 relé ještě neukončil hru; skončila až po připojení poslední větve. Výsledková karta a její ovládání byly dostupné svislým posunem. Snímek: `qa/signal-mobile-result.png`.
- Denní přenos na mobilním rozložení: vynutil zapnutý časovač, první okruh byl dokončen v sedmi tazích. Mezivýsledek zastavil čas a tlačítko Další okruh převedlo hru z obecní sítě do oblasti Přenos z terénu s novým časem, dvěma přijímači a dvěma relé.
- Přenosná hra má šest vložených skriptů a čtyři styly. Test spustí skutečná vložená jádra v izolovaném prostředí a dokončí Ověřeno! i hlavolam Drž signál bez načítání externích souborů. Kontrolují se i jedinečná ID a existující vazby ovládání.

Mobilní kontrola proběhla v rámci, nikoli na fyzickém telefonu. Není prokázána jedinečnost ani globální optimalita vzorových řešení; rozhraní to výslovně uvádí. Dlouhodobé vyvážení obtížnosti vyžaduje další hraní.

**Kavky Defender — ostrost mapy, 25. října 2026**

- Mapa se nyní kreslí přímo do canvasu o velikosti zobrazené plochy násobené hustotou pixelů displeje. Odstraněno zvětšování pomocného obrázku 480 × 288, které znehodnocovalo malé písmo. Geometrie map a postav i herní souřadnice 960 × 576 zůstaly zachovány.
- Skutečný prohlížeč: čitelnost cedulí a pokynů, stavba obrany, spuštění vlny a pauza. Změna šířky okna z 1280 na 1587 a 390 px přepočítala canvas z 948 × 569 na 1133 × 680 a 362 × 217 bodů. Kliknutí na stanoviště fungovalo i po zmenšení. Ověřeno responzivní rozložení, nikoli fyzický telefon.
- Kontroly všech tří her, přenosného HTML a čistoty změn prošly. Přenosná verze byla znovu sestavena ze stejných zdrojů.

**Kavky Defender — mobilní ovládání, 25. října 2026**

- Do šířky 850 px používá hra posouvatelný detail mapy o šířce nejméně 640 px. Přepínač Celá mapa ukáže přehled; klepnutí do přehledu přiblíží dané místo. Důležité názvy a pokyny používají běžný HTML text. Drobná dekorativní písmena se v mobilní mapě nekreslí.
- Stanoviště mají skutečná tlačítka 44 × 44 px a vlastní čísla. Výběr obrany je přímo pod mapou. Výběr prázdného stanoviště jen naplánuje stavbu; podpora se odečte až tlačítkem Postavit. Plán má zrušení, rozpočet se znovu kontroluje při potvrzení. Obsazené stanoviště otevře vylepšení, prodej a prioritu cílení. Stav kávovaru a papírování se zobrazuje i na mobilních jednotkách.
- Prohlížeč při 390 × 844 a 320 × 568: čitelnost mapy a panelu, výběr a zrušení plánu bez utracení podpory, stavba za 65, vylepšení za 52, změna priority a prodej s vrácením 76. Na noční mapě byly postaveny Ověřovna i Reportér v dosahu kávovaru; při zbývajících 50 byl plán Komunity za 80 správně zablokovaný. Prošlo spuštění vlny, kavčí nálet s odpočtem obnovy a pauza.
- Na všech čtyřech mapách byly při šířce 320 px ověřeny rozměry stanovišť, žádné překrývání tlačítek a žádné vodorovné přetékání stránky. Ovládání mapy, stavby a hry má cíle nejméně 44 × 44 px. Posun detailu na 273 px nezměnil podporu ani plán stavby. Přehled a návrat do detailu správně přepočítaly canvas i posun mapy.
- Po návratu na počítač se výběr obrany přesunul zpět do postranního panelu; klávesy 2 a Enter postavily Reportéra za 95. Ověřeno! přijalo rozhodnutí a Drž signál otočil dílek. Mobilní rozložení bylo zkoušeno změnou rozměrů prohlížeče, nikoli na fyzickém telefonu.
- Nová automatická kontrola chrání geometrii dotykových stanovišť na všech mapách; Kavky Defender má nyní 17 skupin kontrol. Přenosné HTML obsahuje šest skriptů, čtyři styly a 149 jedinečných ID. Snímek mobilní stavby: `qa/kavky-mobile-controls.png`.
