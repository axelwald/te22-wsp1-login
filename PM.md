Post Mortem Login
Axel Waldenborg och 2025/05/26.

Inledning
Syftet med denna uppgift var att skapa en webbsida baserad från de principer vi lärt för hur man hanterar databaser genom sql kod, och att kunna läsa av, lagra data, och sen använda den datan för att ha användare som låter oss skapa en login funktion.
Arbetet innehöll att skapa tabeller inom både TablePlus och att dynamiskt skapa en databas genom sqlite3, det innehöll också att använda oss av frameworks som express för att skapa bättre organiserad och mindre redundans genom att använda oss av routes och nunjucks templates.


Bakgrund
Redovisa arbetets olika delar. Så att läsaren förstår vad du gjort och hur.
Arbetet innebärde att
    - Skapa en webbsida där man kan ta information genom att använda sig av en post form som sedan skickades vidare för att processeras
        Webbsidan gjordes genom nunjucks templates, vilket innebär att ha en sorts layout template som sedan används i alla andra nunjucks templates, nunjucks är lite som en html sida, men det låter oss dynamisk rendera olika webbsidor och olika element genom vårat express js framework med hjälp av res.render, post formen hade två inputs, vilket var username och password, och dessa användes för att skicka vidare till login.js vilket är min router, och sen tar emot denna data, för att antingen använda för att jämföra och se ifall det finns ett konto som matchar inloggningen i databasen, eller för att skapa en ny användare.

    - Använda sig av en databas som mysql eller sqlite3 för att skapa ny användare, och använda sedan att crosschecka inlogget för att se ifall det finns en användare som motsvarar inlogget i databasen
    - Använda sig av bcrypt för att hasha lösenord för att inte lagra lösenordet i plaintext, vilket är en otroligt farlig grej som gör det lätt att sno lösenord, och annan data från webbsidan.
    - Använda sig av express js och använda sig av routes, och routers för att skapa en organiserad och modulerad webbsida som gör det lätt för att lägga till saker, och ta bort utan att saker ska sluta fungera.
    

Positiva erfarenheter
Här beskriver du vad som har gått bra i ditt projekt och analyserar varför. Hur ska du upprepa framgångarna.
Det gick bra att migrera mysql till sqlite3, främst för att det var små ändringar som behövdes göra för att få det att fungera, samt att få admin att fungera var det egentligen bara att lägga till en column som var role med datatypen varchar(30).
En annan sak som var lätt var att få inlogget att fungera, för att det var egentligen bara en post form som hade action till sidan där jag ville ha informationen, sen kan man bara ta information från formen genom en router.post(). Det var lätt eftersom jag har gjort det tidigare med qvitter och med quiz, så jag kände att det var något jag har arbetat med och var ganska lätt


Negativa erfarenheter
Här beskriver du det som du anser har gått mindre bra med ditt projekt och analyserar hur du kan undvika detta i framtida projekt.
Jag hade några strul med mysql databasen pågrund av att jag skrev in viss inloggningsinformation fel, vilket egentligen var bara att gissa tills det blev rätt, men annars gick det ganska bra.
Hade också någa problem med hur webbsidorna redirecterade till varandra, men det var bara ett programmeringsfel, där jag skrev fel routes, och var fixat ganska lätt.
Det känns som att det var egentligen bara små misstag som alltid händer när man jobbar med lite större projekt, och att i framtiden kan man försöka vara nogare, men finns också risk att det händer.


Sammanfattning
Här redovisar du dina slutsatser, erfarenheter och lärdomar. Reflektera över din produkt och dess/dina utvecklingsmöjligheter. Vad kan vidareutvecklas och finns det utrymme att bygga vidare på projektet.
Jag känner att jag lärde mig kanske inte jätte många nya saker, men känner att jag blev mer van med att använda mig av express js, och att skicka data fram och tillbaka, och använda mer effektivt av nunjucks templates.
Jag tror att webbsidan skulle dock kunnat förbättras, all kod ligger i login.js och är inte så bra uppdelat för den uppgift som den utför, och tror definitivt att det hade kunnat vara mer modulerat, och är förmodligen vad jag hade vidareutvecklat ifall jag hade tiden.