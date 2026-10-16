import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Page = 'home' | 'safety' | 'dashboard' | 'about'

type ScamReport = {
  id: number
  company: string
  jobTitle: string
  details: string
  date: string
}

const STORAGE_KEY = 'jobshield-reports'

function loadReports(): ScamReport[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? (parsed as ScamReport[]) : []
  } catch {
    return []
  }
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [reports, setReports] = useState<ScamReport[]>(loadReports)
  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [details, setDetails] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
    } catch {
      setMessage('Unable to save reports in this browser.')
    }
  }, [reports])

  function saveReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newReport: ScamReport = {
      id: Date.now(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      details: details.trim(),
      date: new Date().toLocaleDateString('en-IN'),
    }

    setReports((current) => [newReport, ...current])
    setCompany('')
    setJobTitle('')
    setDetails('')
    setMessage('Report saved on this device.')
    setPage('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteReport(id: number) {
    setReports((current) => current.filter((report) => report.id !== id))
    setMessage('Selected report deleted.')
  }

  function clearReports() {
    if (reports.length === 0) {
      setMessage('There are no saved reports to clear.')
      return
    }

    if (window.confirm('Delete all reports saved on this device?')) {
      setReports([])
      setMessage('All saved reports have been cleared.')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <button className="brand" onClick={() => setPage('home')}>
          <span className="brand-mark">JS</span>
          <span className="brand-text">
            <strong>JobShield AI</strong>
            <small>Online Job Scam Awareness</small>
          </span>
        </button>

        <nav className="nav" aria-label="Main navigation">
          {([
            ['home', 'Home'],
            ['safety', 'Safety Tips'],
            ['dashboard', 'Dashboard'],
            ['about', 'About'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={page === key ? 'nav-link active' : 'nav-link'}
              onClick={() => {
                setPage(key)
                setMessage('')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {message && (
          <div className="notice" role="status">
            <span>{message}</span>
            <button
              onClick={() => setMessage('')}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {page === 'home' && (
          <Home
            company={company}
            setCompany={setCompany}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            details={details}
            setDetails={setDetails}
            onSaveReport={saveReport}
            onSafety={() => setPage('safety')}
            onDashboard={() => setPage('dashboard')}
          />
        )}

        {page === 'safety' && <SafetyTips />}

        {page === 'dashboard' && (
          <Dashboard
            reports={reports}
            onDelete={deleteReport}
            onClear={clearReports}
            onNewReport={() => {
              setPage('home')
              setMessage('')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {page === 'about' && <About />}
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark">JS</span>
          <strong>JobShield AI</strong>
        </div>
        <p>Think before you pay. Verify before you trust.</p>
        <p className="footer-note">
          An awareness tool, not a guarantee that a job or company is genuine.
        </p>
        <a
          href="https://cybercrime.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Indian Cyber Crime Reporting Portal ↗
        </a>
      </footer>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function FeatureCard({
  symbol,
  title,
  text,
}: {
  symbol: string
  title: string
  text: string
}) {
  return (
    <article className="feature-card">
      <span className="feature-symbol">{symbol}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function Home({
  company,
  setCompany,
  jobTitle,
  setJobTitle,
  details,
  setDetails,
  onSaveReport,
  onSafety,
  onDashboard,
}: {
  company: string
  setCompany: (value: string) => void
  jobTitle: string
  setJobTitle: (value: string) => void
  details: string
  setDetails: (value: string) => void
  onSaveReport: (event: FormEvent<HTMLFormElement>) => void
  onSafety: () => void
  onDashboard: () => void
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">YOUR DIGITAL SAFETY COMPANION</span>
          <h1>
            Your career deserves
            <br />
            <span>real opportunities.</span>
          </h1>
          <p>
            Learn to recognise suspicious job offers, protect your personal
            information, and keep track of jobs you want to investigate.
          </p>
          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() =>
                document.getElementById('report-form')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Report a Suspicious Job →
            </button>
            <button className="button secondary" onClick={onSafety}>
              Learn Safety Tips
            </button>
          </div>
          <div className="trust-note">
            <span>✓</span> Free awareness tool
            <span>✓</span> Saved on your device
          </div>
        </div>

        <div className="hero-graphic">
          <div className="shield">✓</div>
          <div className="floating-card card-top">
            <span className="status-dot green" />
            Verify the employer
          </div>
          <div className="floating-card card-bottom">
            <span className="status-dot orange" />
            Never pay to get a job
          </div>
          <div className="graphic-caption">Pause. Check. Protect.</div>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <strong>01</strong>
          <span>Recognise warning signs</span>
        </div>
        <div className="stat">
          <strong>02</strong>
          <span>Protect your information</span>
        </div>
        <div className="stat">
          <strong>03</strong>
          <span>Record suspicious jobs</span>
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="WHAT YOU CAN DO"
          title="Stay one step ahead of job scams"
          description="Learn the warning signs and make more informed decisions while searching for work."
        />
        <div className="feature-grid">
          <FeatureCard
            symbol="⌕"
            title="Recognise red flags"
            text="Watch for upfront fees, unrealistic salaries, and pressure to accept a job immediately."
          />
          <FeatureCard
            symbol="◇"
            title="Protect your details"
            text="Keep your OTPs, passwords, identity documents, and banking information private."
          />
          <FeatureCard
            symbol="▤"
            title="Track suspicious jobs"
            text="Save company names, job titles, report details, and dates in your dashboard."
          />
        </div>
      </section>

      <section className="section report-section" id="report-form">
        <div className="report-intro">
          <span className="eyebrow">REPORT TRACKER</span>
          <h2>Record a suspicious job</h2>
          <p>
            Add the details you want to investigate. This form saves a record
            in your browser; it does not submit a complaint to the police.
          </p>
          <button className="button secondary" onClick={onDashboard}>
            View Saved Reports →
          </button>
        </div>

        <form className="panel report-form" onSubmit={onSaveReport}>
          <label htmlFor="company">Company or recruiter name</label>
          <input
            id="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Enter company name"
            required
            maxLength={120}
          />

          <label htmlFor="jobTitle">Job title or offer</label>
          <input
            id="jobTitle"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="e.g. Work-from-home data entry"
            required
            maxLength={120}
          />

          <label htmlFor="details">Suspicious details</label>
          <textarea
            id="details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Describe payment requests, messages, or other warning signs"
            required
            rows={4}
            maxLength={2000}
          />

          <button className="button primary full-width" type="submit">
            Save Report
          </button>
          <p className="form-note">
            Do not enter OTPs, passwords, or full bank account details here.
          </p>
        </form>
      </section>
    </>
  )
}

function SafetyTips() {
  return (
    <section className="page-section">
      <SectionHeading
        eyebrow="SAFETY CENTRE"
        title="Protect yourself from job scams"
        description="Simple steps that can help you avoid fraud and respond quickly if something goes wrong."
      />

      <div className="tips-grid">
        <article className="panel tip-card">
          <span className="tip-number">01</span>
          <h3>How to avoid payment scams</h3>
          <ul>
            <li>Be cautious if a recruiter demands money to guarantee a job.</li>
            <li>Do not pay registration, interview, training, or security fees without independent verification.</li>
            <li>Research the employer using its official website and independently found contact details.</li>
            <li>Be suspicious of unrealistic salaries and pressure to pay immediately.</li>
            <li>Never send money to a personal UPI ID just because a recruiter asks.</li>
          </ul>
        </article>

        <article className="panel tip-card">
          <span className="tip-number">02</span>
          <h3>Protect OTPs and bank details</h3>
          <ul>
            <li>Never share an OTP, UPI PIN, ATM PIN, or banking password.</li>
            <li>A genuine recruiter does not need your UPI PIN to pay your salary.</li>
            <li>Do not install unknown apps or screen-sharing apps at a recruiter's request.</li>
            <li>Share identity documents only when necessary and after verifying the organisation.</li>
            <li>Do not click unknown links to complete a supposed job verification or payment.</li>
          </ul>
        </article>

        <article className="panel tip-card">
          <span className="tip-number">03</span>
          <h3>What to do after a suspected scam</h3>
          <ul>
            <li>Stop payments and stop sharing information with the suspected scammer.</li>
            <li>Contact your bank or payment provider immediately if money or banking access is at risk.</li>
            <li>Preserve chats, phone numbers, emails, receipts, transaction IDs, and screenshots.</li>
            <li>If money has been lost to cyber fraud in India, call the national cybercrime helpline at 1930 as soon as possible.</li>
            <li>Make a report through the official portal and follow the instructions given by the authorities.</li>
            <li>Change exposed passwords and secure affected accounts.</li>
          </ul>
        </article>

        <article className="panel official-card">
          <span className="official-icon">↗</span>
          <h3>India's official cybercrime reporting portal</h3>
          <p>
            Use the Government of India's portal to report cybercrime. For
            financial cyber fraud, contact 1930 promptly as well.
          </p>
          <a
            className="button primary"
            href="https://cybercrime.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Official Portal ↗
          </a>
          <p className="form-note">
            Check the website address carefully before entering personal
            information.
          </p>
        </article>
      </div>
    </section>
  )
}

function Dashboard({
  reports,
  onDelete,
  onClear,
  onNewReport,
}: {
  reports: ScamReport[]
  onDelete: (id: number) => void
  onClear: () => void
  onNewReport: () => void
}) {
  return (
    <section className="page-section">
      <SectionHeading
        eyebrow="YOUR ACTIVITY"
        title="Report dashboard"
        description="Review the suspicious jobs you have recorded on this device."
      />

      <div className="dashboard-summary">
        <div className="summary-card">
          <span>Saved reports</span>
          <strong>{reports.length}</strong>
          <small>Total records stored in this browser</small>
        </div>
        <div className="summary-card">
          <span>Companies recorded</span>
          <strong>
            {new Set(reports.map((report) => report.company.toLowerCase())).size}
          </strong>
          <small>Unique company or recruiter names</small>
        </div>
        <div className="summary-card">
          <span>Latest report</span>
          <strong className="date-value">
            {reports.length > 0 ? reports[0].date : '—'}
          </strong>
          <small>Based on your saved reports</small>
        </div>
      </div>

      <div className="dashboard-heading">
        <div>
          <h2>Reported suspicious jobs</h2>
          <p>These are personal records, not verified public complaints.</p>
        </div>
        <div className="dashboard-actions">
          <button className="button secondary" onClick={onNewReport}>
            + New Report
          </button>
          <button className="button danger" onClick={onClear}>
            Clear All
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">▤</span>
          <h3>No saved reports yet</h3>
          <p>
            When you record a suspicious job on the Home page, it will appear
            here.
          </p>
          <button className="button primary" onClick={onNewReport}>
            Record a Job
          </button>
        </div>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <article className="panel saved-report" key={report.id}>
              <div className="saved-report-top">
                <span className="report-status">Suspicious job recorded</span>
                <span className="report-date">{report.date}</span>
              </div>
              <h3>{report.jobTitle}</h3>
              <p className="company-name">{report.company}</p>
              <p className="report-details">{report.details}</p>
              <button
                className="button danger small-button"
                onClick={() => {
                  if (window.confirm('Delete this saved report?')) {
                    onDelete(report.id)
                  }
                }}
              >
                Delete Report
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="privacy-note">
        <strong>Device storage:</strong> Your records are saved in this
        browser's local storage. They are not automatically sent to the police,
        a company, or a central database. Clearing browser site data may erase
        them.
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="page-section">
      <SectionHeading
        eyebrow="ABOUT THE PROJECT"
        title="Building safer job searches"
        description="JobShield AI is an educational project designed to raise awareness of online job fraud."
      />

      <div className="about-grid">
        <article className="panel about-card">
          <span className="about-symbol">◎</span>
          <h3>Project purpose</h3>
          <p>
            The purpose of JobShield AI is to help job seekers recognise common
            scam warning signs, learn safer online practices, and keep personal
            records of suspicious job offers.
          </p>
        </article>

        <article className="panel about-card">
          <span className="about-symbol">⌕</span>
          <h3>How the scam checks work</h3>
          <p>
            Checks can look for warning signs such as requests for upfront
            payments, requests for sensitive banking information, unusually
            attractive promises, or pressure to act quickly. These are
            indicators, not proof of fraud.
          </p>
        </article>

        <article className="panel about-card">
          <span className="about-symbol">⌘</span>
          <h3>Technologies used</h3>
          <p>
            React builds the user interface, TypeScript adds type checking,
            CSS controls the appearance, and browser localStorage saves
            dashboard reports on the current device.
          </p>
        </article>

        <article className="panel about-card">
          <span className="about-symbol">!</span>
          <h3>Limitations and responsible use</h3>
          <p>
            This version does not verify company registration, contact
            recruiters, search a live scam database, or file an official
            complaint. A warning does not prove a job is fraudulent, and no
            warning does not prove it is safe. Verify offers independently.
          </p>
        </article>
      </div>

      <div className="responsible-banner">
        <h3>Need to report an actual cybercrime?</h3>
        <p>
          Use the official Government of India portal rather than relying on
          this educational website to submit a complaint.
        </p>
        <a
          className="button primary"
          href="https://cybercrime.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Cyber Crime Portal ↗
        </a>
      </div>
    </section>
  )
}

export default App