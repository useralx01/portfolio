/* Scene: Booking agent (hotel). Facts from work-cats\booking\index.html (Hotel am See, Jan Brenner, Zimmer 202, 04.12. to 07.12.2026, door code 4827, new code 6143). */
(window.MODELS = window.MODELS || {})['booking-agent'] = {
  aria: { en: 'Model of the booking agent: the hotel, what comes in, how it thinks, what it does', de: 'Modell des Buchungs-Agenten: das Hotel, was reinkommt, wie er denkt, was er tut' },
  steps: [
    { t: { en: 'Your hotel, as a model', de: 'Dein Hotel als Modell' }, p: { en: 'First it learns your hotel: guests, bookings, door codes, messages, cleaning and your house rules, and how they connect.', de: 'Zuerst lernt er dein Hotel: Gäste, Buchungen, Türcodes, Nachrichten, Reinigung und deine Hausregeln, und wie sie zusammenhängen.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'Bookings from Booking.com, mails, guest messages on WhatsApp and direct bookings on your website.', de: 'Buchungen von Booking.com, Mails, Gästenachrichten auf WhatsApp und Direktbuchungen auf deiner Webseite.' } },
    { t: { en: 'How it thinks', de: 'Wie er denkt' }, p: { en: 'Your house rules, set once: check-in from 15:00, check-out by 10:00, a door code only for the stay, the guest’s own language.', de: 'Deine Hausregeln, einmal festgelegt: Check-in ab 15:00, Check-out bis 10:00, ein Türcode nur für den Aufenthalt, die Sprache des Gastes.' } },
    { t: { en: 'What it can do', de: 'Was er tun kann' }, p: { en: 'It enters the booking, writes to the guest on WhatsApp, plans the cleaning and sends confirmations.', de: 'Er trägt die Buchung ein, schreibt dem Gast auf WhatsApp, plant die Reinigung und schickt Bestätigungen.' } },
    { t: { en: 'The agent runs', de: 'Der Agent läuft' }, p: { en: 'A new booking: read, in the system, door code made, check-in message sent, cleaning planned. 09:14 to 09:15.', de: 'Eine neue Buchung: gelesen, im System, Türcode erzeugt, Check-in-Nachricht raus, Reinigung geplant. 09:14 bis 09:15.' } },
    { t: { en: 'Your team keeps its hands free', de: 'Dein Team hat die Hände frei' }, p: { en: 'You and your team see what happened on your phone. The agent only does what your house rules allow.', de: 'Du und dein Team seht aufs Handy, was passiert ist. Der Agent tut nur, was deine Hausregeln erlauben.' } }
  ],
  plane: { title: { en: 'Your hotel as a model', de: 'Dein Hotel als Modell' }, info: { en: 'Everything it knows, linked: the guest, the booking, the door code, the message, the cleaning, the rules. So the agent acts on the whole picture, not on one mail.', de: 'Alles, was er weiß, verknüpft: der Gast, die Buchung, der Türcode, die Nachricht, die Reinigung, die Regeln. So handelt der Agent nach dem ganzen Bild, nicht nach einer einzelnen Mail.' } },
  objects: [
    { k: 'hotel', name: { en: 'Hotel am See', de: 'Hotel am See' }, c: [1.6, 1.4], pz: 2.1, parts: [['building', .5, .5, { w: 2.2, d: 1.6, h: 1.5, sign: 1 }]],
      info: { en: 'A made-up hotel with 24 rooms. Everything the agent does happens in its name and follows its house rules.', de: 'Ein ausgedachtes Hotel mit 24 Zimmern. Alles, was der Agent tut, passiert in seinem Namen und nach seinen Hausregeln.' } },
    { k: 'booking', lit: 1, name: { en: 'Booking', de: 'Buchung' }, sub: { en: 'room 202 · 3 nights', de: 'Zimmer 202 · 3 Nächte' }, c: [6.1, 1.3], pz: 1.7, parts: [['calendar', 5.5, 1.0]],
      info: { en: 'The booking mail from Booking.com, read and entered: room 202, 4 to 7 December 2026, two guests. It shows up in your calendar by itself.', de: 'Die Buchungsmail von Booking.com, gelesen und eingetragen: Zimmer 202, 4. bis 7. Dezember 2026, zwei Gäste. Sie steht von selbst in deinem Kalender.' } },
    { k: 'cust', lit: 1, name: { en: 'Guest', de: 'Gast' }, sub: 'Jan Brenner', title: { en: 'Guest · Jan Brenner', de: 'Gast · Jan Brenner' }, c: [9.8, 1.3], pz: 1.9, parts: [['person', 9.6, 1.1, { big: 1 }], ['person', 10.5, 1.6, {}]],
      info: { en: 'Jan Brenner and one more guest. The booking, the door code and the messages all link to him, so nothing gets mixed up.', de: 'Jan Brenner und ein weiterer Gast. Buchung, Türcode und Nachrichten hängen alle an ihm, so verwechselt sich nichts.' } },
    { k: 'rules', name: { en: 'House rules', de: 'Hausregeln' }, sub: { en: 'set by you', de: 'von dir festgelegt' }, c: [2.0, 5.3], pz: 1.0, parts: [['folder', 1.0, 4.7], ['doc', 2.4, 4.6, {}]],
      info: { en: 'Check-in from 15:00, check-out by 10:00, quiet hours, Wi-Fi, emergencies. The agent answers only from these rules and invents nothing.', de: 'Check-in ab 15:00, Check-out bis 10:00, Ruhezeit, WLAN, Notfall. Der Agent antwortet nur aus diesen Regeln und erfindet nichts.' } },
    { k: 'clean', lit: 1, name: { en: 'Cleaning', de: 'Reinigung' }, sub: { en: 'Mon 7 Dec · 11:00', de: 'Mo 7.12. · 11:00' }, c: [4.8, 5.5], pz: .75, parts: [['sheet', 4.0, 4.8, { w: 1.9, d: 1.4, mark: 1 }]],
      info: { en: 'The cleaning plan for your team. For this booking the agent adds a room 202 clean-up for the departure day, Monday at 11:00.', de: 'Der Reinigungsplan für dein Team. Für diese Buchung trägt der Agent Zimmer 202 zur Endreinigung am Abreisetag ein, Montag 11:00.' } },
    { k: 'code', lit: 1, name: { en: 'Door code', de: 'Türcode' }, sub: { en: '4827 · this stay only', de: '4827 · nur dieser Aufenthalt' }, c: [7.6, 5.4], pz: .75, parts: [['tag', 7.0, 4.9]],
      info: { en: 'A code made for this stay only: valid 4 December 15:00 until 7 December 10:00. If a door does not take it, the agent makes a new one.', de: 'Ein Code nur für diesen Aufenthalt: gültig vom 4. Dezember 15:00 bis 7. Dezember 10:00. Nimmt die Tür ihn nicht an, erzeugt der Agent einen neuen.' } },
    { k: 'msg', lit: 1, name: { en: 'Check-in message', de: 'Check-in-Nachricht' }, sub: 'WhatsApp', c: [10.2, 5.5], pz: 1.35, parts: [['chat', 9.5, 5.0]],
      info: { en: 'A WhatsApp to the guest with the room, the door code and what he needs. Check-in works on its own, no front desk needed.', de: 'Eine WhatsApp an den Gast mit Zimmer, Türcode und allem, was er braucht. Der Check-in läuft selbständig, ohne Empfang.' } }
  ],
  links: [['cust', 'booking'], ['booking', 'hotel'], ['booking', 'code'], ['code', 'msg'], ['msg', 'cust'], ['booking', 'clean'], ['clean', 'hotel'], ['rules', 'msg'], ['rules', 'hotel']],
  hot: [['cust', 'booking'], ['booking', 'code'], ['code', 'msg'], ['msg', 'cust'], ['booking', 'clean']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'Everywhere a booking or a guest question can reach you. Each one lands on the model.', de: 'Überall, wo eine Buchung oder eine Gästefrage dich erreicht. Jede landet im Modell.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie er denkt' }, info: { en: 'Your rules, set once. The AI reads and writes; your rules decide what it may say and do.', de: 'Deine Regeln, einmal festgelegt. Die KI liest und schreibt; deine Regeln bestimmen, was sie sagen und tun darf.' } },
    actions: { title: { en: 'What it does', de: 'Was er tut' }, info: { en: 'It works in the tools your hotel already uses. Nothing new to learn.', de: 'Er arbeitet in den Tools, die dein Hotel schon nutzt. Nichts Neues zu lernen.' } }
  },
  data: [
    { logo: 'booking', t: 'Booking.com', sub: { en: 'new bookings', de: 'neue Buchungen' }, info: { en: 'A booking arrives as a mail from the portal. The agent reads guest, room and dates from it.', de: 'Eine Buchung kommt als Mail vom Portal. Der Agent liest Gast, Zimmer und Daten daraus.' } },
    { logo: 'gmail', t: { en: 'Email', de: 'E-Mail' }, sub: { en: 'bookings, questions', de: 'Buchungen, Fragen' }, info: { en: 'Bookings and guest questions that come by mail are read the same way.', de: 'Buchungen und Gästefragen per Mail werden genauso gelesen.' } },
    { logo: 'whatsapp', t: 'WhatsApp', sub: { en: 'guest messages', de: 'Gästenachrichten' }, info: { en: 'Guests write here, for example when the door code does not work. The agent answers right away.', de: 'Hier schreiben die Gäste, zum Beispiel wenn der Türcode nicht geht. Der Agent antwortet sofort.' } },
    { logo: 'web', t: { en: 'Your website', de: 'Deine Webseite' }, sub: { en: 'direct bookings', de: 'Direktbuchungen' }, info: { en: 'Guests can book directly. AI assistants can read rooms and prices from your page, and the booking is confirmed by mail.', de: 'Gäste können direkt buchen. KI-Assistenten lesen Zimmer und Preise von deiner Seite, die Buchung wird per Mail bestätigt.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Reads & answers', de: 'Liest & antwortet' }, sub: { en: 'AI, in plain words', de: 'KI, in klaren Worten' }, info: { en: 'An AI reads each mail or message, pulls out the facts and writes the answer. Every fact points back to the message.', de: 'Eine KI liest jede Mail und Nachricht, zieht die Fakten raus und schreibt die Antwort. Jeder Fakt zeigt auf die Nachricht.' } },
    { logo: 'rule', t: { en: 'House rules', de: 'Hausregeln' }, sub: { en: 'check-in, Wi-Fi, quiet', de: 'Check-in, WLAN, Ruhe' }, info: { en: 'Your rules in plain text. The agent answers only from them, so it never promises something you do not offer.', de: 'Deine Regeln als Text. Der Agent antwortet nur daraus, damit er nie etwas verspricht, das du nicht anbietest.' } },
    { logo: 'lock', t: { en: 'Door codes', de: 'Türcodes' }, sub: { en: 'only for the stay', de: 'nur für den Aufenthalt' }, info: { en: 'A code works only from check-in to check-out of that booking. A faulty code is replaced for the whole stay.', de: 'Ein Code gilt nur vom Check-in bis zum Check-out dieser Buchung. Ein defekter Code wird für den ganzen Aufenthalt ersetzt.' } },
    { logo: 'voice', t: { en: 'Guest’s language', de: 'Sprache des Gastes' }, sub: { en: 'DE, IT, EN', de: 'DE, IT, EN' }, info: { en: 'Asked in Italian, answered in Italian. German, Italian and English are covered.', de: 'Auf Italienisch gefragt, auf Italienisch geantwortet. Deutsch, Italienisch und Englisch sind abgedeckt.' } }
  ],
  actions: [
    { logo: 'gcal', t: { en: 'Booking system', de: 'Buchungssystem' }, sub: { en: 'enters the booking', de: 'trägt die Buchung ein' }, info: { en: 'Enters the booking in your calendar with room, dates and guest, so nothing is double booked.', de: 'Trägt die Buchung mit Zimmer, Daten und Gast in deinen Kalender ein, damit nichts doppelt vergeben wird.' } },
    { logo: 'whatsapp', t: 'WhatsApp', sub: { en: 'writes to the guest', de: 'schreibt dem Gast' }, info: { en: 'Sends the check-in message with the door code and answers the guest’s questions.', de: 'Schickt die Check-in-Nachricht mit Türcode und beantwortet die Fragen des Gastes.' } },
    { logo: 'sheets', t: { en: 'Cleaning plan', de: 'Reinigungsplan' }, sub: { en: 'new task for the team', de: 'neue Aufgabe fürs Team' }, info: { en: 'Adds the clean-up for the departure day to the plan your cleaning team already uses.', de: 'Trägt die Reinigung für den Abreisetag in den Plan ein, den dein Reinigungsteam schon nutzt.' } },
    { logo: 'gmail', t: { en: 'Confirmation', de: 'Bestätigung' }, sub: { en: 'by mail', de: 'per Mail' }, info: { en: 'Direct bookings from your website get a confirmation by mail.', de: 'Direktbuchungen von deiner Webseite bekommen eine Bestätigung per Mail.' } }
  ],
  run: {
    title: { en: 'New booking', de: 'Neue Buchung' }, total: '09:15', to: 'booking',
    info: { en: 'Every step with its time: booking read, entered, door code made, guest written to, cleaning planned. All within about a minute.', de: 'Jeder Schritt mit Zeit: Buchung gelesen, eingetragen, Türcode erzeugt, Gast angeschrieben, Reinigung geplant. Alles in etwa einer Minute.' },
    rows: [
      [{ en: 'Booking read: room 202', de: 'Buchung gelesen: Zimmer 202' }, '09:14', 'booking'],
      [{ en: 'Entered in booking system', de: 'Im Buchungssystem eingetragen' }, '09:14', 'booking'],
      [{ en: 'Door code 4827 made', de: 'Türcode 4827 erzeugt' }, '09:15', 'code'],
      [{ en: 'Check-in message on WhatsApp', de: 'Check-in-Nachricht per WhatsApp' }, '09:15', 'msg'],
      [{ en: 'Cleaning planned for Mon 7 Dec', de: 'Reinigung für Mo 7.12. geplant' }, '09:15', 'clean']
    ]
  },
  phone: {
    to: 'cust', time: '09:15', date: { en: 'Hotel am See · demo', de: 'Hotel am See · Demo' },
    title: { en: 'You', de: 'Du' }, info: { en: 'You and your team see on the phone what the agent did. Nobody has to sit at the front desk or remember the cleaning.', de: 'Du und dein Team seht auf dem Handy, was der Agent getan hat. Niemand muss am Empfang sitzen oder an die Reinigung denken.' },
    notes: [
      { logo: 'whatsapp', app: { en: 'WhatsApp · now', de: 'WhatsApp · jetzt' }, t: { en: 'Check-in sent', de: 'Check-in raus' }, p: { en: 'Jan Brenner, 4 to 7 Dec.\nDoor code 4827.', de: 'Jan Brenner, 4. bis 7.12.\nTürcode 4827.' } },
      { logo: 'sheets', app: { en: 'Cleaning plan', de: 'Reinigungsplan' }, t: { en: 'New task, Mon 7 Dec', de: 'Neue Aufgabe, Mo 7.12.' }, p: { en: 'Room 202, 11:00', de: 'Zimmer 202, 11:00' } }
    ]
  }
};
