**Vysíláme dál. — malé hry za nezávislá média**

**Hrát online:** [josefslerka.github.io/vysilame-dal](https://josefslerka.github.io/vysilame-dal/)

Otevři soubor **hry.html** v běžném prohlížeči. Obsahuje všechny tři hry, grafiku i styly. Funguje také offline, bez instalace a účtu. Zvuk je ve výchozím stavu vypnutý. Rekordy se ukládají pouze do místního úložiště prohlížeče.

Vzhled vychází z televizní režie, teletextu a starých arkád: signální žlutá, číslované kanály, mechanická tlačítka a vlastní pixelové postavy. Kavky Defender se otevírá rovnou na mapě. První stavba automaticky zahájí směnu; vlnu potom spustíš zvlášť. Na telefonu otevřeš další mapy klepnutím na název aktuální mapy.

- **Kavky Defender:** čtyři mapy, osm vln, jedenáct protivníků včetně dvou bossů, tři obtížnosti a kavka Kvído s nevyžádanými komentáři. Podrobnosti níže.
- **Ověřeno!:** osm smyšlených redakčních situací. Zvol „Ještě ověřit“ (F), nebo „Může ven“ (J). Limit 60 sekund běží pouze při rozhodování; při čtení vysvětlení stojí.
- **Drž signál:** tři rotační hlavolamy. Otoč dílky a propoj studio vlevo s veřejností vpravo. Na každý okruh je 90 sekund. Kliknutí nebo Enter otáčí, šipky přesouvají fokus po mřížce.

Při přepnutí na jinou hru nebo opuštění karty se rozehraná hra pozastaví. Tlačítko „?“ otevírá pravidla. Projekt nepoužívá skutečná loga ČT ani ČRo a není jejich oficiální hrou.

**Kavky Defender — rozšířená směna**

| Scéna | Co mění strategii |
| --- | --- |
| Kavčí hory | Původní klikatá trasa; za dokončenou vlnu 15 podpory navíc |
| Vinohradská 12 | Dva vstupy, které se spojí před studiem; reportéři mají o 15 % delší dosah |
| Výjezd do regionu | Dlouhá venkovská trasa; Komunita má o 30 % větší dosah a zpomaluje déle |
| Noční směna | Obrany v okruhu kávovaru střílí o 30 % rychleji |

Všechny mapy jsou dostupné od začátku. Vyber tempo Na pohodu, Redakční provoz nebo Krizový štáb. Každá scéna a obtížnost má vlastní rekord a medaile: zlato za alespoň 95 % zbývajícího signálu, stříbro za 60 %, bronz za přežití.

Vyber Ověřovnu, Reportéra nebo Komunitu a klikni na stanoviště +. Kliknutím na postavenou obranu otevřeš vylepšení, prodej a prioritu cíle (nejblíž cíli / nejsilnější / nejrychlejší). Klávesy 1–3 vybírají obranu, šipky stanoviště, Enter staví. Mezerník spouští vlnu nebo pozastaví hru. Přepínač 1× / 2× mění rychlost.

Po vlnách 2, 4 a 6 si z nabídky tří možností vybereš jeden bonus pro zbytek směny. Hra při poradě stojí. Sedm druhů bonusů zahrnuje Termosku solidarity, Grant na sponky a Kavčí posily. Klávesa K nebo tlačítko Kavčí nálet zasáhne současné protivníky za 45 bodů a na 2,2 sekundy je zastaví. Začínáš se dvěma nálety; po čtvrté vlně přibude jeden. Mezi nálety je 12 herních sekund.

V atlasu „Kdo nám leze do éteru?“ najdeš schopnosti i protiopatření. Klikbait se dělí na Vykřičníky, troll se regeneruje, Formulář A38 zpomaluje blízkou obranu a lobbista chrání sousedy. Ověřovna potlačuje regeneraci a rozebírá štíty; Reportér ignoruje odolnost a lobbistickou ochranu. Všechny postavy i jejich výroky jsou smyšlené.

„Jiná směna“ promíchá vlny a nabídky bonusů. Po dohrání můžeš zvolit „Stejná směna, lepší plán“ a zopakovat stejné zadání. Dnešní výzva nabízí společnou mapu a zadání pro dané místní kalendářní datum. Kód směny slouží k rozlišení zadání; import cizího kódu zatím není součástí hry.

Zdrojové soubory jsou rozdělené podle účelu:

| Soubor | Obsah |
| --- | --- |
| index.html | Základ rozcestníku a herních obrazovek |
| style.css | Responzivní vzhled pro počítač a telefon |
| defender.css | Výběr map, bonusové porady a atlas protivníků |
| defender.js | Pravidla Kavky Defender, mapy, protivníci, vlny a denní zadání |
| engine.js | Zprávy, hlavolamy a společný export herních jader |
| draw.js | Čtyři kreslené mapy, protivníci a animace na canvasu |
| app.js | Ovládání, zvuk, nabídky a propojení s rozhraním |
| bundle.cjs | Vytvoření přenositelného hry.html |
| qa/engines.test.cjs | Společné ověření všech tří her |
| qa/defender.test.cjs | Schopnosti, ekonomika, mapy, replay a simulace celých směn |

Po úpravě zdrojů spusť z této složky:

```sh
node qa/engines.test.cjs
node bundle.cjs
node qa/portable.test.cjs
```

Pro místní vývojový náhled lze použít:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Náhled je potom na http://127.0.0.1:4173/. Samostatný soubor hry.html tento server nepotřebuje. V této verzi není online žebříček, analytika, platební brána ani vzdálené ukládání dat.

GitHub Pages publikuje soubory z kořene výchozí větve `codex/main`. Soubor `.nojekyll` zachovává přímé publikování statických souborů. Při každém pushi a pull requestu GitHub Actions ověří herní jádra, znovu sestaví přenosnou hru a zkontroluje její aktuálnost. Po změně hry proto před commitem spusť i `node bundle.cjs`.
