# Jovial Online Bedpres Bot (JOBB)

## Hva er dette? 🤔

JOBB, aka Bedpres Bot, er en meldingsbot som sender en SMS før påmelding til bedpres for linjeforeningen min, Online, på NTNU. Det var egentlig bare noe jeg lagde for meg selv og mine kompiser, men det er åpent for alle! Bare send en SMS til +1 573 538 2475 med kodeord ONLINE, så får du en SMS 5 minutter før påmelding åpner. Foreløpig er det ingen filtrering, så du får melding om alle arrangementer fra OW.

## Hvilke teknologier er brukt? 💻

Først hadde jeg tenkt å scrape OW, så jeg startet med Python fordi det har jeg brukt tidligere til scraping. Men jeg fant ut at OW hadde et åpent API, så da bare kjører jeg web requests. Men Python funker uansett bra, så fortsatte med det! Bruker Twilio for å sende SMS. Appen er delt i to: et Flask API som innkommende meldinger via Twilio sendes til, og en simpel app som oppdaterer en MongoDB database med nye arrangementer fra OW. Denne oppdateringen av nye arrangementer kjøres én gang i døgnet og kjøres på natta, så det skal ikke påvirke kapasiteten til OW i det hele tatt 🙌

## Hvordan kan jeg bidra? 🙋‍♂️

Hvis folk vil hjelpe til med koden, så kan jeg lage et roadmap og legge ut issues. Det hadde vært kult med hjelp! I tillegg, det å sende ut SMS er ikke veldig dyrt, men det er ikke gratis heller, så hvis du liker Bedpres Bot (_shameless self promotion incoming..._) og vil støtte tjenesten kan du gjerne vippse meg på 936 71 222. Koster meg totalt cirka en tubis i måneden, avhengig av hvor mange brukere jeg får og hvor mange bedpres Online organiserer 👀
