# En interaktiv upplevelse

## Om uppgiften
Uppgiften går ut på att med hjälp av Javascript skapa en interaktiv upplevelse där användaren kan göra förändringar i en värld.

## Spelet: "Vanished in Silence"
Vanished in Silence är ett interaktivt digitalt escape room där du tar rollen som en detektiv och försöker lösa mysteriet om Eleanor och de försvunna människorna som vågat besöka hennes herrgård. Medan du utforskar det hemsökta huset behöver du hitta lappar och nycklar som avslöjar mörka hemligheter om Eleanor. Varje lapp ger insikt i Eleanors liv men vissa är avgörande ledtrådar för att du ska kunna ta dig ut med livet i behåll. Men  var försiktig, missade ledtrådar och fel val kan vara din undergång. Kommer du att lösa mysteriet och bryta dig fri, eller kommer du att bli ännu en förlorad själ, fast i herrgårdens grepp? 

OBS CSS behöver justeras för skärmstorlek större än 13 tum, vissa lappar och text kanske inte syns inom spelets ram.

Klicka på länken för att komma till spelet: [Vanished in Silence](https://vickyphu.github.io/escape_room/)

## Planering av spelet
Klicka på länken för att se planeringen och flödesdiagramet för spelet i Figma: [Planering & Flödesdiagram](https://www.figma.com/board/jDuNflQsjvNxY9iKoyrs7o/Escape-room?node-id=0-1&t=mJTQnZAJNst3eE17-1)

## Utmaningar
En av utmaningarna var att skapa en synlig inventory för items som tillsammans skulle fungera med localStorage. När användaren plockar upp en lapp eller nyckel så ska den försvinna från scenen och hamna i inventory utan att dycka upp på scenen igen om användaren återvänder. Efteråt var det en kamp att få bort nyckeln på korrekt sätt från inventory när den används så att övriga items hoppar upp rent grafiskt. Av det blev det även en utmaning att faktiskt öppna upp den låsta knappen genom att använda nyckeln, vilket löstes genom att applicera id till nyckeln. Däremot fick jag inte till det med fler nycklar, för om den första nyckeln användes då fungerade inte den andra, men om den andra nyckeln användes först för att låsa upp ett rum så fungerade även den första nyckeln. Det här lyckades jag inte att lösa och var i slutändan tvungen att utesluta att ha flera nycklar, men det är något jag vill titta vidare på vid vidare utveckling av spelet. 
