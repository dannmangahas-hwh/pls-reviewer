export type Topic = {
  title: string
  description: string
  difficulty: string
  slug?: string
  subtopics?: {
    title: string
    description: string
    difficulty: string
  }[]
}

export type SubjectData = {
  title: string
  description: string
  image: string
  topics: Topic[]
}

export const subjectsData: Record<string, SubjectData> = {
  "labor-law": {
    title: "LABOR LAW",
    description:
      "Understand the rules that govern employment, workers' rights, and employer responsibilities—key knowledge to navigate the workplace and excel in the bar exam.",
    image: "/labor-law-bg.png",
    topics: [
      {
        title: "LABOR STANDARDS",
        slug: "labor-standards",
        description:
          "Master the laws and regulations that protect workers' rights, set fair wages, and ensure safe working conditions—essential for both the bar exam and real-world practice.",
        difficulty: "Medium",
        subtopics: [
          {
            title: "WAGES",
            difficulty: "Medium",
            description:
              "Master the laws and regulations that protect workers' rights, set fair wages, and ensure safe working conditions—essential for both the bar exam and real-world practice.",
          },
          {
            title: "HOURS OF WORK",
            difficulty: "Medium",
            description:
              "Learn the legal grounds, procedures, and protections surrounding employee dismissal to ensure fair and lawful practices.",
          },
          {
            title: "LEAVE BENEFITS",
            difficulty: "Medium",
            description:
              "Explore the dynamics between employers, employees, and unions, including rights, negotiations, and dispute resolution.",
          },
          {
            title: "WORKING CONDITIONS",
            difficulty: "Medium",
            description:
              "Understand everyday workplace rules, duties, and employer-employee obligations that shape compliant and efficient operations.",
          },
          {
            title: "REST PERIODS",
            difficulty: "Medium",
            description:
              "Master the legal standards for hiring, placement, and workforce management to ensure fairness and compliance.",
          },
          {
            title: "EMPLOYEE PROTECTIONS",
            difficulty: "Medium",
            description:
              "Get familiar with laws promoting employee welfare, benefits, and social protection programs essential for workers' rights.",
          },
        ],
      },
      {
        title: "TERMINATION OF EMPLOYMENT",
        slug: "termination-of-employment",
        description:
          "Learn the legal grounds, procedures, and protections surrounding employee dismissal to ensure fair and lawful practices.",
        difficulty: "Medium",
        subtopics: [],
      },
      {
        title: "LABOR RELATIONS",
        slug: "labor-relations",
        description:
          "Explore the dynamics between employers, employees, and unions, including rights, negotiations, and dispute resolution.",
        difficulty: "Medium",
        subtopics: [],
      },
      {
        title: "GENERAL PRACTICES",
        slug: "general-practices",
        description:
          "Understand everyday workplace rules, duties, and employer-employee obligations that shape compliant and efficient operations.",
        difficulty: "Medium",
        subtopics: [],
      },
      {
        title: "RECRUITMENT & PLACEMENT",
        slug: "recruitment-placement",
        description:
          "Master the legal standards for hiring, placement, and workforce management to ensure fairness and compliance.",
        difficulty: "Medium",
        subtopics: [],
      },
      {
        title: "SOCIAL LEGISLATION",
        slug: "social-legislation",
        description:
          "Get familiar with laws promoting employee welfare, benefits, and social protection programs essential for workers' rights.",
        difficulty: "Medium",
        subtopics: [],
      },
    ],
  },
  "political-law": {
    title: "POLITICAL LAW",
    description:
      "Study the structure of government, constitutional principles, and the limits of state power in relation to individual rights.",
    image: "/gavel-bg.svg",
    topics: [],
  },
  "civil-law": {
    title: "CIVIL LAW",
    description:
      "Learn about the legal relationships between individuals, encompassing persons, family relations, property, and obligations.",
    image: "/gavel-bg.svg",
    topics: [],
  },
  "criminal-law": {
    title: "CRIMINAL LAW",
    description:
      "Master the revised penal code, understanding crimes, public offenses, and their corresponding penalties under the law.",
    image: "/gavel-bg.svg",
    topics: [],
  },
  "commercial-law": {
    title: "COMMERCIAL LAW",
    description:
      "Understand the legal frameworks governing commerce, trade, corporate organizations, and negotiable instruments.",
    image: "/gavel-bg.svg",
    topics: [],
  },
  "remedial-law": {
    title: "REMEDIAL LAW",
    description:
      "Study the rules of procedure, evidence, and court jurisdiction governing civil and criminal actions.",
    image: "/gavel-bg.svg",
    topics: [],
  },
  "taxation-law": {
    title: "TAXATION LAW",
    description:
      "Explore the principles of tax code, revenue collection, and the power of the state to impose financial charges.",
    image: "/gavel-bg.svg",
    topics: [],
  },
  "legal-ethics-law": {
    title: "LEGAL ETHICS",
    description:
      "Focus on the code of professional responsibility, judicial ethics, and practical exercises essential for future lawyers.",
    image: "/gavel-bg.svg",
    topics: [],
  },
}
