import syllabus from "../data/syllabus-2026.json"

export type Topic = {
  title: string
  description: string
  difficulty: string
  slug?: string
  subtopics?: {
    title: string
    description: string
    difficulty: string
    slug?: string
  }[]
}

export type SubjectData = {
  title: string
  description: string
  image: string
  topics: Topic[]
}

// 1. Define standard metadata for the 6 subjects
const subjectMetadata: Record<string, { title: string; description: string; image: string }> = {
  "political-law": {
    title: "POLITICAL LAW",
    description: "Study the structure of government, constitutional principles, and the limits of state power in relation to individual rights.",
    image: "/gavel-bg.svg",
  },
  "commercial-law": {
    title: "COMMERCIAL & TAXATION LAWS",
    description: "Understand the legal frameworks governing commerce, trade, corporate organizations, and the power of the state to impose taxes.",
    image: "/gavel-bg.svg",
  },
  "civil-law": {
    title: "CIVIL LAW",
    description: "Learn about the legal relationships between individuals, encompassing persons, family relations, property, and obligations.",
    image: "/gavel-bg.svg",
  },
  "labor-law": {
    title: "LABOR LAW",
    description: "Understand the rules that govern employment, workers' rights, and employer responsibilities—key knowledge to navigate the workplace.",
    image: "/labor-law-bg.png",
  },
  "criminal-law": {
    title: "CRIMINAL LAW",
    description: "Master the revised penal code, understanding crimes, public offenses, and their corresponding penalties under the law.",
    image: "/gavel-bg.svg",
  },
  "remedial-law": {
    title: "REMEDIAL & LEGAL ETHICS",
    description: "Study the rules of procedure, evidence, court jurisdiction, and the code of professional responsibility for lawyers.",
    image: "/gavel-bg.svg",
  },
}

interface SyllabusSubtopic {
  title: string
  slug: string
}

interface SyllabusTopic {
  title: string
  slug: string
  subtopics?: SyllabusSubtopic[]
}

// 2. Read and parse the syllabus dynamically
function loadSyllabusData(): Record<string, SubjectData> {
  try {
    const data: Record<string, SubjectData> = {}

    for (const subject of syllabus.subjects) {
      const slug = subject.slug
      const meta = subjectMetadata[slug as keyof typeof subjectMetadata]
      
      if (meta) {
        data[slug] = {
          title: meta.title,
          description: meta.description,
          image: meta.image,
          topics: subject.topics.map((t: SyllabusTopic) => ({
            title: t.title,
            slug: t.slug,
            description: `Review historical questions for ${t.title}.`,
            difficulty: "Medium",
            subtopics: t.subtopics?.map((sub: SyllabusSubtopic) => ({
              title: sub.title,
              slug: sub.slug,
              description: `Practice AI-classified bar questions regarding ${sub.title}.`,
              difficulty: "Medium",
            })) || [],
          })),
        }
      }
    }
    
    return data
  } catch {
    console.warn("Failed to load syllabus-2026.json. Falling back to empty object.")
    return {}
  }
}

// Export the dynamically generated subject data
export const subjectsData = loadSyllabusData()
