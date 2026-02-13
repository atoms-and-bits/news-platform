export interface Startup {
  id: number;
  name: string;
  sector: string;
  location: string;
  description: string;
  longDescription: string;
  website: string;
  founded: string;
  teamSize: string;
  funding: string;
  stage: string;
  logo: string;
  founders: {name: string;role: string;}[];
}

export const startups: Startup[] = [
{
  id: 1,
  name: 'Nala',
  sector: 'Fintech',
  location: 'Dar es Salaam / Remote',
  description:
  'Building the financial infrastructure for the next billion users. Enabling fast, reliable payments from the UK/US to Africa.',
  longDescription:
  'Nala is a Tanzanian fintech company that is building the financial rails for the next billion users. Starting as a local money transfer app, Nala has pivoted to become a global remittance powerhouse, enabling seamless payments from the UK, US, and EU to African countries. Their mission is to increase economic opportunity for Africans worldwide by reducing the cost and friction of sending money home.',
  website: 'https://nala.money',
  founded: '2018',
  teamSize: '50-100',
  funding: '$40M+',
  stage: 'Series A',
  logo: 'N',
  founders: [{ name: 'Benjamin Fernandez', role: 'Founder & CEO' }]
},
{
  id: 2,
  name: 'Ramani',
  sector: 'Supply Chain',
  location: 'Dar es Salaam',
  description:
  'Software for micro-distribution centers in Africa. Providing inventory management and financing for distributors.',
  longDescription:
  'Ramani is revolutionizing the supply chain in Africa by providing a cloud-based inventory management system and financing for micro-distribution centers. By digitizing the supply chain, Ramani brings transparency and efficiency to a sector that has traditionally relied on pen and paper. Their platform allows distributors to track inventory in real-time and access credit to grow their businesses.',
  website: 'https://ramani.io',
  founded: '2019',
  teamSize: '20-50',
  funding: '$32M',
  stage: 'Seed',
  logo: 'R',
  founders: [
  { name: 'John Osoro', role: 'CEO & Co-founder' },
  { name: 'Iain Usiri', role: 'CTO & Co-founder' },
  { name: 'Calvin Usiri', role: 'CPO & Co-founder' }]

},
{
  id: 3,
  name: 'Simusolar',
  sector: 'Clean Energy',
  location: 'Tanzania / Uganda',
  description:
  'Providing affordable, clean energy solutions for rural productive use, specializing in solar water pumps and fishing lights.',
  longDescription:
  'Simusolar provides clean energy solutions for productive use in rural East Africa. They specialize in solar-powered water pumps for irrigation and solar fishing lights for night fishing on Lake Victoria. By replacing diesel generators and kerosene lamps with solar technology, Simusolar helps farmers and fishermen increase their income while reducing their environmental impact.',
  website: 'https://simusolar.com',
  founded: '2014',
  teamSize: '50+',
  funding: '$5M+',
  stage: 'Series A',
  logo: 'S',
  founders: [{ name: 'Catherine Adelmann', role: 'Founder & CEO' }]
},
{
  id: 4,
  name: 'Swahilies',
  sector: 'Fintech',
  location: 'Dar es Salaam',
  description:
  'Enabling SMEs to accept digital payments seamlessly. The operating system for small businesses in Tanzania.',
  longDescription:
  'Swahilies is a fintech platform that enables small and medium-sized enterprises (SMEs) in Tanzania to accept digital payments. Their platform integrates with mobile money providers and banks, allowing businesses to manage transactions, track sales, and access financial services all in one place. Swahilies aims to be the operating system for African SMEs.',
  website: 'https://swahilies.com',
  founded: '2022',
  teamSize: '5-10',
  funding: '$500K',
  stage: 'Pre-Seed',
  logo: 'Sw',
  founders: [{ name: 'John Doe', role: 'Founder' }]
},
{
  id: 5,
  name: 'East Africa Fruits',
  sector: 'Agri-Tech',
  location: 'Dar es Salaam',
  description:
  'Formalizing the informal food supply chain by connecting smallholder farmers directly to retailers and hotels.',
  longDescription:
  'East Africa Fruits is a social enterprise that is formalizing the food supply chain in Tanzania. They connect smallholder farmers directly to retailers, hotels, and restaurants, eliminating middlemen and reducing post-harvest losses. By providing a reliable market for farmers and fresh produce for businesses, East Africa Fruits is improving food security and farmer livelihoods.',
  website: 'https://eastafricafruits.com',
  founded: '2014',
  teamSize: '100+',
  funding: '$8M+',
  stage: 'Series A',
  logo: 'E',
  founders: [{ name: 'Elia Timotheo', role: 'Founder & CEO' }]
},
{
  id: 6,
  name: 'MedPack',
  sector: 'Healthtech',
  location: 'Arusha',
  description:
  "Digital pharmacy platform delivering medication to patients' doorsteps and helping manage chronic conditions.",
  longDescription:
  "MedPack is a digital pharmacy platform that delivers medication directly to patients' doorsteps. They focus on helping patients with chronic conditions manage their medication through automated refills and reminders. MedPack is making healthcare more accessible and convenient for Tanzanians.",
  website: 'https://medpack.co.tz',
  founded: '2021',
  teamSize: '10-20',
  funding: '$1.5M',
  stage: 'Seed',
  logo: 'M',
  founders: [{ name: 'Dr. Jane Smith', role: 'Founder' }]
},
{
  id: 7,
  name: 'Tigo Pesa (Mixx)',
  sector: 'Fintech / Telecom',
  location: 'Dar es Salaam',
  description:
  "One of Tanzania's leading mobile money services, driving financial inclusion through innovative digital products.",
  longDescription:
  'Tigo Pesa is a leading mobile money service in Tanzania, operated by Tigo Tanzania (now part of the Axian Group). It has been a pioneer in interoperability and cross-border payments. The new "Mixx by Yas" brand targets the youth demographic with bundled digital services.',
  website: 'https://tigo.co.tz',
  founded: '2010',
  teamSize: '200+',
  funding: 'Corporate',
  stage: 'Established',
  logo: 'T',
  founders: []
},
{
  id: 8,
  name: 'Selcom',
  sector: 'Fintech',
  location: 'Dar es Salaam',
  description:
  'The backbone of digital payments in Tanzania, providing payment gateway services and infrastructure.',
  longDescription:
  'Selcom is a leading payment service provider in Tanzania, offering a wide range of payment solutions for businesses and consumers. They provide the infrastructure for bill payments, mobile banking, and card processing. Selcom is known for its reliability and extensive network of agents.',
  website: 'https://selcom.net',
  founded: '2003',
  teamSize: '200+',
  funding: 'Bootstrapped',
  stage: 'Growth',
  logo: 'Se',
  founders: [{ name: 'Sameer Hirji', role: 'Executive Director' }]
}];


export function getStartupById(id: number): Startup | undefined {
  return startups.find((s) => s.id === id);
}