import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { HashtagsBanner } from "@/components/hashtags-banner"

type Topic = {
  title: string;
  description: string;
  difficulty: string;
};

type SubjectData = {
  title: string;
  description: string;
  image: string;
  topics: Topic[];
};

const subjectsData: Record<string, SubjectData> = {
  "labor-law": {
    title: "LABOR LAW",
    description: "Understand the rules that govern employment, workers' rights, and employer responsibilities—key knowledge to navigate the workplace and excel in the bar exam.",
    image: "/labor-law-bg.png",
    topics: [
      {
        title: "LABOR STANDARDS",
        description: "Master the laws and regulations that protect workers' rights, set fair wages, and ensure safe working conditions—essential for both the bar exam and real-world practice.",
        difficulty: "Medium"
      },
      {
        title: "TERMINATION OF EMPLOYMENT",
        description: "Learn the legal grounds, procedures, and protections surrounding employee dismissal to ensure fair and lawful practices.",
        difficulty: "Medium"
      },
      {
        title: "LABOR RELATIONS",
        description: "Explore the dynamics between employers, employees, and unions, including rights, negotiations, and dispute resolution.",
        difficulty: "Medium"
      },
      {
        title: "GENERAL PRACTICES",
        description: "Understand everyday workplace rules, duties, and employer-employee obligations that shape compliant and efficient operations.",
        difficulty: "Medium"
      },
      {
        title: "RECRUITMENT & PLACEMENT",
        description: "Master the legal standards for hiring, placement, and workforce management to ensure fairness and compliance.",
        difficulty: "Medium"
      },
      {
        title: "SOCIAL LEGISLATION",
        description: "Get familiar with laws promoting employee welfare, benefits, and social protection programs essential for workers' rights.",
        difficulty: "Medium"
      }
    ]
  },
  "political-law": {
    title: "POLITICAL LAW",
    description: "Study the structure of government, constitutional principles, and the limits of state power in relation to individual rights.",
    image: "/gavel-bg.svg",
    topics: []
  },
  "civil-law": {
    title: "CIVIL LAW",
    description: "Learn about the legal relationships between individuals, encompassing persons, family relations, property, and obligations.",
    image: "/gavel-bg.svg",
    topics: []
  },
  "criminal-law": {
    title: "CRIMINAL LAW",
    description: "Master the revised penal code, understanding crimes, public offenses, and their corresponding penalties under the law.",
    image: "/gavel-bg.svg",
    topics: []
  },
  "commercial-law": {
    title: "COMMERCIAL LAW",
    description: "Understand the legal frameworks governing commerce, trade, corporate organizations, and negotiable instruments.",
    image: "/gavel-bg.svg",
    topics: []
  },
  "remedial-law": {
    title: "REMEDIAL LAW",
    description: "Study the rules of procedure, evidence, and court jurisdiction governing civil and criminal actions.",
    image: "/gavel-bg.svg",
    topics: []
  },
  "taxation-law": {
    title: "TAXATION LAW",
    description: "Explore the principles of tax code, revenue collection, and the power of the state to impose financial charges.",
    image: "/gavel-bg.svg",
    topics: []
  },
  "legal-ethics-law": {
    title: "LEGAL ETHICS",
    description: "Focus on the code of professional responsibility, judicial ethics, and practical exercises essential for future lawyers.",
    image: "/gavel-bg.svg",
    topics: []
  }
};

export default async function SubjectDetailPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params;
  const slug = params.slug;
  const data = subjectsData[slug];

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col bg-navy min-h-[500px] overflow-hidden pt-24 pb-12">
        {/* Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-[65%] lg:w-[55%] pointer-events-none z-0">
          <Image
            src={data.image}
            alt={`${data.title} Background`}
            fill
            className="object-cover object-right opacity-80"
            priority
          />
          {/* Soft gradient mask to blend the image seamlessly into the solid navy background */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 z-10">
          <div className="max-w-3xl pt-20 pb-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gold tracking-tight leading-[1.1] mb-6">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </section>

      {/* Hashtags Banner */}
      <HashtagsBanner />

      {/* Topics Section */}
      <section className="flex-1 bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <header className="mb-10">
            <h2 className="text-4xl font-black text-navy uppercase tracking-tight mb-2">TOPICS</h2>
            <p className="text-lg text-muted-foreground font-light">Select a topic to view historical questions</p>
          </header>

          {/* Topics List */}
          <div className="flex flex-col gap-6">
            {data.topics.length > 0 ? (
              data.topics.map((topic, index) => (
                <div 
                  key={index} 
                  className="group relative flex flex-col md:flex-row bg-navy rounded-[4px] overflow-hidden shadow-md transition-all duration-300 min-h-[140px]"
                >
                  {/* Subtle Background Styling per User Instructions (No image) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/90 z-0 pointer-events-none" />

                  <div className="relative z-10 flex-1 flex flex-col justify-center p-8 pr-12 xl:pl-12">
                    <h3 className="text-[28px] font-black text-gold uppercase tracking-tight mb-3 group-hover:text-gold/90 transition-colors leading-none">
                      {topic.title}
                    </h3>
                    <p className="text-white/70 font-light leading-relaxed text-[15px] max-w-4xl">
                      {topic.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col justify-center items-start md:items-end p-8 md:w-64 mt-4 md:mt-0 xl:pr-12">
                    <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-gold uppercase group/btn hover:text-gold/80 transition-colors">
                      START REVIEWING
                      <div className="flex items-center -space-x-1.5 opacity-90 transition-transform group-hover/btn:translate-x-1">
                        <ChevronRight className="size-4" />
                        <ChevronRight className="size-4" />
                      </div>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
                <p className="text-2xl text-muted-foreground font-light mb-2">Topics are being prepared for {data.title}.</p>
                <p className="text-base text-muted-foreground/60">Check back later for updates on this subject.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
