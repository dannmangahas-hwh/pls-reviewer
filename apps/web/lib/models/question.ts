import mongoose, { Schema, Document, Model } from "mongoose"

// 1. Define the TypeScript Interface for the Question Document
export interface IQuestion extends Document {
  unique_id: string
  year: number
  subject_raw: string
  subject_normalized: string
  subject_slug: string
  question_text: string
  suggested_answers: string[]
  syllabus_topic?: string
  syllabus_topic_slug?: string
  syllabus_subtopic?: string
  syllabus_subtopic_slug?: string
  syllabus_path?: string[]
  classification_confidence?: number
  createdAt?: Date
  updatedAt?: Date
}

// 2. Create the Mongoose Schema
const QuestionSchema = new Schema<IQuestion>(
  {
    unique_id: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    subject_raw: { type: String, required: true },
    subject_normalized: { type: String, required: true },
    subject_slug: { type: String, required: true },
    question_text: { type: String, required: true },
    suggested_answers: { type: [String], default: [] },
    
    // AI Classification Fields (added during Phase 1)
    syllabus_topic: { type: String },
    syllabus_topic_slug: { type: String },
    syllabus_subtopic: { type: String },
    syllabus_subtopic_slug: { type: String },
    syllabus_path: { type: [String] },
    classification_confidence: { type: Number },
  },
  {
    // Automatically manage createdAt and updatedAt fields
    timestamps: true,
  }
)

// 3. Export the Model
// In Next.js, models are often re-compiled during hot-reloading.
// We must check if the model already exists in mongoose.models before creating a new one.
export const Question: Model<IQuestion> = 
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema)
