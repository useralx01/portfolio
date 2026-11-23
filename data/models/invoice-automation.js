/* Scene: Invoice intake (Rechnungseingang). Facts from film-invoice-automation: Schreinerei Lindenmoos GmbH, Monday 16.11.2026. */
(window.MODELS = window.MODELS || {})['invoice-automation'] = {
  aria: { en: 'Model of the invoice intake automation: the business, what comes in, how it thinks, what it does', de: 'Modell der Rechnungseingang-Automatisierung: der Betrieb, was reinkommt, wie es denkt, was es tut' },
  steps: [
    { t: { en: 'Your books, as a model', de: 'Deine Buchhaltung als Modell' }, p: { en: 'First it learns how invoices travel through your business: mailbox, invoice, sheet, folder, accountant.', de: 'Zuerst lernt es, wie Rechnungen durch deinen Betrieb wandern: Postfach, Rechnung, Tabelle, Ablage, Buchhaltung.' } },
    { t: { en: 'What comes in', de: 'Was reinkommt' }, p: { en: 'Invoices arrive by email: as a PDF, as a scan, as an e-invoice.', de: 'Rechnungen kommen per Mail: als PDF, als Scan, als E-Rechnung.' } },
    { t: { en: 'How it thinks', de: 'Wie es denkt' }, p: { en: 'It reads supplier, number, date, amounts and IBAN, and checks if it has seen the invoice before.', de: 'Es liest Lieferant, Nummer, Datum, Beträge und IBAN und prüft, ob es die Rechnung schon kennt.' } },
    { t: { en: 'What it can do', de: 'Was es tun kann' }, p: { en: 'It fills your sheet, files the PDF, forwards it to your accountant and tells you.', de: 'Es füllt deine Tabelle, legt die PDF ab, leitet sie an die Buchhaltung weiter und sagt dir Bescheid.' } },
    { t: { en: 'The automation runs', de: 'Die Automatisierung läuft' }, p: { en: 'Monday morning: 3 invoices in, 1 duplicate stopped, 2 filed and sent on. Done by 08:15.', de: 'Montagmorgen: 3 Rechnungen rein, 1 Duplikat gestoppt, 2 abgelegt und weitergeleitet. Fertig um 08:15.' } },
    { t: { en: 'Nothing left to do', de: 'Nichts mehr zu tun' }, p: { en: 'You get one short message. Nobody typed anything.', de: 'Du bekommst eine kurze Meldung. Niemand hat etwas getippt.' } }
  ],
  plane: { title: { en: 'Your books as a model', de: 'Deine Buchhaltung als Modell' }, info: { en: 'Everything an invoice touches, linked: the mailbox it arrives in, the invoice itself, the sheet, the folder and your accountant. That is why the AI can tell a new invoice from one it already has.', de: 'Alles, was eine Rechnung berührt, verknüpft: das Postfach, in dem sie ankommt, die Rechnung selbst, die Tabelle, die Ablage und deine Buchhaltung. Deshalb erkennt die KI, ob eine Rechnung neu ist oder schon da war.' } },
  objects: [
    { k: 'mail', lit: 1, name: { en: 'Mailbox', de: 'Postfach' }, sub: { en: '3 invoices', de: '3 Rechnungen' }, c: [1.5, 6.0], pz: .95, parts: [['envelope', .7, 5.4, { stack: 3 }]],
      info: { en: 'The inbox of your accounting address. Monday at 08:10 three invoices have arrived by email.', de: 'Das Postfach deiner Buchhaltungsadresse. Montag um 08:10 sind drei Rechnungen per Mail angekommen.' } },
    { k: 'inv', lit: 1, name: { en: 'Invoice', de: 'Rechnung' }, sub: 'Auerbach', title: { en: 'Invoice · Holzgroßhandel Auerbach', de: 'Rechnung · Holzgroßhandel Auerbach' }, c: [1.3, 2.3], pz: .55, parts: [['doc', .65, 1.45, { total: 1 }]],
      info: { en: 'Invoice RE-2026-1187 from the timber wholesaler, dated 14.11., total 2,192.58 EUR, 14 days to pay. The AI reads every field.', de: 'Rechnung RE-2026-1187 vom Holzgroßhandel, vom 14.11., brutto 2.192,58 €, 14 Tage Zahlungsziel. Die KI liest jedes Feld.' } },
    { k: 'scan', lit: 1, name: { en: 'Scanned invoice', de: 'Scan' }, sub: 'Kessler', title: { en: 'Scan · Farben Kessler', de: 'Scan · Farben Kessler' }, c: [4.5, 2.5], pz: .55, parts: [['doc', 3.85, 1.65, {}]],
      info: { en: 'A paper invoice from the paint shop, scanned as a picture. Text recognition reads it anyway: number 2026-0934, total 340.82 EUR.', de: 'Eine Papierrechnung vom Farbengeschäft, als Bild eingescannt. Die Texterkennung liest sie trotzdem: Nummer 2026-0934, brutto 340,82 €.' } },
    { k: 'dup', name: { en: 'Duplicate', de: 'Duplikat' }, sub: { en: 'stopped', de: 'gestoppt' }, title: { en: 'Duplicate · Energieversorgung Lindenau', de: 'Duplikat · Energieversorgung Lindenau' }, c: [5.4, 5.3], pz: .55, parts: [['doc', 4.75, 4.45, { stamp: 1 }]],
      info: { en: 'The e-invoice from the energy supplier has the same number and amount as one already recorded on 10.11. It is stopped, so you never pay twice.', de: 'Die E-Rechnung vom Energieversorger hat dieselbe Nummer und denselben Betrag wie eine, die am 10.11. schon erfasst wurde. Sie wird gestoppt, damit du nie doppelt zahlst.' } },
    { k: 'sheet', lit: 1, name: { en: 'Sheet', de: 'Tabelle' }, sub: { en: 'invoices 2026', de: 'Rechnungen 2026' }, c: [7.3, 1.2], pz: .9, parts: [['sheet', 6.1, .35, { mark: 1, w: 2.4, d: 1.7 }]],
      info: { en: 'Your accounting sheet. Each new invoice becomes one row: date, supplier, number, net, VAT, gross, IBAN. The duplicate gets no row.', de: 'Deine Buchhaltungstabelle. Jede neue Rechnung wird eine Zeile: Datum, Lieferant, Nummer, Netto, MwSt, Brutto, IBAN. Das Duplikat bekommt keine.' } },
    { k: 'folder', lit: 1, name: { en: 'Filing', de: 'Ablage' }, c: [10.2, 3.0], pz: .9, parts: [['folder', 9.5, 2.5]],
      info: { en: 'The PDF is renamed (date, supplier, number) and filed in the monthly folder, for example 2026-11-14_Holzgrosshandel-Auerbach_RE-2026-1187.pdf.', de: 'Die PDF wird umbenannt (Datum, Lieferant, Nummer) und im Monatsordner abgelegt, zum Beispiel 2026-11-14_Holzgrosshandel-Auerbach_RE-2026-1187.pdf.' } },
    { k: 'acc', lit: 1, name: { en: 'Accounting', de: 'Buchhaltung' }, c: [9.2, 5.5], pz: 2.0, parts: [['building', 8.3, 4.8, { w: 1.8, d: 1.5, h: 1.4 }]],
      info: { en: "Your accountant's upload address. Both new invoices are sent there automatically, already read and entered in the sheet.", de: 'Die Upload-Adresse deiner Buchhaltung. Beide neuen Rechnungen gehen automatisch dorthin, schon gelesen und in der Tabelle erfasst.' } }
  ],
  links: [['mail', 'inv'], ['mail', 'scan'], ['mail', 'dup'], ['inv', 'sheet'], ['scan', 'sheet'], ['inv', 'folder'], ['scan', 'folder'], ['folder', 'acc'], ['dup', 'sheet']],
  hot: [['mail', 'inv'], ['inv', 'sheet'], ['inv', 'folder'], ['folder', 'acc']],
  trayInfo: {
    data: { title: { en: 'What comes in', de: 'Was reinkommt' }, info: { en: 'Invoices as they reach you by email, in any form. The automation starts when one arrives.', de: 'Rechnungen, wie sie dich per Mail erreichen, in jeder Form. Die Automatisierung startet, sobald eine ankommt.' } },
    logic: { title: { en: 'How it thinks', de: 'Wie es denkt' }, info: { en: 'It reads each invoice, checks it against what you already have and decides what to do with it.', de: 'Es liest jede Rechnung, gleicht sie mit dem ab, was du schon hast, und entscheidet, was damit passiert.' } },
    actions: { title: { en: 'What it does', de: 'Was es tut' }, info: { en: 'It works in your sheet, your folders and your mail. Nothing new to learn.', de: 'Es arbeitet in deiner Tabelle, deinen Ordnern und deiner Mail. Nichts Neues zu lernen.' } }
  },
  data: [
    { logo: 'gmail', t: { en: 'Mailbox', de: 'Postfach' }, sub: { en: 'accounting address', de: 'Buchhaltungsadresse' }, info: { en: 'Your accounting mailbox. Every email with an invoice attached is picked up.', de: 'Dein Buchhaltungs-Postfach. Jede Mail mit einer Rechnung im Anhang wird aufgegriffen.' } },
    { logo: 'pdf', t: 'PDF', sub: { en: 'normal invoice', de: 'normale Rechnung' }, info: { en: 'The usual invoice as a PDF attachment.', de: 'Die übliche Rechnung als PDF im Anhang.' } },
    { logo: 'doc', t: { en: 'Scan', de: 'Scan' }, sub: { en: 'paper, as a picture', de: 'Papier, als Bild' }, info: { en: 'A scanned paper invoice. It is only a picture, so text recognition reads it.', de: 'Eine eingescannte Papierrechnung. Sie ist nur ein Bild, deshalb liest sie die Texterkennung.' } },
    { logo: 'check', t: { en: 'E-invoice', de: 'E-Rechnung' }, sub: 'ZUGFeRD', info: { en: 'An e-invoice carries its data inside the file, so nothing has to be guessed.', de: 'Eine E-Rechnung trägt ihre Daten in der Datei, es muss nichts geraten werden.' } }
  ],
  logic: [
    { logo: 'ai', t: { en: 'Reads invoices', de: 'Liest Rechnungen' }, sub: { en: 'AI + text recognition', de: 'KI + Texterkennung' }, info: { en: 'An AI reads supplier, number, date, net, VAT, gross and IBAN, from PDFs and from scans.', de: 'Eine KI liest Lieferant, Nummer, Datum, Netto, MwSt, Brutto und IBAN, aus PDFs und aus Scans.' } },
    { logo: 'rule', t: { en: 'Duplicate check', de: 'Dubletten-Check' }, sub: { en: 'same number, same amount', de: 'gleiche Nummer, Betrag' }, info: { en: 'First question: do we already have this one? Same number and same amount means it is stopped.', de: 'Erste Frage: Haben wir die schon? Gleiche Nummer und gleicher Betrag heißt: gestoppt.' } },
    { logo: 'euro', t: { en: 'Amounts', de: 'Beträge' }, sub: { en: 'net, VAT, gross', de: 'netto, MwSt, brutto' }, info: { en: 'It keeps net, VAT and gross apart, so the sheet is ready for your accountant.', de: 'Es hält Netto, MwSt und Brutto getrennt, so ist die Tabelle für deine Buchhaltung fertig.' } },
    { logo: 'doc', t: { en: 'File name', de: 'Dateiname' }, sub: 'Datum_Lieferant_Nummer', title: { en: 'How files are named', de: 'Wie Dateien heißen' }, info: { en: 'Your naming rule: date, supplier, number. Every invoice is easy to find later.', de: 'Deine Namensregel: Datum, Lieferant, Nummer. So findest du jede Rechnung später sofort.' } }
  ],
  actions: [
    { logo: 'sheets', t: { en: 'Sheet', de: 'Tabelle' }, sub: { en: 'one row per invoice', de: 'eine Zeile pro Rechnung' }, info: { en: 'Adds one row per new invoice with every field filled in.', de: 'Legt pro neuer Rechnung eine Zeile an, alle Felder ausgefüllt.' } },
    { logo: 'pdf', t: { en: 'Filing', de: 'Ablage' }, sub: { en: 'renamed, monthly folder', de: 'umbenannt, Monatsordner' }, info: { en: 'Renames the PDF and files it in the folder for the month.', de: 'Benennt die PDF um und legt sie im Ordner des Monats ab.' } },
    { logo: 'gmail', t: { en: 'Forward', de: 'Weiterleitung' }, sub: { en: 'to accounting upload', de: 'an Buchhaltungs-Upload' }, info: { en: 'Sends each new invoice to the upload address of your accountant. The duplicate is not sent.', de: 'Schickt jede neue Rechnung an die Upload-Adresse deiner Buchhaltung. Das Duplikat geht nicht raus.' } },
    { logo: 'check', t: { en: 'Summary', de: 'Meldung' }, sub: { en: 'one short message', de: 'eine kurze Nachricht' }, info: { en: 'One short message to you: how many invoices, how many filed, what was stopped.', de: 'Eine kurze Nachricht an dich: wie viele Rechnungen, wie viele abgelegt, was gestoppt wurde.' } }
  ],
  run: {
    title: { en: 'Invoice intake', de: 'Rechnungseingang' }, total: '08:15', to: 'mail',
    info: { en: "Monday morning with the film's times: invoices in, read, duplicate stopped, filed, sent on, you told. Finished at 08:15.", de: 'Montagmorgen mit den Zeiten aus dem Film: Rechnungen rein, gelesen, Duplikat gestoppt, abgelegt, weitergeleitet, du informiert. Fertig um 08:15.' },
    rows: [
      [{ en: '3 invoices arrived', de: '3 Rechnungen angekommen' }, '08:10', 'mail'],
      [{ en: 'Read, duplicate stopped, filed', de: 'Gelesen, Duplikat gestoppt, abgelegt' }, '08:13', 'dup'],
      [{ en: 'Auerbach sent to accounting', de: 'Auerbach an Buchhaltung' }, '08:14', 'acc'],
      [{ en: 'Kessler sent to accounting', de: 'Kessler an Buchhaltung' }, '08:15', 'acc'],
      [{ en: 'You got the summary', de: 'Du hast die Meldung' }, '08:15', 'you']
    ]
  },
  phone: {
    to: 'sheet', time: '08:15', date: { en: 'Monday, 16 November', de: 'Montag, 16. November' },
    title: { en: 'You', de: 'Du' }, info: { en: 'One short message. Two invoices are entered, filed and with your accountant. Nothing is left for you to do.', de: 'Eine kurze Meldung. Zwei Rechnungen sind erfasst, abgelegt und bei der Buchhaltung. Für dich bleibt nichts zu tun.' },
    notes: [
      { logo: 'check', app: { en: 'Invoice intake · now', de: 'Rechnungseingang · jetzt' }, t: { en: '3 invoices processed', de: '3 Rechnungen erledigt' }, p: { en: '2 filed and sent on,\n1 duplicate stopped.', de: '2 erfasst und abgelegt,\n1 Duplikat gestoppt.' } },
      { logo: 'euro', app: { en: 'Sent to accounting', de: 'An Buchhaltung gesendet' }, t: { en: '2,192.58 € and 340.82 €', de: '2.192,58 € und 340,82 €' }, p: { en: 'Auerbach and Kessler', de: 'Auerbach und Kessler' } }
    ]
  }
};
