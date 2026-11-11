// Deutsche Texte für die Fragen und ihre Seiten. Feld-ids müssen zu flows-en.js und dem Backend passen.
window.SITE_TEXT = (() => {
  const one = (opts, two) => ({ type: 'one', opts, two });
  const many = (opts, two) => ({ type: 'many', opts, two });
  const has = (a, id, ...v) => v.some(x => (a[id] || []).includes(x));
  const OPT = { opt: true };
  const ui = {
    of: 'von', check: 'Antworten prüfen', next: 'Weiter', toCheck: 'Antworten prüfen', sendMail: 'Per E-Mail senden', send: 'Senden', sending: 'Wird gesendet…',
    almost: 'Fast fertig', checkH: 'Prüf deine Antworten.', checkHintMail: 'Beim Senden öffnet sich dein E-Mail-Programm mit allem ausgefüllt. Dort drückst du auf Senden.', checkHintApi: 'Drück auf Senden, und es kommt direkt bei mir an. Du bekommst eine Kopie per E-Mail.',
    edit: 'Ändern', optional: 'optional', pick: 'Wähl mindestens eine Antwort.', star: 'Tipp auf einen Stern.', fill: f => `Bitte fülle „${f}“ aus.`, badEmail: 'Die E-Mail-Adresse sieht unvollständig aus.',
    consentMsg: 'Bitte setz das Häkchen, um weiterzumachen.', agreed: 'Zugestimmt',
    mailNote: (m) => `Nichts geöffnet? Deine Antworten sind kopiert. Füg sie in eine E-Mail an <a class="more" href="mailto:${m}">${m}</a> ein, oder <button class="more" type="button" data-copyall>kopier sie noch mal</button>.`,
    copied: 'kopiert', copyFail: 'Kopieren fehlgeschlagen', copiedBtn: 'Kopiert', failed: 'Senden hat nicht geklappt. Ich öffne stattdessen dein E-Mail-Programm.',
    slotsLoading: 'Freie Zeiten werden geladen…', slotsNone: 'In den nächsten zwei Wochen ist nichts frei. Starte gern ein Projekt, dann schlage ich dir eine Zeit vor.', slotsTz: 'Zeiten in deiner Zeitzone', slotTaken: 'Diese Zeit wurde gerade gebucht. Bitte wähl eine andere.', pickSlot: 'Wähl eine Zeit.',
    locale: 'de-DE',
  };
  const project = {
    type: 'project', title: 'Projekt starten', subject: a => `Projektanfrage von ${a.name || 'einem Besucher'}`,
    intro: 'Hallo Issa,\n\nhier ist meine Projektanfrage von deinem Portfolio.\n',
    done: ['Danke. Ich melde mich bald.', 'Dein E-Mail-Programm hat sich mit allen Antworten geöffnet. Drück dort auf Senden, damit sie bei mir ankommen. Meist antworte ich innerhalb von zwei Werktagen mit Fragen, einem Plan und einem Preis.'],
    doneApi: ['Danke. Ich melde mich bald.', 'Deine Anfrage ist bei mir angekommen, und eine Kopie ist auf dem Weg in dein Postfach. Meist antworte ich innerhalb von zwei Werktagen mit Fragen, einem Plan und einem Preis.'],
    steps: [
      { id: 'need', k: 'Das Projekt', sum: 'Möchte bauen', q: 'Was möchtest du bauen?', hint: 'Wähl alles, was passt.', ...many([['KI-Agent', 'Software, die Aufgaben selbst erledigt'], ['App', 'Desktop, Web oder Handy'], ['Website', 'Landingpage, ganze Website oder Shop'], ['Lokale KI', 'KI auf deiner eigenen Hardware'], ['Noch unsicher', 'Das finden wir gemeinsam heraus']]) },
      { id: 'goal', k: 'Das Projekt', q: 'Was soll es erreichen?', hint: 'Das eine Ergebnis, das dieses Projekt für dich zum Erfolg macht.', type: 'fields', fields: [{ id: 'goal', label: 'Das Hauptziel', sum: 'Hauptziel', area: true, req: true, ph: 'Zum Beispiel: Kunden buchen und bezahlen, ohne mich anzurufen, und ich spare 5 Stunden pro Woche.' }] },
      { id: 'today', k: 'Das Projekt', sum: 'Wie es heute läuft', q: 'Wie wird das heute gemacht?', ...one([['Von Hand', 'Anrufe, E-Mails, Papier oder Tabellen'], ['Mit einem anderen Werkzeug', 'Das aber nicht richtig passt'], ['Noch gar nicht', 'Es wäre etwas Neues'], ['Anders']]), fields: [{ id: 'pain', label: 'Was stört dich am meisten daran?', sum: 'Was stört', ...OPT }] },
      { id: 'stage', k: 'Das Projekt', sum: 'Stand', q: 'Wie weit bist du schon?', ...one([['Nur eine Idee', 'Noch nichts gebaut'], ['Pläne oder Entwürfe da', 'Ich weiß, wie es aussehen soll'], ['Es gibt schon etwas', 'Es soll verbessert oder erweitert werden'], ['Etwas ist kaputt', 'Es muss repariert werden']]), fields: [{ id: 'existing', label: 'Link zu dem, was es schon gibt', sum: 'Bestehender Link', ...OPT, ph: 'https://' }] },
      { id: 'about', k: 'Das Projekt', q: 'Beschreib es mit deinen Worten.', hint: 'Was soll es von Anfang bis Ende tun? Ein paar Sätze reichen.', type: 'fields', fields: [{ id: 'about', label: 'Dein Projekt', sum: 'Beschreibung', area: true, req: true, ph: 'Zum Beispiel: eine Buchungsseite für mein Studio. Kunden sehen freie Zeiten, wählen eine, bezahlen online und bekommen am Vortag eine Erinnerung.' }] },
      { id: 'features', k: 'Das Projekt', q: 'Was muss es können?', hint: 'Die Muss-Funktionen für die erste Version. Wünsche können später kommen.', type: 'fields', fields: [{ id: 'features', label: 'Muss-Funktionen', sum: 'Muss-Funktionen', area: true, req: true, ph: '1. Kunden sehen freie Zeiten\n2. Sie bezahlen beim Buchen\n3. Ich bekomme für jede Buchung eine E-Mail' }, { id: 'nice', label: 'Schön für später', sum: 'Wünsche', area: true, ...OPT }] },
      { id: 'where', k: 'Wo es läuft', sum: 'Läuft auf', q: 'Wo soll es laufen?', hint: 'Wähl alles, was passt.', ...many([['Im Browser'], ['Windows'], ['Mac'], ['iPhone und iPad'], ['Android'], ['Auf unserem eigenen Server oder PC'], ['Noch unsicher']], true) },
      { id: 'siteType', k: 'Die Website', sum: 'Art der Website', q: 'Was für eine Website?', when: a => has(a, 'need', 'Website'), ...one([['Eine Seite', 'Alles auf einer Scroll-Seite'], ['Kleine Website', '2 bis 5 Seiten'], ['Größere Website', '6 Seiten oder mehr'], ['Onlineshop', 'Produkte, Warenkorb und Kasse']]), fields: [{ id: 'pages', label: 'Welche Seiten brauchst du?', sum: 'Seiten', ...OPT, ph: 'Zum Beispiel: Start, Leistungen, Preise, Über uns, Kontakt' }] },
      { id: 'content', k: 'Die Website', sum: 'Texte und Bilder', q: 'Sind Texte und Bilder fertig?', when: a => has(a, 'need', 'Website'), ...one([['Alles fertig'], ['Teilweise fertig'], ['Bitte schreib und such sie für mich']]) },
      { id: 'domain', k: 'Die Website', sum: 'Domain und Hosting', q: 'Hast du eine Domain und Hosting?', when: a => has(a, 'need', 'Website'), ...one([['Beides', 'Zum Beispiel eine .de und einen Anbieter'], ['Nur eine Domain'], ['Keins, bitte richte es ein'], ['Weiß nicht']]), fields: [{ id: 'domainName', label: 'Deine Domain', sum: 'Domain', ...OPT, ph: 'beispiel.de' }] },
      { id: 'aiDo', k: 'Die KI', q: 'Was soll die KI selbst erledigen?', hint: 'Beschreib die Aufgaben so, wie du sie einem neuen Mitarbeiter erklären würdest.', when: a => has(a, 'need', 'KI-Agent', 'Lokale KI'), type: 'fields', fields: [{ id: 'aiTasks', label: 'Ihre Aufgaben', sum: 'KI-Aufgaben', area: true, req: true, ph: 'Zum Beispiel: neue Support-Mails lesen, die einfachen beantworten und mir den Rest mit Zusammenfassung schicken.' }, { id: 'aiNever', label: 'Was soll sie nie ohne Rückfrage tun?', sum: 'Nie ohne Rückfrage', ...OPT, ph: 'Zum Beispiel: Geld überweisen, Dateien löschen, Kunden anschreiben' }] },
      { id: 'aiData', k: 'Die KI', sum: 'KI arbeitet mit', q: 'Womit wird sie arbeiten?', hint: 'Wähl alles, was passt.', when: a => has(a, 'need', 'KI-Agent', 'Lokale KI'), ...many([['Dokumente und Dateien'], ['E-Mails'], ['Websites'], ['Eine Datenbank'], ['Kundenchats'], ['Code'], ['Etwas anderes']], true) },
      { id: 'aiCloud', k: 'Die KI', sum: 'Daten in Cloud-KI', q: 'Dürfen deine Daten zu einer Cloud-KI?', hint: 'Wie ChatGPT oder Claude. Wenn nicht, läuft die KI auf deinen eigenen Rechnern.', when: a => has(a, 'need', 'KI-Agent', 'Lokale KI'), ...one([['Ja, das ist okay'], ['Nur ein Teil davon'], ['Nein, sie müssen bei uns bleiben'], ['Weiß nicht']]) },
      { id: 'hardware', k: 'Die KI', sum: 'Hardware', q: 'Wie sieht es mit Hardware aus?', when: a => has(a, 'need', 'Lokale KI') || a.aiCloud === 'Nein, sie müssen bei uns bleiben', ...one([['Haben wir', 'Schreib unten, was es ist'], ['Wir brauchen Rat, was wir kaufen sollen'], ['Weiß nicht']]), fields: [{ id: 'hwDetails', label: 'Deine Hardware', sum: 'Hardware-Details', ...OPT, ph: 'Zum Beispiel: 2 PCs mit RTX 4090, 64 GB RAM' }] },
      { id: 'users', k: 'Wer es nutzt', sum: 'Genutzt von', q: 'Wer wird es nutzen?', ...one([['Nur ich'], ['Mein Team'], ['Meine Kunden'], ['Jeder im Internet']], true), fields: [{ id: 'howmany', label: 'Ungefähr wie viele Leute?', sum: 'Wie viele Leute', ...OPT, ph: 'Zum Beispiel: 5 Mitarbeiter und etwa 200 Kunden im Monat' }] },
      { id: 'login', k: 'Wer es nutzt', sum: 'Anmeldung', q: 'Müssen sich Leute anmelden?', ...one([['Nein'], ['Ja, alle gleich', 'Eine Art Konto'], ['Ja, mit verschiedenen Rollen', 'Zum Beispiel Admin und Kunde'], ['Weiß nicht']]) },
      { id: 'langs', k: 'Wer es nutzt', sum: 'Sprachen', q: 'Welche Sprachen?', ...many([['Deutsch'], ['Englisch'], ['Andere']], true), fields: [{ id: 'langOther', label: 'Andere Sprachen', sum: 'Andere Sprachen', ...OPT }] },
      { id: 'personal', k: 'Wer es nutzt', sum: 'Persönliche Daten', q: 'Speichert es persönliche Daten?', hint: 'Namen, E-Mails, Adressen, Zahlungen und so weiter. Das ist wichtig für den Datenschutz.', ...one([['Nein'], ['Ja, normale Kundendaten'], ['Ja, sensible Daten', 'Gesundheit, Geld, Ausweise'], ['Weiß nicht']]) },
      { id: 'connect', k: 'Verbindungen', sum: 'Verbunden mit', q: 'Muss es mit etwas verbunden werden?', hint: 'Wähl alles, was passt.', ...many([['Eine bestehende Website oder App'], ['Eine Datenbank oder Tabelle'], ['Zahlungen'], ['KI-Modelle', 'ChatGPT, Claude oder andere'], ['E-Mail, Kalender oder Chat'], ['Buchhaltung oder CRM'], ['Nichts, soweit ich weiß']], true), fields: [{ id: 'tools', label: 'Welche Werkzeuge genau?', sum: 'Werkzeuge', ...OPT, ph: 'Zum Beispiel: Shopify, Google Sheets, Stripe, HubSpot' }] },
      { id: 'look', k: 'Das Aussehen', sum: 'Aussehen', q: 'Wie soll es aussehen?', ...one([['Ich habe eine Marke', 'Logo, Farben und Schriften'], ['Ich habe ein paar Ideen'], ['Gestalte es für mich']]), fields: [{ id: 'feel', label: 'Drei Worte, wie es wirken soll', sum: 'Wirkung', ...OPT, ph: 'Zum Beispiel: ruhig, hochwertig, einfach' }] },
      { id: 'refs', k: 'Das Aussehen', q: 'Hast du Beispiele?', hint: 'Websites oder Apps, die du magst, und wer schon etwas Ähnliches macht. Optional, aber es hilft sehr.', type: 'fields', fields: [{ id: 'likes', label: 'Websites oder Apps, die du magst, und warum', sum: 'Gefällt', area: true, ...OPT }, { id: 'rivals', label: 'Wettbewerber oder ähnliche Produkte', sum: 'Wettbewerber', ...OPT }] },
      { id: 'time', k: 'Zeit und Budget', sum: 'Wann', q: 'Wann brauchst du es?', ...one([['So schnell wie möglich'], ['Innerhalb eines Monats'], ['In 2 bis 3 Monaten'], ['Kein festes Datum']], true), fields: [{ id: 'deadline', label: 'Ein fester Termin?', sum: 'Termin', ...OPT, type: 'date' }, { id: 'why', label: 'Wofür ist der Termin?', sum: 'Grund für den Termin', ...OPT, ph: 'Zum Beispiel: eine Messe, ein Start, eine Saison' }] },
      { id: 'budget', k: 'Zeit und Budget', sum: 'Budget', q: 'An welches Budget denkst du?', hint: 'Ein grober Rahmen reicht. So kann ich die richtige Größe für die erste Version vorschlagen.', ...one([['Unter 1.000 €'], ['1.000 bis 3.000 €'], ['3.000 bis 10.000 €'], ['10.000 bis 25.000 €'], ['Über 25.000 €'], ['Noch unsicher']], true) },
      { id: 'pay', k: 'Zeit und Budget', sum: 'Bezahlung', q: 'Wie möchtest du bezahlen?', ...one([['Festpreis', 'Für das ganze Projekt'], ['Nach Stunden', 'Für offene oder wechselnde Arbeit'], ['Monatlich', 'Für laufende Arbeit'], ['Egal']]) },
      { id: 'after', k: 'Zeit und Budget', sum: 'Nach dem Start', q: 'Und nach dem Start?', ...one([['Übergeben', 'Mein Team kümmert sich'], ['Laufende Betreuung', 'Updates, Fehler beheben, neue Funktionen'], ['Noch unsicher']]) },
      { id: 'you', k: 'Über dich', q: 'Wie erreiche ich dich?', type: 'fields', fields: [{ id: 'name', label: 'Dein Name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'E-Mail', sum: 'E-Mail', req: true, type: 'email', ac: 'email' }, { id: 'phone', label: 'Telefon', sum: 'Telefon', ...OPT, type: 'tel', ac: 'tel' }, { id: 'company', label: 'Firma', sum: 'Firma', ...OPT, ac: 'organization' }, { id: 'web', label: 'Website der Firma', sum: 'Website', ...OPT, type: 'url', ph: 'https://' }] },
      { id: 'decide', k: 'Über dich', sum: 'Entscheidet', q: 'Wer entscheidet über das Projekt?', ...one([['Ich entscheide'], ['Ich entscheide mit anderen'], ['Jemand anderes entscheidet']]), fields: [{ id: 'roleCo', label: 'Deine Rolle', sum: 'Rolle', ...OPT, ph: 'Zum Beispiel: Inhaber, Marketingleitung' }] },
      { id: 'found', k: 'Über dich', sum: 'Gefunden über', q: 'Wie hast du mich gefunden?', ...one([['Suche'], ['Social Media'], ['GitHub'], ['Freunde oder Kunden'], ['Woanders']], true) },
      { id: 'reply', k: 'Über dich', sum: 'Antwort per', q: 'Wie soll ich mich melden?', ...one([['E-Mail'], ['Anruf'], ['Videoanruf']], true), fields: [{ id: 'else', label: 'Sonst noch etwas, das ich wissen sollte?', sum: 'Sonstiges', area: true, ...OPT }] },
    ],
  };
  const review = {
    type: 'review', title: 'Bewertung schreiben', subject: a => `Bewertung von ${a.name || 'einem Kunden'}`,
    intro: 'Hallo Issa,\n\nhier ist meine Bewertung für dein Portfolio.\n',
    done: ['Danke dir.', 'Dein E-Mail-Programm hat sich mit deiner Bewertung geöffnet. Drück dort auf Senden, damit sie bei mir ankommt. Sie erscheint auf der Seite, sobald ich geprüft habe, dass sie zu einem echten Projekt gehört.'],
    doneApi: ['Danke dir.', 'Deine Bewertung ist bei mir angekommen. Sie erscheint auf der Seite, sobald ich geprüft habe, dass sie zu einem echten Projekt gehört.'],
    steps: [
      { id: 'stars', k: 'Deine Bewertung', sum: 'Bewertung', q: 'Wie war die Zusammenarbeit?', type: 'stars' },
      { id: 'project', k: 'Deine Bewertung', q: 'Was haben wir gebaut?', type: 'fields', fields: [{ id: 'project', label: 'Das Projekt', sum: 'Projekt', req: true, ph: 'Zum Beispiel: unsere Buchungsseite' }] },
      { id: 'text', k: 'Deine Bewertung', q: 'Erzähl anderen davon.', hint: 'Was lief gut, und was hätte besser sein können?', type: 'fields', fields: [{ id: 'text', label: 'Deine Bewertung', sum: 'Text', area: true, req: true }] },
      { id: 'who', k: 'Über dich', q: 'Wer bist du?', hint: 'Wird mit deiner Bewertung gezeigt.', type: 'fields', fields: [{ id: 'name', label: 'Dein Name', sum: 'Name', req: true, ac: 'name' }, { id: 'role', label: 'Rolle und Firma', sum: 'Rolle und Firma', ...OPT, ph: 'Zum Beispiel: Inhaberin, Studio Nord' }], consent: 'Ich bin einverstanden, dass diese Bewertung mit meinem Namen auf dieser Seite gezeigt wird.' },
    ],
  };
  const tester = {
    type: 'tester', title: 'Tester werden', subject: a => `Neuer Tester: ${a.name || 'ein Besucher'}`,
    intro: 'Hallo Issa,\n\nich möchte Tester werden.\n',
    done: ['Fast auf der Liste.', 'Dein E-Mail-Programm hat sich mit deinen Antworten geöffnet. Drück dort auf Senden, dann melde ich mich, sobald etwas Neues zum Testen bereit ist.'],
    doneApi: ['Schau in dein Postfach.', 'Ich habe dir eine E-Mail geschickt. Klick auf den Link darin, dann bist du auf der Liste.'],
    steps: [
      { id: 'what', k: 'Was du testest', sum: 'Möchte testen', q: 'Was möchtest du testen?', hint: 'Wähl alles, was dich interessiert.', ...many([['Overlink', 'Deine KI-Chats arbeiten auf deinen eigenen Rechnern'], ['PocketLM', 'Große KI-Modelle auf normalen PCs'], ['TradeLabs', 'Trading-Werkzeuge'], ['Licht', 'Ein Ort für alle deine KI-Chats'], ['Alles Neue', 'Sag mir bei jedem neuen Start Bescheid']]) },
      { id: 'devices', k: 'Deine Geräte', sum: 'Geräte', q: 'Was nutzt du?', hint: 'Wähl alles, worauf du testen könntest.', ...many([['Windows-PC'], ['Mac'], ['Linux'], ['iPhone'], ['Android']], true), fields: [{ id: 'gpu', label: 'Grafikkarte, falls du sie kennst', sum: 'Grafikkarte', ...OPT, ph: 'Zum Beispiel: RTX 3060, oder keine' }] },
      { id: 'aiUse', k: 'Deine Geräte', sum: 'Nutzt KI', q: 'Wie oft nutzt du KI-Werkzeuge?', ...one([['Jeden Tag'], ['Ein paar Mal pro Woche'], ['Ab und zu'], ['Kaum']], true), fields: [{ id: 'aiTools', label: 'Welche?', sum: 'KI-Werkzeuge', ...OPT, ph: 'Zum Beispiel: ChatGPT, Claude, Copilot' }] },
      { id: 'level', k: 'Über dich', sum: 'Technik', q: 'Wie würdest du dich beschreiben?', ...one([['Neu in der Technik', 'Ich nutze Apps, mehr nicht'], ['Sicher', 'Ich installiere und richte Dinge selbst ein'], ['Entwickler', 'Ich schreibe Code']]) },
      { id: 'time', k: 'Über dich', sum: 'Zeit pro Test', q: 'Wie viel Zeit hast du pro Test?', ...one([['Etwa 15 Minuten'], ['Etwa eine Stunde'], ['Ein paar Stunden'], ['Kommt drauf an']], true) },
      { id: 'how', k: 'Über dich', sum: 'Feedback per', q: 'Wie gibst du am liebsten Feedback?', hint: 'Wähl alles, was passt.', ...many([['Schriftliche Notizen'], ['Screenshots oder Bildschirmaufnahme'], ['Ein kurzer Anruf'], ['Genaue Fehlerberichte']], true) },
      { id: 'you', k: 'Über dich', q: 'Wer bist du?', type: 'fields', fields: [{ id: 'name', label: 'Dein Name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'E-Mail', sum: 'E-Mail', req: true, type: 'email', ac: 'email' }, { id: 'phone', label: 'Telefon', sum: 'Telefon', ...OPT, type: 'tel', ac: 'tel' }, { id: 'country', label: 'Land', sum: 'Land', ...OPT, ac: 'country-name' }] },
      { id: 'notify', k: 'Über dich', sum: 'Benachrichtigung per', q: 'Wie soll ich dir von einem neuen Test erzählen?', ...one([['E-Mail'], ['SMS'], ['WhatsApp']], true), consent: 'Ich bin einverstanden, Nachrichten von Issa zu bekommen, wenn etwas zum Testen bereit ist. Ich kann sie jederzeit abbestellen.' },
    ],
  };
  const support = {
    type: 'support', title: 'Support', subject: a => `Support: ${a.product || 'allgemein'} (${a.name || 'ein Nutzer'})`,
    intro: 'Hallo Issa,\n\nich brauche Hilfe.\n',
    done: ['Danke. Ich melde mich bald.', 'Dein E-Mail-Programm hat sich mit deiner Nachricht geöffnet. Drück dort auf Senden, damit sie bei mir ankommt.'],
    doneApi: ['Danke. Ich melde mich bald.', 'Deine Nachricht ist bei mir angekommen, und eine Kopie ist auf dem Weg in dein Postfach.'],
    steps: [
      { id: 'product', k: 'Support', sum: 'Produkt', q: 'Wobei brauchst du Hilfe?', ...one([['Overlink'], ['PocketLM'], ['TradeLabs'], ['Licht'], ['Ein Projekt, das ich für dich gebaut habe'], ['Etwas anderes']], true) },
      { id: 'kind', k: 'Support', sum: 'Art', q: 'Worum geht es?', ...one([['Etwas ist kaputt', 'Ein Fehler, ein Absturz oder es tut das Falsche'], ['Eine Frage', 'Wie mache ich …?'], ['Eine Idee', 'Etwas, das es können sollte']]) },
      { id: 'msg', k: 'Support', q: 'Erzähl mir, was passiert ist.', hint: 'Was hast du gemacht, was hast du erwartet, und was ist stattdessen passiert?', type: 'fields', fields: [{ id: 'message', label: 'Deine Nachricht', sum: 'Nachricht', area: true, req: true }, { id: 'steps', label: 'Schritte, um es nachzustellen', sum: 'Schritte', area: true, ...OPT, ph: '1. Öffne …\n2. Klick auf …\n3. …' }] },
      { id: 'setup', k: 'Support', q: 'Dein Gerät', hint: 'Optional, aber so finde ich das Problem schneller.', type: 'fields', fields: [{ id: 'device', label: 'Gerät und System', sum: 'Gerät', ...OPT, ph: 'Zum Beispiel: Windows-11-Laptop' }, { id: 'version', label: 'App-Version', sum: 'Version', ...OPT }, { id: 'link', label: 'Link zu einem Screenshot oder einer Aufnahme', sum: 'Screenshot-Link', ...OPT, type: 'url', ph: 'https://' }] },
      { id: 'you', k: 'Über dich', q: 'Wie erreiche ich dich?', type: 'fields', fields: [{ id: 'name', label: 'Dein Name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'E-Mail', sum: 'E-Mail', req: true, type: 'email', ac: 'email' }] },
    ],
  };
  const book = {
    type: 'book', title: 'Gespräch buchen', api: true, subject: a => `Gesprächsanfrage von ${a.name || 'einem Besucher'}`,
    intro: '', done: ['', ''],
    doneApi: ['Dein Gespräch ist gebucht.', 'Die Kalendereinladung ist in deinem Postfach. Den Link zum Videoanruf schicke ich dir vorher.'],
    steps: [
      { id: 'slot', k: 'Ein kostenloses 15-Minuten-Gespräch', sum: 'Zeit', q: 'Wähl eine Zeit, die dir passt.', type: 'slots' },
      { id: 'topic', k: 'Zum Gespräch', q: 'Worüber möchtest du sprechen?', type: 'fields', fields: [{ id: 'topic', label: 'Thema', sum: 'Thema', area: true, req: true, ph: 'Zum Beispiel: Ich möchte eine Buchungsseite für mein Studio und brauche einen Preis.' }] },
      { id: 'you', k: 'Über dich', q: 'Wer bist du?', hint: 'Die Kalendereinladung geht an diese E-Mail.', type: 'fields', fields: [{ id: 'name', label: 'Dein Name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'E-Mail', sum: 'E-Mail', req: true, type: 'email', ac: 'email' }, { id: 'company', label: 'Firma', sum: 'Firma', ...OPT, ac: 'organization' }, { id: 'phone', label: 'Telefon', sum: 'Telefon', ...OPT, type: 'tel', ac: 'tel' }] },
    ],
  };
  return { lang: 'de', ui, project, review, tester, support, book };
})();
