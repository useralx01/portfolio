/* Scene: Quote agent (bathroom quote at a tiling firm). Facts from film-quote-agent. */
(window.MODELS = window.MODELS || {})['quote-agent'] = {
  aria: { en: 'Model of the quote agent: the business, what comes in, how it thinks, what it does', de: 'Modell des Angebots-Agenten: der Betrieb, was reinkommt, wie es denkt, was es tut' },
  steps: [
    { t: { en: 'Your business, as a model', de: 'Dein Betrieb als Modell' }, p: { en: 'First it learns your business: the customer, the enquiry, your price list and the quote, and how they connect.', de: 'Zuerst lernt es deinen Betrieb: Kunde, Anfrage, deine Preisliste und das Angebot, und wie sie zusammenhängen.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'An email enquiry, the customer’s answers and your own price list with about 40 items.', de: 'Eine Anfrage per E-Mail, die Antworten des Kunden und deine eigene Preisliste mit rund 40 Positionen.' } },
    { t: { en: 'How it thinks', de: 'Wie es denkt' }, p: { en: 'Your rules: what a quote needs to know, which items fit, how to calculate area, net, VAT and gross.', de: 'Deine Regeln: was ein Angebot wissen muss, welche Positionen passen, wie Fläche, Netto, MwSt. und Brutto gerechnet werden.' } },
    { t: { en: 'What it can do', de: 'Was es tun kann' }, p: { en: 'It asks the customer, builds the PDF and saves a draft in Gmail. It never sends alone.', de: 'Es fragt den Kunden, baut das PDF und legt einen Entwurf in Gmail ab. Es sendet nie allein.' } },
    { t: { en: 'The automation runs', de: 'Die Automatisierung läuft' }, p: { en: 'Enquiry 09:12, one question 09:14, answer 09:41, quote AN-2026-0417 as a draft at 09:47.', de: 'Anfrage 09:12, eine Rückfrage 09:14, Antwort 09:41, Angebot AN-2026-0417 um 09:47 als Entwurf.' } },
    { t: { en: 'You make the call', de: 'Du entscheidest' }, p: { en: 'You get a note that the draft is ready, check it and press send. It only does what your rules allow.', de: 'Du bekommst Bescheid, dass der Entwurf bereitliegt, prüfst ihn und klickst auf Senden. Es tut nur, was deine Regeln erlauben.' } }
  ],
  plane: { title: { en: 'Your business as a model', de: 'Dein Betrieb als Modell' }, info: { en: 'Everything it knows, linked: who asks, what they want, what is still missing, your prices, the quote. That is why the AI can act sensibly: it sees the whole picture, not one email.', de: 'Alles, was es weiß, verknüpft: wer anfragt, was er will, was noch fehlt, deine Preise, das Angebot. Deshalb handelt die KI sinnvoll: Sie sieht das ganze Bild, nicht eine einzelne Mail.' } },
  objects: [
    { k: 'firm', name: { en: 'Your firm', de: 'Dein Betrieb' }, sub: 'Kranzler & Lenz', title: { en: 'Your firm · Fliesen Kranzler & Lenz', de: 'Dein Betrieb · Fliesen Kranzler & Lenz' }, c: [1.6, 1.4], pz: 2.1, parts: [['building', .5, .5, { w: 2.2, d: 1.6, h: 1.5 }]],
      info: { en: 'You, the tiling firm. Every quote goes out in your name, with your prices and your terms.', de: 'Du, der Fliesenbetrieb. Jedes Angebot geht in deinem Namen raus, mit deinen Preisen und deinen Konditionen.' } },
    { k: 'cust', lit: 1, name: { en: 'Customer', de: 'Kunde' }, sub: 'Marco Reinhardt', title: { en: 'Customer · Marco Reinhardt', de: 'Kunde · Marco Reinhardt' }, c: [9.8, 1.3], pz: 1.9, parts: [['person', 9.6, 1.1, { big: 1 }], ['person', 10.5, 1.6, {}]],
      info: { en: 'The person who wants a new bathroom. The enquiry, the question, the answer and the quote all link to him.', de: 'Die Person, die ein neues Bad will. Anfrage, Rückfrage, Antwort und Angebot hängen alle an ihm.' } },
    { k: 'enq', lit: 1, name: { en: 'Enquiry', de: 'Anfrage' }, sub: { en: 'bathroom · 8 m²', de: 'Bad · 8 m²' }, c: [5.2, 1.1], pz: .6, parts: [['doc', 4.2, .3, { stack: 1 }], ['envelope', 5.4, 1.1, {}]],
      info: { en: 'The email: “Please quote: bathroom 8 m², tiles out, new tiles, walk-in shower.” The AI pulls out the facts: size, removal, shower.', de: 'Die Mail: „Bitte Angebot: Bad 8 m², Fliesen raus, neue Fliesen, Dusche bodengleich.“ Die KI zieht die Fakten raus: Größe, Rückbau, Dusche.' } },
    { k: 'ask', lit: 1, name: { en: 'Question', de: 'Rückfrage' }, title: { en: 'Question · tile size, wall height', de: 'Rückfrage · Format, Wandhöhe' }, c: [9.2, 3.1], pz: 1.2, parts: [['chat', 8.6, 2.9, {}]],
      info: { en: 'Two things were missing: tile size and how high the walls get tiled. The AI asks the customer once, in a friendly email. The answer: 60×60, grey, up to 2.10 m.', de: 'Zwei Dinge fehlten: Fliesenformat und bis wohin die Wände gefliest werden. Die KI fragt den Kunden einmal freundlich per Mail. Die Antwort: 60×60, grau, bis 2,10 m.' } },
    { k: 'price', lit: 1, name: { en: 'Price list', de: 'Preisliste' }, sub: { en: 'about 40 items', de: 'rund 40 Positionen' }, c: [1.6, 5.1], pz: .75, parts: [['sheet', .5, 4.4, { w: 2.2, d: 1.7, mark: 1 }]],
      info: { en: 'Your own price list 2026: work, material, per m², per piece, per metre. The AI only uses items and prices from this list.', de: 'Deine eigene Preisliste 2026: Arbeit, Material, pro m², pro Stück, pro Meter. Die KI nimmt nur Positionen und Preise aus dieser Liste.' } },
    { k: 'quote', lit: 1, name: { en: 'Quote', de: 'Angebot' }, sub: 'AN-2026-0417', title: { en: 'Quote · AN-2026-0417', de: 'Angebot · AN-2026-0417' }, c: [5.5, 5.7], pz: .75, parts: [['doc', 4.8, 5.0, { stack: 1, total: 1 }], ['coins', 6.4, 6.0]],
      info: { en: '15 items, net 5,469.38 EUR, plus 19 % VAT 1,039.18 EUR, gross 6,508.56 EUR. Valid 30 days, payment 14 days after acceptance.', de: '15 Positionen, netto 5.469,38 €, zzgl. 19 % MwSt. 1.039,18 €, brutto 6.508,56 €. 30 Tage gültig, Zahlung 14 Tage nach Abnahme.' } },
    { k: 'draft', lit: 1, name: { en: 'Draft', de: 'Entwurf' }, sub: { en: 'waits for you', de: 'wartet auf dich' }, c: [8.9, 5.2], pz: 1.0, parts: [['envelope', 7.8, 4.5, { stack: 2 }], ['doc', 9.4, 4.7, { stamp: 1 }]],
      info: { en: 'An email draft in Gmail with the PDF attached. The agent sends nothing itself. You check it and press send.', de: 'Ein E-Mail-Entwurf in Gmail mit dem PDF im Anhang. Der Agent sendet nichts selbst. Du prüfst ihn und klickst auf Senden.' } }
  ],
  links: [['cust', 'enq'], ['enq', 'ask'], ['ask', 'cust'], ['enq', 'price'], ['price', 'quote'], ['quote', 'cust'], ['quote', 'draft'], ['draft', 'firm'], ['firm', 'enq']],
  hot: [['cust', 'enq'], ['enq', 'ask'], ['ask', 'cust'], ['price', 'quote'], ['quote', 'draft']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'The enquiry by email, the answers of the customer and your price list.', de: 'Die Anfrage per E-Mail, die Antworten des Kunden und deine Preisliste.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie es denkt' }, info: { en: 'Your rules, set once. The AI reads and calculates; your rules decide what a quote needs.', de: 'Deine Regeln, einmal festgelegt. Die KI liest und rechnet; deine Regeln entscheiden, was ein Angebot braucht.' } },
    actions: { title: { en: 'What it does', de: 'Was es tut' }, info: { en: 'It works inside the tools you already use. Nothing new to learn.', de: 'Es arbeitet in den Tools, die du schon nutzt. Nichts Neues zu lernen.' } }
  },
  data: [
    { logo: 'gmail', t: { en: 'Enquiry', de: 'Anfrage' }, sub: { en: 'by email', de: 'per E-Mail' }, info: { en: 'A customer asks for a quote by email, in his own words.', de: 'Ein Kunde bittet per E-Mail um ein Angebot, in seinen eigenen Worten.' } },
    { logo: 'gmail', t: { en: 'Customer’s answer', de: 'Antwort des Kunden' }, sub: { en: 'to the question', de: 'auf die Rückfrage' }, info: { en: 'The reply with the missing facts: 60×60, grey, walls up to 2.10 m.', de: 'Die Antwort mit den fehlenden Angaben: 60×60, grau, Wände bis 2,10 m.' } },
    { logo: 'sheets', t: { en: 'Price list 2026', de: 'Preisliste 2026' }, sub: { en: 'about 40 items', de: 'rund 40 Positionen' }, info: { en: 'Your prices for work and material. The agent reads them, it never makes up a price.', de: 'Deine Preise für Arbeit und Material. Der Agent liest sie, er erfindet nie einen Preis.' } },
    { logo: 'doc', t: { en: 'Letterhead, terms', de: 'Briefkopf, Konditionen' }, sub: { en: 'your layout', de: 'dein Layout' }, info: { en: 'Your letterhead and terms: valid 30 days, payment 14 days after acceptance.', de: 'Dein Briefkopf und deine Konditionen: 30 Tage gültig, Zahlung 14 Tage nach Abnahme.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Reads the enquiry', de: 'Liest die Anfrage' }, sub: { en: 'what is missing?', de: 'was fehlt?' }, info: { en: 'An AI reads the email and checks what a quote still needs to know.', de: 'Eine KI liest die Mail und prüft, was für ein Angebot noch fehlt.' } },
    { logo: 'rule', t: { en: 'Must-know', de: 'Muss man wissen' }, sub: { en: 'size, tile, height', de: 'Fläche, Format, Höhe' }, title: { en: 'What a quote needs', de: 'Was ein Angebot braucht' }, info: { en: 'Your rules: room size, tile size and wall height. Without them it asks, it does not guess.', de: 'Deine Regeln: Raumgröße, Fliesenformat und Wandhöhe. Fehlt etwas, fragt es nach, es rät nicht.' } },
    { logo: 'euro', t: { en: 'Picks items', de: 'Wählt Positionen' }, sub: { en: 'from your list', de: 'aus deiner Liste' }, info: { en: 'Picks the matching items from your price list, 15 for this bathroom.', de: 'Wählt die passenden Positionen aus deiner Preisliste, hier 15 fürs Bad.' } },
    { logo: 'chart', t: { en: 'Calculates', de: 'Rechnet' }, sub: { en: 'area, net, VAT', de: 'Fläche, Netto, MwSt.' }, info: { en: 'Floor 8 m², walls 21.8 m². Then net, 19 % VAT and gross.', de: 'Boden 8 m², Wände 21,8 m². Dann netto, 19 % MwSt. und brutto.' } }
  ],
  actions: [
    { logo: 'gmail', t: 'Gmail', sub: { en: 'asks the customer', de: 'fragt den Kunden' }, info: { en: 'Sends one friendly question when something is missing.', de: 'Schickt eine freundliche Rückfrage, wenn etwas fehlt.' } },
    { logo: 'pdf', t: { en: 'Quote PDF', de: 'Angebots-PDF' }, sub: 'AN-2026-0417', info: { en: 'Builds the quote as a PDF in your letterhead, with every item and the total.', de: 'Baut das Angebot als PDF in deinem Briefkopf, mit allen Positionen und der Summe.' } },
    { logo: 'gmail', t: { en: 'Draft', de: 'Entwurf' }, sub: { en: 'PDF attached', de: 'PDF angehängt' }, info: { en: 'Saves the answer as a draft in Gmail, PDF attached. Nothing is sent.', de: 'Legt die Antwort als Entwurf in Gmail ab, PDF angehängt. Es wird nichts gesendet.' } },
    { logo: 'lock', t: { en: 'You approve', de: 'Du gibst frei' }, sub: { en: 'you press send', de: 'du klickst Senden' }, info: { en: 'The agent never sends alone. You check the quote and press send.', de: 'Der Agent sendet nie allein. Du prüfst das Angebot und klickst auf Senden.' } }
  ],
  run: {
    title: { en: 'Enquiry to quote', de: 'Anfrage zum Angebot' }, total: '09:47', to: 'enq',
    info: { en: 'Every step with its time: enquiry read, question sent, answer in, quote ready as a draft. Most of the wait is the customer.', de: 'Jeder Schritt mit Zeit: Anfrage gelesen, Rückfrage raus, Antwort da, Angebot als Entwurf fertig. Die meiste Wartezeit ist der Kunde.' },
    rows: [
      [{ en: 'Enquiry received, read', de: 'Anfrage angekommen, gelesen' }, '09:12', 'enq'],
      [{ en: 'Missing: tile size, wall height', de: 'Fehlt: Format, Wandhöhe' }, '09:12', 'ask'],
      [{ en: 'Question sent to customer', de: 'Rückfrage an den Kunden' }, '09:14', 'cust'],
      [{ en: 'Customer answers', de: 'Kunde antwortet' }, '09:41', 'enq'],
      [{ en: 'Quote 6,508.56 € as a draft', de: 'Angebot 6.508,56 € als Entwurf' }, '09:47', 'draft']
    ]
  },
  phone: {
    to: 'draft', time: '09:47', date: { en: 'Monday, 23 November', de: 'Montag, 23. November' },
    title: { en: 'You', de: 'Du' }, info: { en: 'One note: the draft is ready. You check it and press send. Nothing else needs you.', de: 'Eine Nachricht: Der Entwurf liegt bereit. Du prüfst und klickst auf Senden. Sonst braucht es dich nicht.' },
    notes: [
      { logo: 'gmail', app: { en: 'Gmail · now', de: 'Gmail · jetzt' }, t: { en: 'Draft is ready', de: 'Entwurf liegt bereit' }, p: { en: 'Quote AN-2026-0417,\n6,508.56 € gross.', de: 'Angebot AN-2026-0417,\n6.508,56 € brutto.' } },
      { logo: 'pdf', app: { en: 'PDF attached', de: 'PDF im Anhang' }, t: { en: 'Reinhardt · bathroom', de: 'Reinhardt · Bad' }, p: { en: 'waits for your approval', de: 'wartet auf deine Freigabe' } }
    ]
  }
};
