import { connectToDatabase } from "../db"
import { Question, IQuestion } from "../models/question"

/**
 * Get the total count of questions in the database.
 */
export async function getTotalQuestionCount(): Promise<number> {
  await connectToDatabase()
  return Question.countDocuments()
}

/**
 * Fetch all questions for a specific subject (e.g., 'civil-law').
 */
export async function getQuestionsBySubject(subjectSlug: string): Promise<IQuestion[]> {
  await connectToDatabase()
  // Lean returns plain JS objects instead of Mongoose documents, which is faster and serializable for Next.js Server Components.
  return Question.find({ subject_slug: subjectSlug }).lean()
}

/**
 * Fetch all questions for a specific syllabus topic (e.g., 'family-relations').
 */
export async function getQuestionsByTopic(topicSlug: string): Promise<IQuestion[]> {
  await connectToDatabase()
  return Question.find({ syllabus_topic_slug: topicSlug }).lean()
}

/**
 * Fetch all questions for a specific syllabus subtopic (e.g., 'marriage').
 */
export async function getQuestionsBySubtopic(subtopicSlug: string): Promise<IQuestion[]> {
  await connectToDatabase()
  return Question.find({ syllabus_subtopic_slug: subtopicSlug }).lean()
}

/**
 * Aggregates question counts grouped by topic for a specific subject.
 * Useful for displaying the number of questions available in the UI topics list.
 */
export async function getTopicQuestionCounts(subjectSlug: string) {
  await connectToDatabase()
  
  const result = await Question.aggregate([
    { $match: { subject_slug: subjectSlug } },
    { 
      $group: { 
        _id: "$syllabus_topic_slug", 
        count: { $sum: 1 },
        title: { $first: "$syllabus_topic" } 
      } 
    },
    { $sort: { count: -1 } }
  ])
  
  return result.map(item => ({
    topicSlug: item._id,
    topicTitle: item.title,
    count: item.count
  }))
}

/**
 * Aggregates question counts grouped by subtopic for a specific topic.
 * Useful for displaying the number of questions available in the UI subtopics list.
 */
export async function getSubtopicQuestionCounts(topicSlug: string) {
  await connectToDatabase()
  
  const result = await Question.aggregate([
    { $match: { syllabus_topic_slug: topicSlug } },
    { 
      $group: { 
        _id: "$syllabus_subtopic_slug", 
        count: { $sum: 1 },
      } 
    }
  ])
  
  return result.reduce((acc, item) => {
    if (item._id) {
      acc[item._id] = item.count;
    }
    return acc;
  }, {} as Record<string, number>);
}
