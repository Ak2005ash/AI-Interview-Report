import React,{useState, useEffect} from 'react'
import "../style/interview.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate, useParams } from 'react-router'



const Interview = () => {

    const { report: newReport, getReportById, loading } = useInterview()
    const {interviewId} = useParams()

    useEffect(()=>{
        if(interviewId) {
            getReportById(interviewId)
        }
    },[interviewId])
    
    const data = newReport ?? {}
    const technicalQuestions = Array.isArray(data.technicalQuestions) ? data.technicalQuestions : []
    const behavioralQuestions = Array.isArray(data.behavioralQuestions) ? data.behavioralQuestions : []
    const skillGaps = Array.isArray(data.skillGaps) ? data.skillGaps : []
    const preparationPlan = Array.isArray(data.preparationPlan) ? data.preparationPlan : []
    const matchScore = Number.isFinite(Number(data.matchScore))
        ? Math.min(100, Math.max(0, Number(data.matchScore)))
        : null

    const renderQuestions = (questions, type) => (
        questions.length > 0 ? (
            <div className="question-list">
                {questions.map((item, index) => (
                    <details className="question-dropdown" key={`${type}-${index}`} open={index === 0}>
                        <summary>
                            <span className="question-number">{String(index + 1).padStart(2, "0")}</span>
                            <span className="question-title">{item.question}</span>
                            <svg className="dropdown-chevron" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </summary>
                        <div className="question-details">
                            {item.intention && (
                                <div className="question-detail">
                                    <h3>Intention</h3>
                                    <p>{item.intention}</p>
                                </div>
                            )}
                            {item.answer && (
                                <div className="question-detail model-answer">
                                    <h3>Model answer</h3>
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    </details>
                ))}
            </div>
        ) : (
            <p className="empty-section">Questions will appear here when they are available.</p>
        )
    )

    return (
        <main className="interview-report">
            <div className="report-layout">
                <nav className="report-navigation" aria-label="Interview report sections">
                    <span className="navigation-label">Sections</span>
                    <a className="navigation-link active" href="#technical-questions">
                        <span className="navigation-icon" aria-hidden="true">‹›</span>
                        Technical Questions
                    </a>
                    <a className="navigation-link" href="#behavioral-questions">
                        <span className="navigation-icon" aria-hidden="true">▱</span>
                        Behavioral Questions
                    </a>
                    <a className="navigation-link" href="#preparation-plan">
                        <span className="navigation-icon" aria-hidden="true">➤</span>
                        Road Map
                    </a>
                </nav>

                <div className="report-content">
                    <section className="report-section" id="technical-questions">
                        <div className="report-section-heading">
                            <h1>Technical Questions</h1>
                            <span className="question-count">{technicalQuestions.length} questions</span>
                        </div>
                        {renderQuestions(technicalQuestions, "technical")}
                    </section>

                    <section className="report-section" id="behavioral-questions">
                        <div className="report-section-heading">
                            <h2>Behavioral Questions</h2>
                            <span className="question-count">{behavioralQuestions.length} questions</span>
                        </div>
                        {renderQuestions(behavioralQuestions, "behavioral")}
                    </section>

                    <section className="report-section" id="preparation-plan">
                        <div className="report-section-heading">
                            <h2>Road Map</h2>
                            <span className="question-count">{preparationPlan.length} days</span>
                        </div>
                        {preparationPlan.length > 0 ? (
                            <ol className="roadmap-list">
                                {preparationPlan.map((day, index) => (
                                    <li className="roadmap-day" key={day._id ?? `day-${day.day ?? index}`}>
                                        <span className="day-marker">{day.day ?? index + 1}</span>
                                        <div className="roadmap-card">
                                            <span className="day-label">Day {day.day ?? index + 1}</span>
                                            <h3>{day.focus}</h3>
                                            {Array.isArray(day.tasks) && day.tasks.length > 0 && (
                                                <ul>
                                                    {day.tasks.map((task, taskIndex) => <li key={`task-${taskIndex}`}>{task}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="empty-section">Your preparation plan will appear here when it is available.</p>
                        )}
                    </section>
                </div>

                <aside className="report-sidebar">
                    <section className="match-score" aria-labelledby="match-score-heading">
                        <h2 id="match-score-heading">Match Score</h2>
                        {matchScore !== null ? (
                            <>
                                <div
                                    className="score-ring"
                                    role="img"
                                    aria-label={`${matchScore}% match score`}
                                    style={{ "--score-progress": `${matchScore * 3.6}deg` }}
                                >
                                    <span><strong>{matchScore}</strong><small>%</small></span>
                                </div>
                                <p className="score-caption">
                                    {matchScore >= 80 ? "Strong match for this role" : matchScore >= 60 ? "Good foundation for this role" : "Room to grow for this role"}
                                </p>
                            </>
                        ) : (
                            <p className="empty-section">Match score is not available.</p>
                        )}
                    </section>

                    <section className="skill-gaps" aria-labelledby="skill-gaps-heading">
                        <h2 id="skill-gaps-heading">Skill Gaps</h2>
                        {skillGaps.length > 0 ? (
                            <ul className="skill-list">
                                {skillGaps.map((item, index) => (
                                    <li key={`skill-${index}`} className={`skill-chip severity-${item.severity || "unspecified"}`}>
                                        {item.skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-skills">No skill gaps to show yet.</p>
                        )}
                    </section>
                </aside>
            </div>
        </main>
    )
}

export default Interview
