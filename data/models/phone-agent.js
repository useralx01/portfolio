/* Scene: Phone agent (after-hours call at a heating and plumbing firm). Facts from film-phone-agent. */
(window.MODELS = window.MODELS || {})['phone-agent'] = {
  aria: { en: 'Model of the phone agent: the business, what comes in, how it thinks, what it does', de: 'Modell des Telefon-Agenten: der Betrieb, was reinkommt, wie es denkt, was es tut' },
  steps: [
    { t: { en: 'Your business, as a model', de: 'Dein Betrieb als Modell' }, p: { en: 'First it learns your business: the caller, the call, the emergency check, the job card and the job book, and how they connect.', de: 'Zuerst lernt es deinen Betrieb: Anrufer, Anruf, Notfall-Prüfung, Auftragskarte und Auftragsbuch, und wie sie zusammenhängen.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'A call after hours, on your phone line. The voice is heard live and written down as text.', de: 'Ein Anruf nach Feierabend, auf deiner Telefonleitung. Die Stimme wird live gehört und als Text mitgeschrieben.' } },
    { t: { en: 'How it thinks', de: 'Wie es denkt' }, p: { en: 'Your rules: what it must ask, what counts as an emergency, and that it always says it is an AI.', de: 'Deine Regeln: was es fragen muss, was ein Notfall ist, und dass es immer sagt, dass es eine KI ist.' } },
    { t: { en: 'What it can do', de: 'Was es tun kann' }, p: { en: 'It writes the job into your job book, marks it urgent and texts you the summary.', de: 'Es schreibt den Auftrag in dein Auftragsbuch, markiert ihn als dringend und schickt dir die Zusammenfassung per SMS.' } },
    { t: { en: 'The automation runs', de: 'Die Automatisierung läuft' }, p: { en: 'Sunday 21:47: it picks up, asks, checks for an emergency and creates job A-2611. Nobody in the office types anything.', de: 'Sonntag 21:47: Es nimmt ab, fragt, prüft auf Notfall und legt Auftrag A-2611 an. Im Büro tippt niemand etwas.' } },
    { t: { en: 'You make the call', de: 'Du rufst an' }, p: { en: 'You get one text with everything you need. You call back. It only does what your rules allow.', de: 'Du bekommst eine SMS mit allem, was du brauchst. Du rufst zurück. Es tut nur, was deine Regeln erlauben.' } }
  ],
  plane: { title: { en: 'Your business as a model', de: 'Dein Betrieb als Modell' }, info: { en: 'Everything it knows, linked: who called, what they said, whether it is an emergency, the job card, the job book. That is why the AI can act sensibly: it sees the whole picture, not one call.', de: 'Alles, was es weiß, verknüpft: wer angerufen hat, was er gesagt hat, ob es ein Notfall ist, die Auftragskarte, das Auftragsbuch. Deshalb handelt die KI sinnvoll: Sie sieht das ganze Bild, nicht nur einen Anruf.' } },
  objects: [
    { k: 'firm', name: { en: 'Your firm', de: 'Dein Betrieb' }, sub: 'Altmann & Brenner', title: { en: 'Your firm · Altmann & Brenner Haustechnik', de: 'Dein Betrieb · Altmann & Brenner Haustechnik' }, c: [1.6, 1.4], pz: 2.1, parts: [['building', .5, .5, { w: 2.2, d: 1.6, h: 1.5 }]],
      info: { en: 'You, the heating and plumbing firm. The office is closed on Sunday evening, but the phone line is not. Everything happens in your name and follows your rules.', de: 'Du, der Haustechnik-Betrieb. Sonntagabend ist das Büro zu, die Telefonleitung nicht. Alles passiert in deinem Namen und nach deinen Regeln.' } },
    { k: 'caller', lit: 1, name: { en: 'Caller', de: 'Anruferin' }, sub: 'Petra Voigt', title: { en: 'Caller · Petra Voigt', de: 'Anruferin · Petra Voigt' }, c: [9.8, 1.3], pz: 1.9, parts: [['person', 9.6, 1.1, { big: 1 }], ['person', 10.5, 1.6, {}]],
      info: { en: 'Petra Voigt from Sindelfingen. Her heating is out, there is a small child at home and it is 3 degrees outside. The call, the job and the text all link to her.', de: 'Petra Voigt aus Sindelfingen. Ihre Heizung ist ausgefallen, ein Kleinkind ist im Haus und draußen sind 3 Grad. Anruf, Auftrag und SMS hängen alle an ihr.' } },
    { k: 'call', lit: 1, name: { en: 'Call', de: 'Anruf' }, sub: { en: 'Sun 21:47 · live', de: 'So 21:47 · live' }, c: [5.0, 1.2], pz: 1.5, parts: [['phone', 4.4, .5], ['chat', 5.6, 1.2]],
      info: { en: 'The incoming call, picked up by the AI, which says at once that it is an AI. It asks for the problem, name, address and call-back number, and writes the talk down live.', de: 'Der eingehende Anruf, den die KI annimmt. Sie sagt gleich, dass sie eine KI ist. Sie fragt nach Anliegen, Name, Adresse und Rückrufnummer und schreibt das Gespräch live mit.' } },
    { k: 'check', lit: 1, name: { en: 'Emergency check', de: 'Notfall-Prüfung' }, title: { en: 'Emergency check · urgent', de: 'Notfall-Prüfung · dringend' }, c: [9.5, 3.3], pz: .9, parts: [['doc', 8.3, 2.6, { button: 1 }], ['tag', 9.8, 3.4]],
      info: { en: 'Three questions: gas smell? water leaking? anyone at risk? Here: no gas, no water, but a small child and 3 degrees outside. So it is marked urgent.', de: 'Drei Fragen: Gasgeruch? Wasser tritt aus? Jemand gefährdet? Hier: kein Gas, kein Wasser, aber ein Kleinkind und 3 Grad draußen. Also dringend.' } },
    { k: 'job', lit: 1, name: { en: 'Job card', de: 'Auftragskarte' }, sub: { en: 'A-2611 · urgent', de: 'A-2611 · dringend' }, title: { en: 'Job card · A-2611', de: 'Auftragskarte · A-2611' }, c: [5.4, 5.8], pz: .7, parts: [['doc', 4.7, 5.0, { stack: 1, stamp: 1 }]],
      info: { en: 'Job A-2611: heating out, Petra Voigt, Eichenstraße 23, call back 0160 5550 2381, marked URGENT. Everything the technician needs, filled in.', de: 'Auftrag A-2611: Heizung ausgefallen, Petra Voigt, Eichenstraße 23, Rückruf 0160 5550 2381, als DRINGEND markiert. Alles, was der Techniker braucht, ausgefüllt.' } },
    { k: 'book', lit: 1, name: { en: 'Job book', de: 'Auftragsbuch' }, sub: { en: 'new, call-back open', de: 'neu, Rückruf offen' }, c: [1.6, 5.1], pz: .75, parts: [['sheet', .5, 4.4, { w: 2.2, d: 1.7, mark: 1 }]],
      info: { en: 'Your list of all jobs. The new row A-2611 sits at the bottom with status “New, call-back open”. The older jobs are done or in progress.', de: 'Deine Liste aller Aufträge. Die neue Zeile A-2611 steht ganz unten mit Status „Neu, Rückruf offen“. Die älteren Aufträge sind erledigt oder in Arbeit.' } },
    { k: 'sms', lit: 1, name: { en: 'Text to you', de: 'SMS an dich' }, c: [7.9, 5.6], pz: 1.7, parts: [['phone', 7.3, 4.8], ['envelope', 8.3, 5.4, {}]],
      info: { en: 'One short text to the owner: urgent, heating out, name, address, call-back number, no gas, no water, small child. And that job A-2611 is in the book.', de: 'Eine kurze SMS an den Inhaber: dringend, Heizung ausgefallen, Name, Adresse, Rückrufnummer, kein Gas, kein Wasser, Kleinkind. Und dass Auftrag A-2611 im Buch liegt.' } }
  ],
  links: [['caller', 'call'], ['call', 'firm'], ['call', 'check'], ['check', 'job'], ['job', 'book'], ['book', 'firm'], ['job', 'sms'], ['sms', 'firm'], ['caller', 'sms']],
  hot: [['caller', 'call'], ['call', 'check'], ['check', 'job'], ['job', 'book'], ['job', 'sms']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'The call on your phone line after hours. The voice is heard live and written down as text.', de: 'Der Anruf auf deiner Telefonleitung nach Feierabend. Die Stimme wird live gehört und als Text mitgeschrieben.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie es denkt' }, info: { en: 'Your rules, set once: what to ask, what counts as an emergency, and that it says it is an AI.', de: 'Deine Regeln, einmal festgelegt: was gefragt wird, was ein Notfall ist, und dass es sagt, dass es eine KI ist.' } },
    actions: { title: { en: 'What it does', de: 'Was es tut' }, info: { en: 'It fills your job book and texts you. Nothing new to learn.', de: 'Es füllt dein Auftragsbuch und schickt dir eine SMS. Nichts Neues zu lernen.' } }
  },
  data: [
    { logo: 'call', t: { en: 'Incoming call', de: 'Eingehender Anruf' }, sub: { en: 'after hours', de: 'nach Feierabend' }, info: { en: 'A customer calls your number in the evening or on a weekend. The AI picks up.', de: 'Ein Kunde ruft abends oder am Wochenende auf deiner Nummer an. Die KI nimmt ab.' } },
    { logo: 'link', t: { en: 'Night mode', de: 'Nachtschaltung' }, sub: { en: 'office closed', de: 'Büro zu' }, info: { en: 'Your phone system passes calls on to the AI when nobody is in the office.', de: 'Deine Telefonanlage leitet Anrufe an die KI weiter, wenn niemand im Büro ist.' } },
    { logo: 'voice', t: { en: 'Live voice', de: 'Stimme live' }, sub: { en: 'heard as it is said', de: 'wird mitgehört' }, info: { en: 'The AI listens while the caller talks and answers in real time.', de: 'Die KI hört zu, während der Anrufer spricht, und antwortet sofort.' } },
    { logo: 'doc', t: { en: 'Transcript', de: 'Gespräch als Text' }, sub: { en: 'written live', de: 'live mitgeschrieben' }, info: { en: 'The whole call is written down, so you can read what was really said.', de: 'Das ganze Gespräch wird mitgeschrieben, so kannst du nachlesen, was wirklich gesagt wurde.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Asks and notes', de: 'Fragt und notiert' }, sub: { en: 'AI on the phone', de: 'KI am Telefon' }, info: { en: 'The AI asks for the problem, name, address and call-back number, and fills the fields while the caller talks.', de: 'Die KI fragt nach Anliegen, Name, Adresse und Rückrufnummer und füllt die Felder, während der Anrufer spricht.' } },
    { logo: 'rule', t: { en: 'Emergency?', de: 'Notfall?' }, sub: { en: 'gas, water, risk', de: 'Gas, Wasser, Risiko' }, title: { en: 'Emergency rules', de: 'Notfall-Regeln' }, info: { en: 'Your rules: gas smell, water leaking, a child or a cold house. They decide what is urgent.', de: 'Deine Regeln: Gasgeruch, auslaufendes Wasser, ein Kind oder ein kaltes Haus. Sie entscheiden, was dringend ist.' } },
    { logo: 'voice', t: { en: 'Says it is an AI', de: 'Sagt: ich bin KI' }, sub: { en: 'every call', de: 'bei jedem Anruf' }, info: { en: 'The first sentence of every call says that it is an AI. Nobody is tricked.', de: 'Der erste Satz jedes Anrufs sagt, dass es eine KI ist. Niemand wird getäuscht.' } },
    { logo: 'check', t: { en: 'Must-have fields', de: 'Pflichtfelder' }, sub: { en: 'problem, name, place', de: 'Anliegen, Name, Ort' }, info: { en: 'The job is only created when the problem, name, address and call-back number are there.', de: 'Der Auftrag wird erst angelegt, wenn Anliegen, Name, Adresse und Rückrufnummer da sind.' } }
  ],
  actions: [
    { logo: 'sheets', t: { en: 'Job book', de: 'Auftragsbuch' }, sub: { en: 'creates A-2611', de: 'legt A-2611 an' }, info: { en: 'Adds a new row with all facts and the status “New, call-back open”.', de: 'Legt eine neue Zeile mit allen Fakten an, Status „Neu, Rückruf offen“.' } },
    { logo: 'rule', t: { en: 'Marks urgent', de: 'Markiert dringend' }, sub: { en: 'priority', de: 'Priorität' }, info: { en: 'Sets the priority to urgent, so the job stands out in the book.', de: 'Setzt die Priorität auf dringend, damit der Auftrag im Buch auffällt.' } },
    { logo: 'call', t: { en: 'Text to you', de: 'SMS an dich' }, sub: { en: 'the summary', de: 'die Zusammenfassung' }, info: { en: 'One short text with the summary goes to your mobile phone.', de: 'Eine kurze SMS mit der Zusammenfassung geht auf dein Handy.' } },
    { logo: 'check', t: { en: 'Promises a call', de: 'Sagt Rückruf zu' }, sub: { en: 'still today', de: 'noch heute' }, info: { en: 'Tells the caller she will get a call back today.', de: 'Sagt der Anruferin, dass sie heute noch angerufen wird.' } }
  ],
  run: {
    title: { en: 'Call to job card', de: 'Anruf zum Auftrag' }, total: '21:49', to: 'call',
    info: { en: 'Every step with its time, Sunday evening: picked up, noted, checked, job created, you told. Nobody in the office typed anything.', de: 'Jeder Schritt mit Zeit, Sonntagabend: angenommen, notiert, geprüft, Auftrag angelegt, du informiert. Im Büro hat niemand etwas getippt.' },
    rows: [
      [{ en: 'Call picked up, says it is an AI', de: 'Anruf angenommen, sagt: KI' }, '21:47', 'call'],
      [{ en: 'Problem, name, address, number', de: 'Anliegen, Name, Adresse, Nummer' }, '21:48', 'call'],
      [{ en: 'Emergency check: urgent', de: 'Notfall-Prüfung: dringend' }, '21:48', 'check'],
      [{ en: 'Job A-2611 in the job book', de: 'Auftrag A-2611 im Auftragsbuch' }, '21:49', 'job'],
      [{ en: 'You got a text', de: 'Du hast eine SMS' }, '21:49', 'you']
    ]
  },
  phone: {
    to: 'sms', time: '21:49', date: { en: 'Sunday, 22 November', de: 'Sonntag, 22. November' },
    title: { en: 'You', de: 'Du' }, info: { en: 'One text on your phone. You decide when to call back. Nothing else needs you.', de: 'Eine SMS auf dein Handy. Du entscheidest, wann du zurückrufst. Sonst braucht es dich nicht.' },
    notes: [
      { logo: 'call', app: { en: 'Messages · now', de: 'Nachrichten · jetzt' }, t: { en: 'URGENT · heating', de: 'DRINGEND · Heizung' }, p: { en: 'Petra Voigt, Eichenstr. 23.\nCall back 0160 5550 2381.', de: 'Petra Voigt, Eichenstr. 23.\nRückruf 0160 5550 2381.' } },
      { logo: 'sheets', app: { en: 'Job book', de: 'Auftragsbuch' }, t: { en: 'A-2611 is in the book', de: 'A-2611 liegt im Buch' }, p: { en: 'no gas, no water', de: 'kein Gas, kein Wasser' } }
    ]
  }
};
