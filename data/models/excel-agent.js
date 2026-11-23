/* Scene: Excel agent (staffing). Facts from work-cats\excel\film\index.html (Haus Lindenhof, 28.11.2026 Fruehdienst 07:00-13:30, Jana Brandt, Nora Vellmer, Mira Lenhart, Timo Hessler). Film has no clock, so run times are step numbers. */
(window.MODELS = window.MODELS || {})['excel-agent'] = {
  aria: { en: 'Model of the Excel agent: the staffing company, what comes in, how it thinks, what it does', de: 'Modell des Excel-Agenten: die Personalfirma, was reinkommt, wie er denkt, was er tut' },
  steps: [
    { t: { en: 'Your company, as a model', de: 'Deine Firma als Modell' }, p: { en: 'First it learns your planning: houses, shifts, staff, your Excel workbook, and how they connect.', de: 'Zuerst lernt er deine Planung: Häuser, Dienste, Personal, deine Excel-Mappe, und wie sie zusammenhängen.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'Mails from the houses, lists of shifts, and short chat messages from your staff: yes, no, sick.', de: 'Mails von den Häusern, Listen mit Diensten und kurze Chat-Nachrichten von deinem Personal: ja, nein, krank.' } },
    { t: { en: 'How it thinks', de: 'Wie er denkt' }, p: { en: 'Your rules: who fits a shift, who is blocked, the first yes gets it.', de: 'Deine Regeln: wer zu einem Dienst passt, wer gesperrt ist, das erste Ja bekommt ihn.' } },
    { t: { en: 'What it can do', de: 'Was er tun kann' }, p: { en: 'It writes into your own workbook, asks staff in the chat, makes the plan PDF for the house and answers questions.', de: 'Er schreibt in deine eigene Mappe, fragt das Personal im Chat, macht das Plan-PDF fürs Haus und beantwortet Fragen.' } },
    { t: { en: 'The agent runs', de: 'Der Agent läuft' }, p: { en: 'A mail for an open shift: entered, offered to four people, one says yes, booked and confirmed. Then a sick note, and a replacement.', de: 'Eine Mail mit einem offenen Dienst: eingetragen, vier Leuten angeboten, eine sagt Ja, gebucht und bestätigt. Dann eine Krankmeldung und ein Ersatz.' } },
    { t: { en: 'You stay in charge', de: 'Du behältst die Kontrolle' }, p: { en: 'You see the result in your usual workbook. The agent only does what your rules allow.', de: 'Du siehst das Ergebnis in deiner gewohnten Mappe. Der Agent tut nur, was deine Regeln erlauben.' } }
  ],
  plane: { title: { en: 'Your planning as a model', de: 'Deine Planung als Modell' }, info: { en: 'Everything it knows, linked: the house, its request, the open shift, the staff, your workbook, the plan for the house. So the agent plans with the whole picture.', de: 'Alles, was er weiß, verknüpft: das Haus, seine Anfrage, der offene Dienst, das Personal, deine Mappe, der Plan fürs Haus. So plant der Agent mit dem ganzen Bild.' } },
  objects: [
    { k: 'agency', name: { en: 'Your company', de: 'Deine Firma' }, c: [1.6, 1.4], pz: 2.1, parts: [['building', .5, .5, { w: 2.2, d: 1.6, h: 1.5 }]],
      info: { en: 'You, the staffing company. Everything the agent does happens in your name, in your workbook, and follows your rules.', de: 'Du, die Personalfirma. Alles, was der Agent tut, passiert in deinem Namen, in deiner Mappe und nach deinen Regeln.' } },
    { k: 'req', lit: 1, name: { en: 'Request', de: 'Anfrage' }, sub: { en: 'early shift 28.11.', de: 'Frühdienst 28.11.' }, c: [4.8, 5.4], pz: .8, parts: [['envelope', 4.1, 4.9, { stack: 2 }]],
      info: { en: 'A mail from a house: “Early shift on 28.11.2026, wing 2, 07:00 to 13:30, 30 minutes break.” The agent turns it into an open shift.', de: 'Eine Mail aus einem Haus: „Frühdienst am 28.11.2026, WB 2, 07:00 bis 13:30, 30 Minuten Pause.“ Der Agent macht daraus einen offenen Dienst.' } },
    { k: 'house', name: 'Haus Lindenhof', sub: { en: 'your client', de: 'dein Kunde' }, c: [6.2, 1.4], pz: 1.6, parts: [['house', 5.6, 0.9, { w: 1.8, d: 1.5, h: 1.0 }]],
      info: { en: 'A made-up care home that books staff from you. It sends the requests and gets the plan back as a PDF.', de: 'Ein ausgedachtes Pflegeheim, das bei dir Personal bucht. Es schickt die Anfragen und bekommt den Plan als PDF zurück.' } },
    { k: 'book', lit: 1, name: { en: 'Planning workbook', de: 'Planungsmappe' }, sub: 'Planung.xlsm', c: [1.9, 5.3], pz: .85, parts: [['sheet', 1.0, 4.6, { w: 2.4, d: 1.7, mark: 1 }]],
      info: { en: 'Your own Excel file with the shift sheet, the block list and the staff overview. The agent writes into it, nobody has to change the way you work.', de: 'Deine eigene Excel-Datei mit Dienstblatt, Sperrliste und Personalübersicht. Der Agent schreibt hinein, an deiner Arbeitsweise ändert sich nichts.' } },
    { k: 'shift', lit: 1, name: { en: 'Open shift', de: 'Offener Dienst' }, sub: { en: 'Sat 28.11. · 07:00', de: 'Sa 28.11. · 07:00' }, c: [7.6, 5.6], pz: 1.45, parts: [['calendar', 7.0, 5.4]],
      info: { en: 'The shift as one entry: house, wing 2, early shift, 30 minutes break. It stays open until someone says yes, and opens again after a sick note.', de: 'Der Dienst als ein Eintrag: Haus, WB 2, Frühdienst, 30 Minuten Pause. Er bleibt offen, bis jemand Ja sagt, und geht nach einer Krankmeldung wieder auf.' } },
    { k: 'staff', lit: 1, name: { en: 'Staff', de: 'Personal' }, sub: 'Jana Brandt', title: { en: 'Staff · 4 people', de: 'Personal · 4 Leute' }, c: [9.8, 1.3], pz: 1.9, parts: [['person', 9.6, 1.1, { big: 1 }], ['person', 10.5, 1.6, {}]],
      info: { en: 'The people you can offer a shift: Mira Lenhart, Jana Brandt, Nora Vellmer, Timo Hessler. They answer in the chat with yes or no.', de: 'Die Leute, denen du einen Dienst anbieten kannst: Mira Lenhart, Jana Brandt, Nora Vellmer, Timo Hessler. Sie antworten im Chat mit Ja oder Nein.' } },
    { k: 'pdf', lit: 1, name: { en: 'Plan for the house', de: 'Plan fürs Haus' }, sub: 'PDF', c: [10.4, 5.7], pz: 1.1, parts: [['doc', 9.7, 4.9, { stack: 1, stamp: 1 }]],
      info: { en: 'A PDF with the filled plan, made from your workbook, so the house sees who comes.', de: 'Ein PDF mit dem gefüllten Plan, aus deiner Mappe erzeugt, damit das Haus sieht, wer kommt.' } }
  ],
  links: [['house', 'req'], ['req', 'shift'], ['shift', 'book'], ['book', 'agency'], ['staff', 'shift'], ['book', 'pdf'], ['pdf', 'house'], ['agency', 'staff'], ['house', 'shift']],
  hot: [['req', 'shift'], ['shift', 'book'], ['staff', 'shift'], ['book', 'pdf']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'Everywhere a shift or an answer can reach you: mail, lists, chat.', de: 'Überall, wo ein Dienst oder eine Antwort dich erreicht: Mail, Listen, Chat.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie er denkt' }, info: { en: 'Your rules, set once. The AI reads the messages; your rules decide who gets a shift.', de: 'Deine Regeln, einmal festgelegt. Die KI liest die Nachrichten; deine Regeln entscheiden, wer einen Dienst bekommt.' } },
    actions: { title: { en: 'What it does', de: 'Was er tut' }, info: { en: 'It works in your own workbook and in the chat. Nothing new to learn.', de: 'Er arbeitet in deiner eigenen Mappe und im Chat. Nichts Neues zu lernen.' } }
  },
  data: [
    { logo: 'gmail', t: { en: 'Mail', de: 'Mail' }, sub: { en: 'shift requests', de: 'Dienstanfragen' }, info: { en: 'A house mails what it needs. The agent reads date, wing, hours and break from the text.', de: 'Ein Haus mailt, was es braucht. Der Agent liest Datum, Wohnbereich, Zeiten und Pause aus dem Text.' } },
    { logo: 'doc', t: { en: 'Lists', de: 'Listen' }, sub: { en: 'many shifts at once', de: 'viele Dienste auf einmal' }, info: { en: 'A list with several shifts works too. Shifts that are already in the plan are skipped.', de: 'Eine Liste mit mehreren Diensten geht auch. Dienste, die schon im Plan stehen, werden übersprungen.' } },
    { logo: 'link', t: { en: 'Staff chat', de: 'Personal-Chat' }, sub: { en: 'yes, no, sick', de: 'Ja, Nein, krank' }, info: { en: 'Staff answer with a few words: yes, no, “I am sick on 28.11.”, wish-free day, paid leave.', de: 'Das Personal antwortet mit wenigen Worten: Ja, Nein, „Ich bin am 28.11. krank“, Wunschfrei, bezahlter Urlaub.' } },
    { logo: 'excel', t: 'Planung.xlsm', sub: { en: 'your workbook', de: 'deine Mappe' }, info: { en: 'The agent reads your current plan, so it knows who is already booked and who is free.', de: 'Der Agent liest deinen aktuellen Plan, damit er weiß, wer schon gebucht und wer frei ist.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Reads messages', de: 'Liest Nachrichten' }, sub: { en: 'AI, plain text', de: 'KI, normaler Text' }, info: { en: 'An AI reads mails and chat messages and pulls out the facts: date, shift, who, yes or no.', de: 'Eine KI liest Mails und Chat-Nachrichten und zieht die Fakten raus: Datum, Dienst, wer, Ja oder Nein.' } },
    { logo: 'check', t: { en: 'Who fits', de: 'Wer passt' }, sub: { en: 'free and qualified', de: 'frei und passend' }, info: { en: 'It offers a shift only to people who are free that day and have the right role.', de: 'Er bietet einen Dienst nur Leuten an, die an dem Tag frei sind und die passende Rolle haben.' } },
    { logo: 'rule', t: { en: 'First yes wins', de: 'Erstes Ja gewinnt' }, sub: { en: 'then it is closed', de: 'dann ist er zu' }, info: { en: 'The first yes gets the shift. Everyone who answers later hears that it is closed.', de: 'Das erste Ja bekommt den Dienst. Alle, die später antworten, hören, dass er geschlossen ist.' } },
    { logo: 'lock', t: { en: 'Blocks', de: 'Sperren' }, sub: { en: 'not to this house', de: 'nicht in dieses Haus' }, info: { en: 'If you say a person should no longer go to a house, it lands in the block list and is respected from then on.', de: 'Sagst du, dass jemand nicht mehr in ein Haus soll, kommt das in die Sperrliste und wird ab dann beachtet.' } }
  ],
  actions: [
    { logo: 'excel', t: { en: 'Workbook', de: 'Mappe' }, sub: { en: 'writes shifts, names', de: 'schreibt Dienste, Namen' }, info: { en: 'Enters open shifts, the name of who says yes, wish-free days and paid leave in the right sheet.', de: 'Trägt offene Dienste, den Namen dessen, der Ja sagt, Wunschfrei und bezahlten Urlaub im richtigen Blatt ein.' } },
    { logo: 'link', t: 'Chat', sub: { en: 'offers, confirms', de: 'fragt an, bestätigt' }, info: { en: 'Sends the offer to each person, confirms the shift to the one who got it and tells the others it is closed.', de: 'Schickt jedem das Angebot, bestätigt dem Gewinner den Dienst und sagt den anderen, dass er zu ist.' } },
    { logo: 'pdf', t: { en: 'Plan PDF', de: 'Plan-PDF' }, sub: { en: 'for the house', de: 'fürs Haus' }, info: { en: 'Makes the plan for the house as a PDF from your workbook.', de: 'Macht den Plan fürs Haus als PDF aus deiner Mappe.' } },
    { logo: 'chart', t: { en: 'Answers', de: 'Antworten' }, sub: { en: 'who is free, hours', de: 'wer frei ist, Stunden' }, info: { en: 'Ask the plan anything, for example who is free on Saturday. It answers from the workbook, and asks before it contacts anyone.', de: 'Frag den Plan alles, zum Beispiel wer am Samstag frei ist. Er antwortet aus der Mappe und fragt nach, bevor er jemanden anschreibt.' } }
  ],
  run: {
    title: { en: 'Shift filled', de: 'Dienst besetzt' }, total: '05', to: 'req',
    info: { en: 'Every step in order: mail read, offers out, first yes booked, sick note, replacement booked. Numbers are the steps of the demo.', de: 'Jeder Schritt der Reihe nach: Mail gelesen, Angebote raus, erstes Ja gebucht, Krankmeldung, Ersatz gebucht. Die Zahlen sind die Schritte der Demo.' },
    rows: [
      [{ en: 'Mail read, open shift entered', de: 'Mail gelesen, Dienst eingetragen' }, '01', 'req'],
      [{ en: 'Offers sent to 4 people', de: 'Angebote an 4 Leute raus' }, '02', 'staff'],
      [{ en: 'Jana says yes: booked', de: 'Jana sagt Ja: gebucht' }, '03', 'book'],
      [{ en: 'Sick note: shift open again', de: 'Krankmeldung: Dienst wieder offen' }, '04', 'shift'],
      [{ en: 'Nora says yes: booked', de: 'Nora sagt Ja: gebucht' }, '05', 'book']
    ]
  },
  phone: {
    to: 'agency', time: '07:00', date: { en: 'Sat 28 Nov · demo', de: 'Sa 28.11. · Demo' },
    title: { en: 'You', de: 'Du' }, info: { en: 'You see the result in your workbook and the chat. You only step in when your rules say so.', de: 'Du siehst das Ergebnis in deiner Mappe und im Chat. Du greifst nur ein, wenn deine Regeln es verlangen.' },
    notes: [
      { logo: 'link', app: { en: 'Chat · now', de: 'Chat · jetzt' }, t: { en: 'Shift filled', de: 'Dienst besetzt' }, p: { en: 'Haus Lindenhof, 28.11.\n07:00 to 13:30: Jana Brandt', de: 'Haus Lindenhof, 28.11.\n07:00 bis 13:30: Jana Brandt' } },
      { logo: 'excel', app: 'Planung.xlsm', t: { en: 'Replacement booked', de: 'Ersatz gebucht' }, p: { en: 'Nora Vellmer, 28.11.', de: 'Nora Vellmer, 28.11.' } }
    ]
  }
};
