export type WorkProject = {
  slug: string
  title: string
  detail: string
  intro: string
  image?: string
  imageAlt?: string
  tools: string[]
  note?: string
  milestones?: { period: string; text: string }[]
  website?: string
  source?: string
}

export const workProjects: WorkProject[] = [
  {
    slug: 'snappo-toolbox',
    title: 'Snappo',
    detail: 'Developer utilities in one interface',
    intro: 'Hash, format data, test regular expressions and work with color in one place.',
    image: '/images/snappo.png',
    imageAlt: 'Snappo developer toolbox landing page',
    tools: ['Vue', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'Turborepo', 'Cloudflare Pages'],
    website: 'https://snappo.me',
    source: 'https://github.com/noel-schmidt/snappo',
  },
  {
    slug: 'daturo',
    title: 'Daturo',
    detail: 'Transparent company data',
    intro: 'Company data brought together to make business decisions easier to understand.',
    image: '/images/daturo.png',
    imageAlt: 'Daturo company data product preview',
    tools: ['Nuxt 4', 'Tailwind CSS', 'Fastify', 'Sentry', 'RabbitMQ', 'Kubernetes'],
    note: 'Not continued',
  },
  {
    slug: 'tubelive',
    title: 'TubeLive',
    detail: 'Online radio for young people',
    intro: 'A youth radio station with Song Battle, shows and podcasts.',
    image: '/images/tubelive.webp',
    imageAlt: 'TubeLive online radio website',
    tools: ['Tailwind CSS', 'Nuxt 4', 'Fastify', 'nginx', 'GitLab', 'Docker', 'PostgreSQL'],
  },
  {
    slug: 'juka-radio',
    title: 'JUKA Radio',
    detail: 'Youth radio - website and IT lead',
    intro:
      'I launched the new JUKA Radio website in August 2021 and later led the IT team while helping coordinate applications.',
    tools: ['Nuxt 3', 'Tailwind CSS', 'mAirList', 'Express', 'PM2', 'TypeScript'],
    milestones: [
      {
        period: '2021',
        text: 'During the pandemic, I wanted a change of pace from radio work. I used my existing radio experience to contribute to IT and programming.',
      },
      {
        period: 'August 2021',
        text: 'The new JUKA Radio website went live. I took care of the complete implementation.',
      },
      {
        period: 'Late 2021',
        text: 'I took over the IT department and also contributed beyond IT, including leading the application process.',
      },
      {
        period: '2022',
        text: 'TubeLive, our second station, went live alongside a complete website relaunch. I also took on more team responsibilities with Gabriel and Gregor.',
      },
    ],
  },
]
