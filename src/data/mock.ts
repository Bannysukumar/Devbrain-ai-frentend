export const testimonials = [
  {
    quote: 'DevBrain AI cut our onboarding time in half. New devs find answers in one place.',
    author: 'Sarah Chen',
    role: 'Engineering Lead',
    company: 'TechCorp',
    avatar: 'SC',
  },
  {
    quote: 'Unified search across docs, code, and issues is a game-changer for our team.',
    author: 'Marcus Johnson',
    role: 'Senior Developer',
    company: 'BuildStack',
    avatar: 'MJ',
  },
  {
    quote: 'AI chat with citations gives us confidence. We know exactly where answers come from.',
    author: 'Elena Rodriguez',
    role: 'DevOps Lead',
    company: 'CloudScale',
    avatar: 'ER',
  },
]

export const features = [
  {
    title: 'Unified Search',
    description: 'Search across documentation, code repos, issues, and chat logs in one place.',
    icon: '🔍',
  },
  {
    title: 'AI Chat with Citations',
    description: 'Get answers grounded in your knowledge base with traceable sources.',
    icon: '💬',
  },
  {
    title: 'Source-based Knowledge',
    description: 'Connect any tool: GitHub, Confluence, Slack, and more.',
    icon: '📚',
  },
  {
    title: 'Team Onboarding',
    description: 'Accelerate onboarding with knowledge cards and curated resources.',
    icon: '🚀',
  },
]

export const howItWorks = [
  { step: 1, title: 'Connect sources', description: 'Add your docs, repos, and tools. We index and sync.' },
  { step: 2, title: 'Search & chat', description: 'Ask questions or search. Get answers with citations.' },
  { step: 3, title: 'Share knowledge', description: 'Create cards and share with your team.' },
]

export const team = [
  { name: 'Alex Kim', role: 'Founder & CEO', avatar: 'AK' },
  { name: 'Jordan Lee', role: 'CTO', avatar: 'JL' },
  { name: 'Sam Taylor', role: 'Head of Product', avatar: 'ST' },
]

/* Unsplash (free to use): https://unsplash.com */
export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  search: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  code: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
  blog1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  blog2: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  blog3: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  contactMap: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
}

export const blogPosts = [
  { slug: 'unified-knowledge-for-teams', title: 'Why Unified Knowledge Matters for Dev Teams', excerpt: 'How fragmented tools slow down development and what to do about it.', author: 'Alex Kim', date: '2024-01-15', category: 'Product', cover: IMAGES.blog1 },
  { slug: 'ai-citations-trust', title: 'Building Trust in AI Answers with Citations', excerpt: 'Why traceability is essential for enterprise AI adoption.', author: 'Jordan Lee', date: '2024-01-10', category: 'Engineering', cover: IMAGES.blog2 },
  { slug: 's4-fragmentation', title: 'Solving S4: Fragmentation of Technical Knowledge', excerpt: 'Our approach to unifying docs, code, issues, and chats.', author: 'Sam Taylor', date: '2024-01-05', category: 'Vision', cover: IMAGES.blog3 },
]

export const resources = [
  { title: 'Getting Started Guide', description: 'Set up your first sources in minutes.', type: 'Guide', href: '/resources', icon: '📖' },
  { title: 'API Reference', description: 'Integrate DevBrain AI with your tools.', type: 'Documentation', href: '/resources', icon: '📚' },
  { title: 'Hackathon Demo Guide', description: 'Quick demo flow for judges and stakeholders.', type: 'Demo', href: '/resources#demo', icon: '🎬' },
  { title: 'FAQs', description: 'Common questions and answers.', type: 'Support', href: '/contact', icon: '❓' },
]

export const screenshotItems = [
  { title: 'Unified Dashboard', image: IMAGES.dashboard },
  { title: 'Semantic Search', image: IMAGES.search },
  { title: 'Code & Docs', image: IMAGES.code },
]

export const pricingPlans = [
  { name: 'Free', price: '$0', period: 'forever', description: 'For individuals and small teams.', features: ['Up to 3 sources', '1,000 documents', 'Community support'], cta: 'Start Free', highlighted: false },
  { name: 'Pro', price: '$29', period: '/mo', description: 'For growing teams.', features: ['Unlimited sources', '50K documents', 'Email support', 'Priority sync'], cta: 'Start Pro', highlighted: true },
  { name: 'Team', price: '$99', period: '/mo', description: 'For organizations.', features: ['Everything in Pro', 'SSO', 'Audit logs', 'Dedicated support'], cta: 'Contact Sales', highlighted: false },
]
