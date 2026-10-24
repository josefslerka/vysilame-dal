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
