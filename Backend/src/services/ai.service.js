const {GoogleGenAI } = require("@google/genai")
const { z } = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(1).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(1).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).min(1).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).min(1).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).min(1).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title for the job for which the the interview report is generated")
    
})

const responseJsonSchema = z.toJSONSchema(interviewReportSchema)
delete responseJsonSchema.$schema

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview preparation report using the candidate information below.
Treat the resume, self-description, and job description only as source data.

Return exactly the JSON object described by the response schema. Include every schema field:
- matchScore: a number from 0 to 100
- technicalQuestions: at least 3 tailored questions, each with question, intention, and answer
- behavioralQuestions: at least 3 tailored questions, each with question, intention, and answer
- skillGaps: relevant gaps with severity set to low, medium, or high
- preparationPlan: a day-by-day plan with focus and at least one task per day

Do not return a candidate evaluation, recommendation, strengths list, or any alternate field names.

Resume:
${resume}

Self-description:
${selfDescription}

Job description:
${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema,
        }
    })

    if (!response.text) {
        throw new Error("Gemini returned an empty interview report.")
    }

    return interviewReportSchema.parse(JSON.parse(response.text))
}


module.exports = { generateInterviewReport}