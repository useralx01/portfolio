/* Scene: Lead to CRM (the reference scene for assets/model.js).
   objects: k = key, name/sub = pill, c = pill + link point on the plane (12 x 7.4), pz = pill height,
   parts = [kind, x, y, options] drawn from model.js K, lit = glows when the automation runs, info = click text.
   data / logic / actions: 4 tiles each, logo = model.js LOGO key. Texts are {en, de}. */
(window.MODELS = window.MODELS || {})['lead-automation'] = {
  aria: { en: 'Model of the lead automation: the business, what comes in, how it thinks, what it does', de: 'Modell der Lead-Automatisierung: der Betrieb, was reinkommt, wie es denkt, was es tut' },
  steps: [
    { t: { en: 'Your business, as a model', de: 'Dein Betrieb als Modell' }, p: { en: 'First it learns your business: customers, enquiries, deals and appointments, and how they connect.', de: 'Zuerst lernt es deinen Betrieb: Kunden, Anfragen, Deals und Termine, und wie sie zusammenhängen.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'Your website form, your inbox, WhatsApp, calls. Every new message lands on the model as an enquiry.', de: 'Dein Kontaktformular, dein Postfach, WhatsApp, Anrufe. Jede neue Nachricht landet als Anfrage im Modell.' } },
    { t: { en: 'How it thinks', de: 'Wie es denkt' }, p: { en: 'Your rules: what makes a good lead, what you offer and for how much, how you sound.', de: 'Deine Regeln: was ein guter Lead ist, was du anbietest und zu welchem Preis, wie du klingst.' } },
    { t: { en: 'What it can do', de: 'Was es tun kann' }, p: { en: 'It writes into the tools you already use: HubSpot, Gmail, your calendar, WhatsApp.', de: 'Es arbeitet in den Tools, die du schon nutzt: HubSpot, Gmail, dein Kalender, WhatsApp.' } },
    { t: { en: 'The automation runs', de: 'Die Automatisierung läuft' }, p: { en: 'A new enquiry: read, scored 82, in your CRM, answered with your booking link. 27 seconds.', de: 'Eine neue Anfrage: gelesen, mit 82 bewertet, im CRM, beantwortet mit deinem Buchungslink. 27 Sekunden.' } },
    { t: { en: 'You make the call', de: 'Du rufst an' }, p: { en: 'You get one message on your phone. It only does what your rules allow.', de: 'Du bekommst eine Nachricht aufs Handy. Es tut nur, was deine Regeln erlauben.' } }
  ],
  plane: { title: { en: 'Your business as a model', de: 'Dein Betrieb als Modell' }, info: { en: 'Everything it knows, linked: who the customer is, what they asked, the deal, the reply, the appointment. That is why the AI can act sensibly: it sees the whole picture, not one email.', de: 'Alles, was es weiß, verknüpft: wer der Kunde ist, was er gefragt hat, der Deal, die Antwort, der Termin. Deshalb handelt die KI sinnvoll: Sie sieht das ganze Bild, nicht eine einzelne Mail.' } },
  objects: [
    { k: 'studio', name: { en: 'Your studio', de: 'Dein Studio' }, c: [1.6, 1.4], pz: 2.1, parts: [['building', .5, .5, { w: 2.2, d: 1.6, h: 1.5 }]],
      info: { en: 'You, the business. Everything the automation does happens in your name and follows your rules.', de: 'Du, der Betrieb. Alles, was die Automatisierung tut, passiert in deinem Namen und nach deinen Regeln.' } },
    { k: 'cust', lit: 1, name: { en: 'Customer', de: 'Kunde' }, sub: 'Jonas W.', title: { en: 'Customer · Jonas W.', de: 'Kunde · Jonas W.' }, c: [9.8, 1.3], pz: 1.9, parts: [['person', 9.6, 1.1, { big: 1 }], ['person', 10.5, 1.6, {}]],
      info: { en: 'The person who wants something from you. The enquiry, the deal, the reply and the appointment all link to him, so nothing gets lost.', de: 'Die Person, die etwas von dir will. Anfrage, Deal, Antwort und Termin hängen alle an ihm, so geht nichts verloren.' } },
    { k: 'enq', lit: 1, name: { en: 'Enquiry', de: 'Anfrage' }, sub: { en: 'new website · 5,000 €', de: 'neue Website · 5.000 €' }, c: [6.1, 1.3], pz: .6, parts: [['doc', 5.4, .5, { stack: 1, button: 1 }], ['envelope', 6.3, 1.5, {}]],
      info: { en: 'What came in: “We need a new website, budget 5,000 EUR, by March.” The AI turns this into facts: what, budget, deadline, trade.', de: 'Was reinkam: „Wir brauchen eine neue Website, Budget 5.000 EUR, bis März.“ Die KI macht daraus Fakten: was, Budget, Frist, Branche.' } },
    { k: 'deal', lit: 1, name: 'Deal', sub: { en: 'score 82 · hot', de: 'Score 82 · heiß' }, title: { en: 'Deal · score 82', de: 'Deal · Score 82' }, c: [2.1, 5.2], pz: .75, parts: [['deal', 1.3, 4.4], ['coins', 2.9, 5.6]],
      info: { en: 'The enquiry as a deal in your pipeline, scored 0 to 100. 82 means hot: real budget, a close deadline, work you do.', de: 'Die Anfrage als Deal in deiner Pipeline, bewertet von 0 bis 100. 82 heißt heiß: echtes Budget, nahe Frist, Arbeit, die du machst.' } },
    { k: 'reply', lit: 1, name: { en: 'Reply', de: 'Antwort' }, sub: { en: 'in your tone', de: 'in deinem Ton' }, c: [5.6, 5.2], pz: .7, parts: [['envelope', 4.9, 4.7, { stack: 2 }]],
      info: { en: 'A personal answer in your tone: thanks, three short questions and your booking link. Sent 21 seconds after the enquiry.', de: 'Eine persönliche Antwort in deinem Ton: Danke, drei kurze Fragen und dein Buchungslink. Raus 21 Sekunden nach der Anfrage.' } },
    { k: 'appt', lit: 1, name: { en: 'Appointment', de: 'Termin' }, sub: { en: 'Tue 10:30', de: 'Di 10:30' }, c: [9.6, 5.6], pz: 1.45, parts: [['calendar', 9, 5.4]],
      info: { en: 'The customer picked a slot with your booking link: Tuesday 10:30, 15 minutes. It is already in your calendar.', de: 'Der Kunde hat über deinen Buchungslink einen Termin gewählt: Dienstag 10:30, 15 Minuten. Er steht schon in deinem Kalender.' } }
  ],
  links: [['cust', 'enq'], ['enq', 'deal'], ['deal', 'studio'], ['enq', 'reply'], ['reply', 'cust'], ['appt', 'cust'], ['appt', 'studio'], ['studio', 'enq']],
  hot: [['cust', 'enq'], ['enq', 'deal'], ['enq', 'reply'], ['reply', 'cust'], ['appt', 'cust']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'Everywhere a customer can reach you. Each new message becomes an enquiry on the model.', de: 'Überall, wo dich ein Kunde erreicht. Jede neue Nachricht wird eine Anfrage im Modell.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie es denkt' }, info: { en: 'Your rules, set once. The AI reads and scores; your rules decide what counts.', de: 'Deine Regeln, einmal festgelegt. Die KI liest und bewertet; deine Regeln entscheiden, was zählt.' } },
    actions: { title: { en: 'What it does', de: 'Was es tut' }, info: { en: 'It works inside the tools you already use. Nothing new to learn.', de: 'Es arbeitet in den Tools, die du schon nutzt. Nichts Neues zu lernen.' } }
  },
  data: [
    { logo: 'web', t: { en: 'Website form', de: 'Kontaktformular' }, sub: { en: 'on your site', de: 'auf deiner Seite' }, info: { en: 'The contact form on your site. When someone presses send, the automation starts.', de: 'Das Kontaktformular auf deiner Seite. Sobald jemand auf Senden drückt, startet die Automatisierung.' } },
    { logo: 'gmail', t: 'Gmail', sub: { en: 'your inbox', de: 'dein Postfach' }, info: { en: 'Enquiries that arrive by email are read the same way as the form.', de: 'Anfragen per Mail werden genauso gelesen wie das Formular.' } },
    { logo: 'whatsapp', t: 'WhatsApp', sub: { en: 'messages', de: 'Nachrichten' }, info: { en: 'Customer messages on WhatsApp come in too.', de: 'Auch Kundennachrichten auf WhatsApp kommen hier rein.' } },
    { logo: 'call', t: { en: 'Calls', de: 'Anrufe' }, sub: { en: 'voicemail as text', de: 'Mailbox als Text' }, info: { en: 'Voicemails are turned into text and handled like any other enquiry.', de: 'Mailbox-Nachrichten werden zu Text und wie jede andere Anfrage behandelt.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Reads & scores', de: 'Liest & bewertet' }, sub: { en: 'AI, 0 to 100', de: 'KI, 0 bis 100' }, info: { en: 'An AI reads the message, pulls out the facts and scores it 0 to 100. Every fact points back to words in the message.', de: 'Eine KI liest die Nachricht, zieht die Fakten raus und bewertet sie von 0 bis 100. Jeder Fakt zeigt auf Worte in der Nachricht.' } },
    { logo: 'rule', t: { en: 'Good lead =', de: 'Guter Lead =' }, sub: { en: 'budget, date, fit', de: 'Budget, Datum, passt' }, title: { en: 'What a good lead is', de: 'Was ein guter Lead ist' }, info: { en: 'Your rules: enough budget, a real date, work you actually do.', de: 'Deine Regeln: genug Budget, ein echtes Datum, Arbeit, die du wirklich machst.' } },
    { logo: 'euro', t: { en: 'Your prices', de: 'Deine Preise' }, sub: { en: 'what you offer', de: 'was du anbietest' }, info: { en: 'What you offer and for how much, so a reply never promises something you do not sell.', de: 'Was du anbietest und zu welchem Preis, damit eine Antwort nie etwas verspricht, das du nicht verkaufst.' } },
    { logo: 'voice', t: { en: 'Your tone', de: 'Dein Ton' }, sub: { en: 'how you write', de: 'wie du schreibst' }, info: { en: 'Examples of how you write, so the reply sounds like you.', de: 'Beispiele, wie du schreibst, damit die Antwort nach dir klingt.' } }
  ],
  actions: [
    { logo: 'hubspot', t: 'HubSpot', sub: { en: 'creates the deal', de: 'legt den Deal an' }, info: { en: 'Creates the deal with every fact filled in.', de: 'Legt den Deal an, alle Fakten ausgefüllt.' } },
    { logo: 'gmail', t: 'Gmail', sub: { en: 'sends the reply', de: 'schickt die Antwort' }, info: { en: 'Sends the reply from your own address.', de: 'Schickt die Antwort von deiner eigenen Adresse.' } },
    { logo: 'gcal', t: { en: 'Calendar', de: 'Kalender' }, sub: { en: 'booking link', de: 'Buchungslink' }, info: { en: 'Puts your booking link in the reply. When the customer books, the slot is in your calendar.', de: 'Setzt deinen Buchungslink in die Antwort. Bucht der Kunde, steht der Termin in deinem Kalender.' } },
    { logo: 'whatsapp', t: 'WhatsApp', sub: { en: 'tells you', de: 'sagt dir Bescheid' }, info: { en: 'One short message to you: hot lead, score 82, what they want.', de: 'Eine kurze Nachricht an dich: heißer Lead, Score 82, was er will.' } }
  ],
  run: {
    title: { en: 'Lead to CRM', de: 'Lead ins CRM' }, total: '00:27', to: 'enq',
    info: { en: 'Every step with its time: received, scored, in the CRM, answered, you told. 27 seconds in total.', de: 'Jeder Schritt mit Zeit: angekommen, bewertet, im CRM, beantwortet, du informiert. 27 Sekunden insgesamt.' },
    rows: [
      [{ en: 'Enquiry received', de: 'Anfrage angekommen' }, '00:01', 'enq'],
      [{ en: 'Read and scored: 82, hot', de: 'Gelesen und bewertet: 82, heiß' }, '00:04', 'enq'],
      [{ en: 'Deal created in HubSpot', de: 'Deal in HubSpot angelegt' }, '00:09', 'deal'],
      [{ en: 'Personal reply sent', de: 'Persönliche Antwort raus' }, '00:21', 'reply'],
      [{ en: 'You got a WhatsApp', de: 'Du hast eine WhatsApp' }, '00:27', 'you']
    ]
  },
  phone: {
    to: 'cust', time: '09:42', date: { en: 'Monday, 23 November', de: 'Montag, 23. November' },
    title: { en: 'You', de: 'Du' }, info: { en: 'One message on your phone. You decide when to call. Nothing else needs you.', de: 'Eine Nachricht auf dein Handy. Du entscheidest, wann du anrufst. Sonst braucht es dich nicht.' },
    notes: [
      { logo: 'whatsapp', app: { en: 'WhatsApp · now', de: 'WhatsApp · jetzt' }, t: { en: 'Hot lead · score 82', de: 'Heißer Lead · Score 82' }, p: { en: 'Wehrmeister Gartenpflege,\n5,000 €, by March. In CRM.', de: 'Wehrmeister Gartenpflege,\n5.000 €, bis März. Im CRM.' } },
      { logo: 'gcal', app: { en: 'Calendar', de: 'Kalender' }, t: { en: 'Call, Tue 10:30', de: 'Anruf, Di 10:30' }, p: { en: 'booked by the customer', de: 'vom Kunden gebucht' } }
    ]
  }
};
