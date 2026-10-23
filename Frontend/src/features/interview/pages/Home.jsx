import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your Interview plan...</h1>
            </main>
        )
    }


    return (
        <main className="interview-home">
            <header className="page-heading">
                <h1>AI <span>Interview Report</span> Generator</h1>
                <p>Generate a personalized interview report based on the role and your profile.</p>
            </header>

            <form className="interview-form">
                <section className="job-description-section" aria-labelledby="job-description-heading">
                    <div className="section-heading">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="3.5" y="7" width="17" height="13" rx="2" />
                                <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3.5 12h17M10 12v2h4v-2" />
                            </svg>
                            <h2 id="job-description-heading">Target Job Description</h2>
                        </div>
                        <span className="badge">Required</span>
                    </div>

                    <div className="job-description-field">
                        <label className="visually-hidden" htmlFor="jobDescription">Target job description</label>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            name="jobDescription"
                            id="jobDescription"
                            maxLength={5000}
                            placeholder={"Paste the full job description here...\ne.g. Junior Full Stack Developer requiring React, Node.js, MongoDB, REST APIs..."}
                        />
                        <span className="character-count" aria-hidden="true">0 / 5000 chars</span>
                    </div>
                </section>

                <section className="profile-section" aria-labelledby="profile-heading">
                    <div className="section-heading profile-heading">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-7A4.5 4.5 0 0 0 4 18.5V20M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                            </svg>
                            <h2 id="profile-heading">Your Profile</h2>
                        </div>
                    </div>

                    <div className="profile-content">
                        <div className="upload-heading">
                            <label htmlFor="resume">Upload Resume</label>
                            <span className="badge">Best Results</span>
                        </div>
                        <label className="upload-zone" htmlFor="resume">
                            <input ref={resumeInputRef} hidden type="file" name="resume" id="resume" accept=".pdf,.doc,.docx" />
                            <svg className="upload-icon" viewBox="0 0 32 32" aria-hidden="true">
                                <path d="M10.5 24H8a6 6 0 0 1-.6-12A9 9 0 0 1 24.8 10a7 7 0 0 1 .2 14h-2.5M16 27V16m-4 4 4-4 4 4" />
                            </svg>
                            <span className="upload-prompt">Click to upload or drag &amp; drop</span>
                            <span className="upload-hint">PDF or DOCX (Max 5MB)</span>
                        </label>

                        <div className="or-divider" aria-hidden="true"><span>OR</span></div>

                        <div className="self-description-field">
                            <label htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                name="selfDescription"
                                id="selfDescription"
                                placeholder="Briefly describe your experience, key skills, projects, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        <div className="info-message" role="note">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 11v5m0-8h.01" />
                            </svg>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized report.</p>
                        </div>
                    </div>
                </section>

                

                <footer className="form-footer">
                    <p>AI-Powered Report Generation <span aria-hidden="true">·</span> Approx 30s</p>
                    <button
                        onClick={handleGenerateReport}
                        className="generate-button" type="button">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m12 2 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6L2.5 9l6.6-1L12 2Z" />
                        </svg>
                        Generate My Interview Report
                    </button>
                </footer>
                 {/* Recent Reports list*/}
                {reports.length > 0 && (
                    <section className='recent-reports'>
                        <h2>My Recent Interview Plans</h2>
                        <ul className='reports-list'>
                            {reports.map(report => (
                                <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </form>
        </main>
    )
}

export default Home
