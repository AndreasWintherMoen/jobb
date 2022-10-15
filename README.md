# Jovial Online Bedpres Bot (JOBB)

## Hva er dette? 🤔

JOBB, aka Bedpres Bot, er en meldingsbot som sender en SMS før påmelding til bedpres for linjeforeningen min, Online, på NTNU. Det var egentlig bare noe jeg lagde for meg selv og mine kompiser, men det er åpent for alle! Bare send en SMS til +1 573 538 2475 med kodeord ONLINE, så får du en SMS 5 minutter før påmelding åpner. Foreløpig er det ingen filtrering, så du får melding om alle arrangementer fra OW.

## Hvilke teknologier er brukt? 💻

Først hadde jeg tenkt å scrape OW, så jeg startet med Python fordi det har jeg brukt tidligere til scraping. Men jeg fant ut at OW har et åpent API, så da bare sender jeg bare web requests. Men Python funker uansett bra, så jeg fortsatte med det! For å sende SMS bruker jeg Twilio. Backend er delt opp i to: et Flask API som innkommende meldinger via Twilio sendes til, og diverse serverless funksjoner som kjører på Google Cloud. Se README i _backend/_ for mer detaljer. Det skal også komme en frontend før neste semester. Denne er laget i React med Next og TypeScript.

## Hvordan kan jeg bidra? 🙋‍♂️

- _Jeg vil bidra med kode!_ - Sjekk ut issues på GitHub. Enkle issues skal være markert med `good first issue`. Hvis du har noen spørsmål, så bare spør! Du kan også lage nye issues hvis du har en idé til en feature eller noe som kan forbedres.
- _Jeg har ikke tid/lyst til å kode, men kan jeg bidra på andre måter??_ - Så hyggelig at du spør! Det å sende ut SMS er ikke veldig dyrt, men det er ikke gratis heller, så hvis du liker Bedpres Bot (_shameless self promotion incoming..._) og vil støtte tjenesten kan du gjerne vippse meg på 936 71 222. Koster meg totalt cirka 50-100kr i måneden, avhengig av hvor mange brukere jeg får og hvor mange bedpres Online organiserer 👀

## Hva er planen framover? 📝

- [x] ~~Lage en enkel backend som sender SMS til subscribers før påmeldingsfrist.~~
- [x] ~~Legge til funksjonalitet i backend for å sende ut påminnelse før avmeldingsfrist. For å gjøre dette må OW-data integreres med nåværende subscribers i databasen, og brukere meldt på arrangementet må sammenlignes med subscribers for å finne ut hvem som skal få SMS.~~
- [x] ~~Ad support 💰. Målet med Bedpres Bot er på ingen måte å tjene penger, men det hadde vært fint å ikke tape mye penger heller. Jeg tenkte derfor vi kan sende ut SMS regelmessig (tenker maks én gang i måneden) med en referral til en eller annen tjeneste jeg bruker. For denne løsningen er det viktig å ikke spamme folk, så jeg har lyst til å ha oversikt over hvilke ads brukere har mottatt, sånn at de ikke får samme ad flere ganger. Brukere som har vippset synes jeg bør få en ad-fri versjon av tjenesten.~~
- [ ] Lage en frontend med mulighet til å vise kommende bedpres og slå av og på SMS-varsel. Må ha innlogging med Online-bruker. Målet er å ha en deployed versjon før neste semester starter.
