export interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  time: string;
  readTime: string;
  imageUrl: string;
  body: string[];
  featured?: boolean;
  premium?: boolean;
}

export const allArticles: Article[] = [
{
  id: '1',
  category: 'AI',
  title:
  'Exclusive: OpenAI announce their brand new state-of-the-art web browser',
  excerpt:
  'This comes amid an intensified battle with Google in the AI race, marking a significant shift in how users will interact with the web.',
  author: 'Dickson Alexander',
  authorRole: 'Senior Tech Editor',
  time: '8 hours ago',
  readTime: '5 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  body: [
  'OpenAI has officially announced its entry into the browser market, a move that signals a direct challenge to Google\'s dominance. The new browser, tentatively named "Atlas," integrates the company\'s advanced language models directly into the rendering engine, promising a web experience that is fundamentally more intelligent and context-aware than anything currently available.',
  'Sources close to the development indicate that Atlas will not just render pages but understand them. Users will be able to ask complex questions about the content they are viewing, summarize long articles instantly, and even generate code snippets directly from documentation pages without leaving the browser interface.',
  '"This is not just a browser; it is an agent," said Sam Altman during the press briefing. "We are reimagining the window through which humanity accesses information. The era of static web pages is ending, and the era of the intelligent web is beginning."',
  "The announcement has sent shockwaves through the tech industry, with Alphabet's stock dipping slightly in after-hours trading. Google has been scrambling to integrate Gemini into Chrome, but OpenAI's clean-slate approach may offer a more cohesive user experience. The battle for the browser is no longer just about speed or privacy; it is about intelligence."],

  featured: true,
  premium: true
},
{
  id: '2',
  category: 'Featured',
  title: 'CRDB Sign a $500 million deal with American companies',
  excerpt:
  "Marking a remarkable feat for Tanzania's largest bank, this deal opens new avenues for cross-border trade and investment.",
  author: 'Dickson Alexander',
  authorRole: 'Senior Tech Editor',
  time: '8 hours ago',
  readTime: '4 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
  body: [
  "CRDB Bank Plc has secured a landmark $500 million financing deal with a consortium of American investors, a move set to significantly boost the bank's lending capacity to small and medium-sized enterprises (SMEs) across East Africa. The agreement was signed yesterday in Washington D.C., attended by high-ranking officials from both nations.",
  'The funds are earmarked for key sectors including agriculture, manufacturing, and technology. "This partnership is a testament to the confidence international investors have in the Tanzanian economy," said CRDB CEO Abdulmajid Nsekela. "We are committed to channeling these resources to drive sustainable growth and innovation."',
  'Analysts predict this injection of capital will lower interest rates for local businesses and stimulate job creation. It also highlights the growing interest of US capital in African markets, particularly in stable economies with strong growth potential like Tanzania.'],

  featured: true,
  premium: true
},
{
  id: '3',
  category: 'Latest roundup',
  title:
  'Nala, a fintech company founded by Tanzanian, Benjamin Fernandez expands business to the United States',
  excerpt:
  'The YC-backed startup is now enabling payments from the US to Africa, completing a critical loop in the remittance corridor.',
  author: 'Dickson Alexander',
  authorRole: 'Senior Tech Editor',
  time: '8 hours ago',
  readTime: '3 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1553729459-uj1ef3a64261?w=800&q=80',
  body: [
  'Nala, the Tanzanian fintech startup that has taken the remittance world by storm, has officially launched its services in the United States. This expansion allows the Tanzanian diaspora in the US to send money back home instantly and at a fraction of the cost charged by traditional providers.',
  'Founder Benjamin Fernandez described the launch as a personal milestone. "We started Nala to solve a problem we faced ourselves—the high cost and friction of sending money to Africa. Expanding to the US, the largest remittance source market in the world, is a dream come true."',
  'The company plans to use this foothold to launch business banking products later this year, aiming to become the operating system for trade between Africa and the West.'],

  featured: true
},
{
  id: '4',
  category: 'Telecom',
  title: 'Vodacom Tanzania launches 5G services in Dodoma',
  excerpt:
  'Promising high-speed connectivity for government institutions and boosting efficiency in public service delivery.',
  author: 'Sarah Mushi',
  authorRole: 'Telecom Analyst',
  time: '2 hours ago',
  readTime: '3 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  body: [
  "Vodacom Tanzania has officially switched on its 5G network in Dodoma, the capital city, marking a significant step in the country's digital transformation journey. The launch ceremony was attended by the Minister of Information, Communication and Information Technology.",
  '"5G is not just about faster internet; it is an enabler of the digital economy," said the Vodacom Managing Director. "With this technology, we are paving the way for smart government services, telemedicine, and advanced agricultural solutions."',
  'The rollout will initially cover key government ministries and the University of Dodoma, with plans to expand to residential areas by the end of the year.']

},
{
  id: '5',
  category: 'Agri-Tech',
  title: 'Arusha-based startup "KilimoSmart" raises seed funding',
  excerpt:
  'By connecting smallholder farmers directly to export markets via a mobile app, KilimoSmart aims to reduce post-harvest losses by 40%.',
  author: 'John Kavishe',
  authorRole: 'Agri-Tech Reporter',
  time: '5 hours ago',
  readTime: '4 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
  body: [
  'KilimoSmart, an Arusha-based agritech startup, has raised $1.2 million in seed funding to scale its digital supply chain platform. The round was led by a consortium of impact investors focused on African agriculture.',
  'The platform uses mobile technology to connect avocado and spice farmers directly with European buyers, bypassing middlemen who often take the lion\'s share of profits. "We are putting power back in the hands of the farmer," said founder Grace Mwaipopo.',
  'With the new funding, KilimoSmart plans to build cold storage facilities in key production zones to further reduce post-harvest losses.']

},
{
  id: '6',
  category: 'E-Government',
  title:
  'Tanzania Revenue Authority unveils new AI-powered tax filing system',
  excerpt:
  'The new portal uses machine learning to auto-populate forms and predict tax obligations, reducing the time spent on filing by half.',
  author: 'Dickson Alexander',
  authorRole: 'Senior Tech Editor',
  time: '12 hours ago',
  readTime: '5 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  body: [
  'The Tanzania Revenue Authority (TRA) has launched a revamped tax filing portal powered by artificial intelligence. The system is designed to simplify compliance for small and medium enterprises (SMEs), a sector that has historically struggled with complex tax codes.',
  'Using historical data and machine learning algorithms, the portal can now auto-populate tax returns and flag potential errors before submission. "Our goal is to make paying taxes as easy as buying airtime," said the Commissioner General.',
  'Early pilots show that the system reduces the time required to file VAT returns by over 50%, a massive efficiency gain for the business community.']

},
{
  id: '7',
  category: 'Innovation',
  title: 'Silicon Zanzibar: How the island is attracting global tech talent',
  excerpt:
  'With tax incentives and a growing ecosystem of co-working spaces in Stone Town, Zanzibar is positioning itself as the next tech hub of Africa.',
  author: 'Amina Juma',
  authorRole: 'Feature Writer',
  time: '1 day ago',
  readTime: '6 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1534234828563-025c93f3fdae?w=800&q=80',
  body: [
  'Stone Town is known for its winding alleys and historic architecture, but a new kind of visitor is walking its streets: the digital nomad. The "Silicon Zanzibar" initiative, launched by the revolutionary government, is successfully attracting tech talent from across the globe.',
  'Offering a specialized visa, tax breaks for tech companies, and high-speed internet infrastructure, the island is pitching itself as the perfect base for remote work in Africa. "We want to be the bridge between African talent and global markets," said the Minister of Investment.',
  'Co-working spaces like "The Train\'s House" are already buzzing with developers from Berlin, Lagos, and London, collaborating on projects that span continents.']

},
{
  id: '8',
  category: 'Fintech',
  title: 'Bank of Tanzania issues new guidelines for digital lenders',
  excerpt:
  'The regulatory framework comes after a surge in unregulated lending apps, ensuring that borrower data is handled with strict confidentiality.',
  author: 'Dickson Alexander',
  authorRole: 'Senior Tech Editor',
  time: '1 day ago',
  readTime: '4 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  body: [
  'The Bank of Tanzania (BoT) has issued comprehensive guidelines for digital lenders to curb predatory practices and protect consumer data. The new rules require all digital credit providers to be licensed and to adhere to strict data privacy standards.',
  'This move comes in response to public outcry over aggressive debt collection tactics used by some unregulated apps. "Innovation cannot come at the expense of consumer dignity," stated the BoT Governor.',
  'Fintech associations have welcomed the move, stating that clear regulations will weed out bad actors and build trust in the digital financial ecosystem.']

},
{
  id: '9',
  category: 'AI',
  title: "Dar es Salaam's First AI Research Lab Opens Doors",
  excerpt:
  'The University of Dar es Salaam partners with global tech giants to establish a cutting-edge artificial intelligence research facility.',
  author: 'Baraka Mwangi',
  authorRole: 'Tech Reporter',
  time: '2 days ago',
  readTime: '4 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  body: [
  'The University of Dar es Salaam (UDSM) has inaugurated its first dedicated Artificial Intelligence Research Lab. The facility, funded by a partnership with Google and local telecom operators, aims to train the next generation of Tanzanian data scientists.',
  'The lab will focus on applying AI to local challenges, such as predicting crop yields, optimizing traffic flow in Dar es Salaam, and improving Swahili natural language processing models.',
  '"We are not just consumers of technology; we must be creators," said the Vice Chancellor. "This lab gives our students the tools to build solutions for Tanzania, by Tanzania."']

},
{
  id: '10',
  category: 'Infrastructure',
  title:
  "The Dar-Bagamoyo Tech Corridor: Tanzania's Answer to Silicon Savannah",
  excerpt:
  'New infrastructure projects are linking the commercial capital to the historic port town, creating a belt of innovation and industry.',
  author: 'Fatma Hassan',
  authorRole: 'Infrastructure Correspondent',
  time: '2 days ago',
  readTime: '5 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
  body: [
  'The expansion of the Bagamoyo road and the planned port construction are laying the groundwork for a new economic corridor. Dubbed the "Tech Corridor," the zone between Dar es Salaam and Bagamoyo is attracting manufacturing and technology firms.',
  'The government has designated special economic zones along the route, offering incentives for tech assembly plants and data centers. "Connectivity is the backbone of the modern economy," said the Minister of Works.',
  'With the new rapid transit bus lines also extending in this direction, the corridor is set to become a vibrant hub of activity, easing congestion in the city center.']

},
{
  id: '11',
  category: 'Clean Energy',
  title: "Zanzibar's Solar Microgrid Project Powers 15,000 Homes",
  excerpt:
  'A groundbreaking renewable energy initiative brings reliable electricity to rural communities across the archipelago for the first time.',
  author: 'Fatma Hassan',
  authorRole: 'Energy Reporter',
  time: '3 days ago',
  readTime: '3 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  body: [
  'A network of solar microgrids has gone live across the smaller islands of the Zanzibar archipelago, bringing 24/7 electricity to over 15,000 homes that were previously off the grid. The project was executed by a local renewable energy startup with funding from the World Bank.',
  'The impact has been immediate. "We can now study at night and keep our shops open later," said a resident of Pemba. "It has changed our lives."',
  'The microgrids use smart metering technology, allowing residents to pay for power using mobile money in small, affordable increments.']

},
{
  id: '12',
  category: 'Policy & Tech',
  title:
  "Tanzania's Digital Economy Act 2026: What Every Startup Founder Needs to Know",
  excerpt:
  'New legislation aims to create a more favorable environment for tech companies while addressing data sovereignty and consumer protection.',
  author: 'Dickson Alexander',
  authorRole: 'Senior Tech Editor',
  time: '3 days ago',
  readTime: '7 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
  body: [
  "Parliament has passed the Digital Economy Act 2026, a sweeping piece of legislation designed to modernize Tanzania's legal framework for the digital age. The Act covers everything from electronic signatures to data localization requirements.",
  'Key provisions include tax holidays for startups in their first three years and the recognition of digital assets as property. However, it also imposes stricter data residency rules, requiring sensitive personal data to be stored on servers within Tanzania.',
  'Legal experts advise startup founders to review their compliance strategies immediately. "This is a game-changer," said a partner at a leading corporate law firm. "It brings clarity, but also new responsibilities."']

},
{
  id: '13',
  category: 'Venture Capital',
  title: 'Sahara Ventures Closes $25M Fund III',
  excerpt:
  "Tanzania's leading venture capital firm targets seed and pre-seed investments in fintech, healthtech, and agritech across the region.",
  author: 'Amina Juma',
  authorRole: 'Finance Reporter',
  time: '4 days ago',
  readTime: '4 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
  body: [
  'Sahara Ventures has announced the final close of its third fund at $25 million, exceeding its initial target. The fund will focus on early-stage startups in East Africa that are solving "real economy" problems.',
  '"We are looking for founders who are building for the African context," said the Managing Partner. "Copy-paste models from Silicon Valley don\'t work here. We want indigenous innovation."',
  'The firm has already made its first two investments from the new fund: a logistics platform in Dar es Salaam and a telemedicine startup in Nairobi.']

},
{
  id: '14',
  category: 'AI',
  title: 'How Tanzanian Farmers Are Using AI-Powered Crop Disease Detection',
  excerpt:
  'A locally-built mobile app leveraging computer vision helps smallholder farmers identify and treat crop diseases before they spread.',
  author: 'Baraka Mwangi',
  authorRole: 'Tech Reporter',
  time: '4 days ago',
  readTime: '5 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
  body: [
  'A new app developed by students at the Nelson Mandela African Institution of Science and Technology is helping farmers fight crop diseases using just their smartphones. The app uses AI to analyze photos of plant leaves and diagnose diseases with 95% accuracy.',
  'Once a disease is identified, the app provides treatment recommendations in Swahili. "It is like having an agricultural extension officer in your pocket," said a farmer in Arusha.',
  'The project has received support from the Ministry of Agriculture and is being rolled out to extension officers nationwide.']

},
{
  id: '15',
  category: 'Fintech',
  title: 'Bank of Tanzania Greenlights Digital Banking Licenses',
  excerpt:
  "The central bank's decision marks a historic shift toward digital-first banking in the country, opening doors for fintech innovation.",
  author: 'Fatma Hassan',
  authorRole: 'Finance Reporter',
  time: '5 days ago',
  readTime: '4 min read',
  imageUrl:
  'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80',
  body: [
  'In a move to boost financial inclusion, the Bank of Tanzania has issued its first set of digital banking licenses. These licenses allow companies to operate as banks without physical branches, lowering the cost of operations and, theoretically, banking fees.',
  'Three companies have been granted provisional approval. This opens the door for neobanks to compete directly with traditional lenders for deposits and loans.',
  '"This is the future of banking," said a fintech analyst. "It will force traditional banks to innovate and improve their digital offerings."']

}];


export function getArticleById(id: string): Article | undefined {
  return allArticles.find((article) => article.id === id);
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'All') return allArticles;
  return allArticles.filter((article) => article.category === category);
}

export function getFeaturedArticles(): Article[] {
  return allArticles.filter((article) => article.featured);
}

export function getLatestArticles(limit: number = 4): Article[] {
  // Exclude featured ones to avoid duplication if needed, or just return the most recent non-featured
  // For simplicity, just return the ones that aren't the top 3 featured ones used in Hero
  return allArticles.slice(3, 3 + limit);
}