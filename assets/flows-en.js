// English text for the question flows and their screens. Field ids must match flows-de.js and the backend.
window.SITE_TEXT = (() => {
  const one = (opts, two) => ({ type: 'one', opts, two });
  const many = (opts, two) => ({ type: 'many', opts, two });
  const has = (a, id, ...v) => v.some(x => (a[id] || []).includes(x));
  const OPT = { opt: true };
  const ui = {
    of: 'of', check: 'Check your answers', next: 'Continue', toCheck: 'Check answers', sendMail: 'Send by email', send: 'Send', sending: 'Sending…',
    almost: 'Almost done', checkH: 'Check your answers.', checkHintMail: 'Sending opens your email app with all of this filled in. You press send there.', checkHintApi: 'Press send and it comes straight to me. You get a copy by email.',
    edit: 'Edit', optional: 'optional', pick: 'Pick at least one answer.', star: 'Tap a star to rate.', fill: f => `Please fill in “${f}”.`, badEmail: 'That email address looks incomplete.',
    consentMsg: 'Please tick the box to go on.', agreed: 'Agreed',
    mailNote: (m) => `Nothing opened? Your answers are copied. Paste them into an email to <a class="more" href="mailto:${m}">${m}</a>, or <button class="more" type="button" data-copyall>copy them again</button>.`,
    copied: 'copied', copyFail: 'copy failed', failed: "Sending didn't work. Opening your email app instead.",
    slotsLoading: 'Loading free times…', slotsNone: 'No free times in the next two weeks. Please start a project instead and I will suggest a time.', slotsTz: 'Times are shown in your time zone', slotTaken: 'Someone just took that time. Please pick another one.', pickSlot: 'Pick a time.',
    locale: 'en-GB',
  };
  const project = {
    type: 'project', title: 'Start a project', subject: a => `Project request from ${a.name || 'a visitor'}`,
    intro: 'Hi Issa,\n\nhere is my project request from your portfolio.\n',
    done: ["Thanks. I'll contact you soon.", 'Your email app opened with all your answers. Press send there so they reach me. I usually reply within two working days with questions, a plan and a price.'],
    doneApi: ["Thanks. I'll contact you soon.", 'Your request reached me, and a copy is on its way to your inbox. I usually reply within two working days with questions, a plan and a price.'],
    steps: [
      { id: 'need', k: 'The project', sum: 'Wants to build', q: 'What do you want to build?', hint: 'Pick everything that fits.', ...many([['AI agent', 'Software that does tasks by itself'], ['App', 'Desktop, web or phone'], ['Website', 'A landing page, a full site or a shop'], ['Local AI', 'AI on your own hardware'], ['Not sure yet', "We'll work it out together"]]) },
      { id: 'goal', k: 'The project', q: 'What should it achieve?', hint: 'The one result that would make this project a success for you.', type: 'fields', fields: [{ id: 'goal', label: 'The main goal', sum: 'Main goal', area: true, req: true, ph: 'For example: clients book and pay without calling me, so I save 5 hours a week.' }] },
      { id: 'today', k: 'The project', sum: 'How it is done today', q: 'How is this done today?', ...one([['By hand', 'Calls, emails, paper or spreadsheets'], ['With another tool', 'But it does not do the job well'], ['Not at all yet', 'This would be something new'], ['Something else']]), fields: [{ id: 'pain', label: 'What bothers you most about it?', sum: 'What bothers them', ...OPT }] },
      { id: 'stage', k: 'The project', sum: 'Where they are', q: 'How far along are you?', ...one([['Just an idea', 'Nothing built yet'], ['Plans or designs ready', 'I know what it should look like'], ['Something exists', 'It needs to be improved or extended'], ['Something is broken', 'It needs fixing']]), fields: [{ id: 'existing', label: 'Link to what exists, if anything', sum: 'Existing link', ...OPT, ph: 'https://' }] },
      { id: 'about', k: 'The project', q: 'Describe it in your own words.', hint: 'What should it do from start to finish? A few sentences are enough.', type: 'fields', fields: [{ id: 'about', label: 'Your project', sum: 'Description', area: true, req: true, ph: 'For example: a booking site for my studio. Clients see free times, pick one, pay online and get a reminder the day before.' }] },
      { id: 'features', k: 'The project', q: 'What must it be able to do?', hint: 'The must-haves for the first version. Nice-to-haves can come later.', type: 'fields', fields: [{ id: 'features', label: 'Must-have features', sum: 'Must-haves', area: true, req: true, ph: '1. Clients see free time slots\n2. They pay when booking\n3. I get an email for each booking' }, { id: 'nice', label: 'Nice to have later', sum: 'Nice-to-haves', area: true, ...OPT }] },
      { id: 'where', k: 'Where it runs', sum: 'Runs on', q: 'Where should it run?', hint: 'Pick everything that fits.', ...many([['In the browser'], ['Windows'], ['Mac'], ['iPhone and iPad'], ['Android'], ['On our own server or PC'], ['Not sure yet']], true) },
      { id: 'siteType', k: 'The website', sum: 'Kind of site', q: 'What kind of website?', when: a => has(a, 'need', 'Website'), ...one([['One page', 'Everything on one scrolling page'], ['Small site', '2 to 5 pages'], ['Bigger site', '6 pages or more'], ['Online shop', 'Products, cart and checkout']]), fields: [{ id: 'pages', label: 'Which pages do you need?', sum: 'Pages', ...OPT, ph: 'For example: Home, Services, Prices, About, Contact' }] },
      { id: 'content', k: 'The website', sum: 'Texts and pictures', q: 'Are the texts and pictures ready?', when: a => has(a, 'need', 'Website'), ...one([['All ready'], ['Partly ready'], ['Please write and find them for me']]) },
      { id: 'domain', k: 'The website', sum: 'Domain and hosting', q: 'Do you have a domain and hosting?', when: a => has(a, 'need', 'Website'), ...one([['Both', 'For example a .com and a host'], ['Only a domain'], ['Neither, please set it up'], ['Not sure']]), fields: [{ id: 'domainName', label: 'Your domain', sum: 'Domain', ...OPT, ph: 'example.com' }] },
      { id: 'aiDo', k: 'The AI', q: 'What should the AI do by itself?', hint: 'Describe the tasks as you would explain them to a new employee.', when: a => has(a, 'need', 'AI agent', 'Local AI'), type: 'fields', fields: [{ id: 'aiTasks', label: 'Its tasks', sum: 'AI tasks', area: true, req: true, ph: 'For example: read new support emails, answer the simple ones, and send me the rest with a summary.' }, { id: 'aiNever', label: 'What should it never do without asking you?', sum: 'Never without asking', ...OPT, ph: 'For example: send money, delete files, email customers' }] },
      { id: 'aiData', k: 'The AI', sum: 'AI works with', q: 'What will it work with?', hint: 'Pick everything that fits.', when: a => has(a, 'need', 'AI agent', 'Local AI'), ...many([['Documents and files'], ['Emails'], ['Websites'], ['A database'], ['Customer chats'], ['Code'], ['Something else']], true) },
      { id: 'aiCloud', k: 'The AI', sum: 'Data to cloud AI', q: 'May your data go to cloud AI?', hint: 'Like ChatGPT or Claude. If not, the AI runs on your own machines.', when: a => has(a, 'need', 'AI agent', 'Local AI'), ...one([['Yes, that is fine'], ['Only some of it'], ['No, it must stay with us'], ['Not sure']]) },
      { id: 'hardware', k: 'The AI', sum: 'Hardware', q: 'What about the hardware?', when: a => has(a, 'need', 'Local AI') || a.aiCloud === 'No, it must stay with us', ...one([['We have it', 'Tell me what it is below'], ['We need advice on what to buy'], ['Not sure']]), fields: [{ id: 'hwDetails', label: 'Your hardware', sum: 'Hardware details', ...OPT, ph: 'For example: 2 PCs with RTX 4090, 64 GB RAM' }] },
      { id: 'users', k: 'Who uses it', sum: 'Used by', q: 'Who will use it?', ...one([['Just me'], ['My team'], ['My customers'], ['Anyone on the internet']], true), fields: [{ id: 'howmany', label: 'Roughly how many people?', sum: 'How many people', ...OPT, ph: 'For example: 5 staff and about 200 customers a month' }] },
      { id: 'login', k: 'Who uses it', sum: 'Log in', q: 'Do people need to log in?', ...one([['No'], ['Yes, everyone the same', 'One kind of account'], ['Yes, with different roles', 'For example admin and customer'], ['Not sure']]) },
      { id: 'langs', k: 'Who uses it', sum: 'Languages', q: 'Which languages?', ...many([['English'], ['German'], ['Other']], true), fields: [{ id: 'langOther', label: 'Other languages', sum: 'Other languages', ...OPT }] },
      { id: 'personal', k: 'Who uses it', sum: 'Personal data', q: 'Will it store personal data?', hint: 'Names, emails, addresses, payments and so on. This matters for privacy laws.', ...one([['No'], ['Yes, normal customer data'], ['Yes, sensitive data', 'Health, money, ID documents'], ['Not sure']]) },
      { id: 'connect', k: 'Connections', sum: 'Connects to', q: 'Does it need to connect to anything?', hint: 'Pick everything that fits.', ...many([['An existing website or app'], ['A database or spreadsheet'], ['Payments'], ['AI models', 'ChatGPT, Claude or others'], ['Email, calendar or chat tools'], ['Accounting or CRM'], ['Nothing that I know of']], true), fields: [{ id: 'tools', label: 'Which tools exactly?', sum: 'Tools', ...OPT, ph: 'For example: Shopify, Google Sheets, Stripe, HubSpot' }] },
      { id: 'look', k: 'The look', sum: 'Look', q: 'What about the look?', ...one([['I have a brand', 'Logo, colours and fonts'], ['I have some ideas'], ['Design it for me']]), fields: [{ id: 'feel', label: 'Three words for how it should feel', sum: 'Feel', ...OPT, ph: 'For example: calm, premium, simple' }] },
      { id: 'refs', k: 'The look', q: 'Any examples?', hint: 'Sites or apps you like, and anyone already doing something similar. Optional, but it helps a lot.', type: 'fields', fields: [{ id: 'likes', label: 'Sites or apps you like, and why', sum: 'Likes', area: true, ...OPT }, { id: 'rivals', label: 'Competitors or similar products', sum: 'Competitors', ...OPT }] },
      { id: 'time', k: 'Time and budget', sum: 'When', q: 'When do you need it?', ...one([['As soon as possible'], ['Within a month'], ['In 2 to 3 months'], ['No fixed date']], true), fields: [{ id: 'deadline', label: 'A fixed deadline?', sum: 'Deadline', ...OPT, type: 'date' }, { id: 'why', label: 'What is the date for?', sum: 'Deadline reason', ...OPT, ph: 'For example: a trade fair, a launch, a season' }] },
      { id: 'budget', k: 'Time and budget', sum: 'Budget', q: 'What budget do you have in mind?', hint: 'A rough range is fine. It helps me suggest the right size for the first version.', ...one([['Under €1,000'], ['€1,000 to €3,000'], ['€3,000 to €10,000'], ['€10,000 to €25,000'], ['Over €25,000'], ['Not sure yet']], true) },
      { id: 'pay', k: 'Time and budget', sum: 'Pay by', q: 'How would you like to pay?', ...one([['A fixed price', 'For the whole project'], ['By the hour', 'For changing or open work'], ['Monthly', 'For ongoing work'], ['No preference']]) },
      { id: 'after', k: 'Time and budget', sum: 'After launch', q: 'And after launch?', ...one([['Hand it over', 'My team takes care of it'], ['Ongoing care', 'Updates, fixes and new features'], ['Not sure yet']]) },
      { id: 'you', k: 'About you', q: 'How can I reach you?', type: 'fields', fields: [{ id: 'name', label: 'Your name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'Email', sum: 'Email', req: true, type: 'email', ac: 'email' }, { id: 'phone', label: 'Phone', sum: 'Phone', ...OPT, type: 'tel', ac: 'tel' }, { id: 'company', label: 'Company', sum: 'Company', ...OPT, ac: 'organization' }, { id: 'web', label: 'Company website', sum: 'Website', ...OPT, type: 'url', ph: 'https://' }] },
      { id: 'decide', k: 'About you', sum: 'Decides', q: 'Who decides on the project?', ...one([['I decide'], ['I decide with others'], ['Someone else decides']]), fields: [{ id: 'roleCo', label: 'Your role', sum: 'Role', ...OPT, ph: 'For example: Owner, Head of marketing' }] },
      { id: 'found', k: 'About you', sum: 'Found me through', q: 'How did you find me?', ...one([['Search'], ['Social media'], ['GitHub'], ['A friend or client'], ['Somewhere else']], true) },
      { id: 'reply', k: 'About you', sum: 'Reply by', q: 'How should I get back to you?', ...one([['Email'], ['Phone call'], ['Video call']], true), fields: [{ id: 'else', label: 'Anything else I should know?', sum: 'Anything else', area: true, ...OPT }] },
    ],
  };
  const review = {
    type: 'review', title: 'Write a review', subject: a => `Review from ${a.name || 'a client'}`,
    intro: 'Hi Issa,\n\nhere is my review for your portfolio.\n',
    done: ['Thank you.', 'Your email app opened with your review. Press send there so it reaches me. It appears on the site once I have checked it is from a real project.'],
    doneApi: ['Thank you.', 'Your review reached me. It appears on the site once I have checked it is from a real project.'],
    steps: [
      { id: 'stars', k: 'Your review', sum: 'Rating', q: 'How was it to work together?', type: 'stars' },
      { id: 'project', k: 'Your review', q: 'What did we build?', type: 'fields', fields: [{ id: 'project', label: 'The project', sum: 'Project', req: true, ph: 'For example: our booking website' }] },
      { id: 'text', k: 'Your review', q: 'Tell others about it.', hint: 'What went well, and what could have been better?', type: 'fields', fields: [{ id: 'text', label: 'Your review', sum: 'Review', area: true, req: true }] },
      { id: 'who', k: 'About you', q: 'Who are you?', hint: 'Shown with your review.', type: 'fields', fields: [{ id: 'name', label: 'Your name', sum: 'Name', req: true, ac: 'name' }, { id: 'role', label: 'Role and company', sum: 'Role and company', ...OPT, ph: 'For example: Owner, Studio North' }], consent: 'I agree that this review may be shown on this site with my name.' },
    ],
  };
  const tester = {
    type: 'tester', title: 'Become a tester', subject: a => `New tester: ${a.name || 'a visitor'}`,
    intro: 'Hi Issa,\n\nI would like to be a tester.\n',
    done: ["You're almost on the list.", "Your email app opened with your answers. Press send there, and I'll message you whenever something new is ready to test."],
    doneApi: ['Check your inbox.', "I sent you an email. Click the link in it to confirm, and you're on the list."],
    steps: [
      { id: 'what', k: 'What to test', sum: 'Wants to test', q: 'What would you like to test?', hint: 'Pick everything that sounds interesting.', ...many([['Overlink', 'Your AI chats working on your own computers'], ['PocketLM', 'Big AI models on normal PCs'], ['TradeLabs', 'Trading tools'], ['Licht', 'One place for all your AI chats'], ['Anything new', 'Tell me about every new launch']]) },
      { id: 'devices', k: 'Your setup', sum: 'Devices', q: 'What do you use?', hint: 'Pick everything you could test on.', ...many([['Windows PC'], ['Mac'], ['Linux'], ['iPhone'], ['Android']], true), fields: [{ id: 'gpu', label: 'Graphics card, if you know it', sum: 'Graphics card', ...OPT, ph: 'For example: RTX 3060, or none' }] },
      { id: 'aiUse', k: 'Your setup', sum: 'Uses AI', q: 'How often do you use AI tools?', ...one([['Every day'], ['A few times a week'], ['Now and then'], ['Hardly ever']], true), fields: [{ id: 'aiTools', label: 'Which ones?', sum: 'AI tools', ...OPT, ph: 'For example: ChatGPT, Claude, Copilot' }] },
      { id: 'level', k: 'About you', sum: 'Tech level', q: 'How would you describe yourself?', ...one([['New to tech', 'I use apps, nothing more'], ['Comfortable', 'I install and set things up myself'], ['Developer', 'I write code']]) },
      { id: 'time', k: 'About you', sum: 'Time per test', q: 'How much time can you give per test?', ...one([['About 15 minutes'], ['About an hour'], ['A few hours'], ['It depends']], true) },
      { id: 'how', k: 'About you', sum: 'Feedback by', q: 'How do you like to give feedback?', hint: 'Pick everything that fits.', ...many([['Written notes'], ['Screenshots or a screen recording'], ['A short call'], ['Detailed bug reports']], true) },
      { id: 'you', k: 'About you', q: 'Who are you?', type: 'fields', fields: [{ id: 'name', label: 'Your name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'Email', sum: 'Email', req: true, type: 'email', ac: 'email' }, { id: 'phone', label: 'Phone', sum: 'Phone', ...OPT, type: 'tel', ac: 'tel' }, { id: 'country', label: 'Country', sum: 'Country', ...OPT, ac: 'country-name' }] },
      { id: 'notify', k: 'About you', sum: 'Tell them by', q: 'How should I tell you about a new test?', ...one([['Email'], ['Text message'], ['WhatsApp']], true), consent: 'I agree to get messages from Issa when something is ready to test. I can stop them any time.' },
    ],
  };
  const support = {
    type: 'support', title: 'Get support', subject: a => `Support: ${a.product || 'general'} (${a.name || 'a user'})`,
    intro: 'Hi Issa,\n\nI need help.\n',
    done: ["Thanks. I'll get back to you soon.", 'Your email app opened with your message. Press send there so it reaches me.'],
    doneApi: ["Thanks. I'll get back to you soon.", 'Your message reached me, and a copy is on its way to your inbox.'],
    steps: [
      { id: 'product', k: 'Support', sum: 'Product', q: 'What do you need help with?', ...one([['Overlink'], ['PocketLM'], ['TradeLabs'], ['Licht'], ['A project I built for you'], ['Something else']], true) },
      { id: 'kind', k: 'Support', sum: 'Kind', q: 'What is it?', ...one([['Something is broken', 'An error, a crash, or it does the wrong thing'], ['A question', 'How do I…?'], ['An idea', 'Something it should do']]) },
      { id: 'msg', k: 'Support', q: 'Tell me what happened.', hint: 'What did you do, what did you expect, and what happened instead?', type: 'fields', fields: [{ id: 'message', label: 'Your message', sum: 'Message', area: true, req: true }, { id: 'steps', label: 'Steps to make it happen again', sum: 'Steps', area: true, ...OPT, ph: '1. Open …\n2. Click …\n3. …' }] },
      { id: 'setup', k: 'Support', q: 'Your setup', hint: 'Optional, but it helps me find the problem faster.', type: 'fields', fields: [{ id: 'device', label: 'Device and system', sum: 'Device', ...OPT, ph: 'For example: Windows 11 laptop' }, { id: 'version', label: 'App version', sum: 'Version', ...OPT }, { id: 'link', label: 'Link to a screenshot or recording', sum: 'Screenshot link', ...OPT, type: 'url', ph: 'https://' }] },
      { id: 'you', k: 'About you', q: 'How can I reach you?', type: 'fields', fields: [{ id: 'name', label: 'Your name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'Email', sum: 'Email', req: true, type: 'email', ac: 'email' }] },
    ],
  };
  const book = {
    type: 'book', title: 'Book a call', api: true, subject: a => `Call request from ${a.name || 'a visitor'}`,
    intro: '', done: ['', ''],
    doneApi: ['Your call is booked.', "The calendar invite is in your inbox. I'll send you the video call link before we talk."],
    steps: [
      { id: 'slot', k: 'A free 15-minute call', sum: 'Time', q: 'Pick a time that suits you.', type: 'slots' },
      { id: 'topic', k: 'About the call', q: 'What would you like to talk about?', type: 'fields', fields: [{ id: 'topic', label: 'Topic', sum: 'Topic', area: true, req: true, ph: 'For example: I want a booking website for my studio and need a price.' }] },
      { id: 'you', k: 'About you', q: 'Who are you?', hint: 'The calendar invite goes to this email.', type: 'fields', fields: [{ id: 'name', label: 'Your name', sum: 'Name', req: true, ac: 'name' }, { id: 'email', label: 'Email', sum: 'Email', req: true, type: 'email', ac: 'email' }, { id: 'company', label: 'Company', sum: 'Company', ...OPT, ac: 'organization' }, { id: 'phone', label: 'Phone', sum: 'Phone', ...OPT, type: 'tel', ac: 'tel' }] },
    ],
  };
  return { lang: 'en', ui, project, review, tester, support, book };
})();
