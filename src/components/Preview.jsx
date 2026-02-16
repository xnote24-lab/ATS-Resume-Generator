import React from 'react'

function ResumeDocument({ data }) {
  const { personal: p, summary, experience, education, skills, certifications } = data;
  const hasContent = p.name || summary || experience.some(e=>e.role);

  if (!hasContent) return (
    <div className="ats-resume">
      <p className="r-empty">Start filling in your details on the left<br/>to see your resume come to life ✦</p>
    </div>
  );

  return (
    <article className="ats-resume" id="resume-output" aria-label="Resume preview" aria-live="polite">
      <header>
        {p.name  && <h2 className="r-name">{p.name}</h2>}
        {p.title && <p  className="r-title">{p.title}</p>}
        <address className="r-contact">
          {p.email    && <span>✉ <a href={`mailto:${p.email}`}>{p.email}</a></span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.website  && <span>🌐 {p.website}</span>}
        </address>
      </header>

      {summary && (
        <section className="r-section" aria-label="Professional summary">
          <h3 className="r-section-title">Professional Summary</h3>
          <p className="r-summary">{summary}</p>
        </section>
      )}

      {experience.some(e=>e.role) && (
        <section className="r-section" aria-label="Work experience">
          <h3 className="r-section-title">Work Experience</h3>
          {experience.filter(e=>e.role).map(exp => (
            <article key={exp.id} className="r-exp-entry">
              <div className="r-exp-header">
                <strong className="r-exp-role">{exp.role}</strong>
                <span className="r-exp-dates">
                  {exp.startDate}{(exp.startDate && (exp.endDate||exp.current)) ? " – " : ""}
                  {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="r-exp-company">{exp.company}{exp.company&&exp.location ? ", " : ""}{exp.location}</p>
              {exp.bullets && (
                <ul className="r-bullets">
                  {exp.bullets.split("\n").filter(b=>b.trim()).map((b,i) =>
                    <li key={i}>{b.replace(/^[-•▪]\s*/,"")}</li>
                  )}
                </ul>
              )}
            </article>
          ))}
        </section>
      )}

      {education.some(e=>e.degree||e.school) && (
        <section className="r-section" aria-label="Education">
          <h3 className="r-section-title">Education</h3>
          {education.filter(e=>e.degree||e.school).map(edu => (
            <div key={edu.id} className="r-edu-entry">
              <div>
                <p className="r-edu-degree">{edu.degree}</p>
                <p className="r-edu-school">{edu.school}{edu.school&&edu.location?", ":""}{edu.location}{edu.gpa?` · GPA: ${edu.gpa}`:""}</p>
              </div>
              <div className="r-edu-year">
                {edu.startYear&&edu.endYear ? `${edu.startYear} – ${edu.endYear}` : edu.endYear||edu.startYear}
              </div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="r-section" aria-label="Skills">
          <h3 className="r-section-title">Skills &amp; Technologies</h3>
          <ul className="r-skills">
            {skills.map(s => <li key={s} className="r-skill">{s}</li>)}
          </ul>
        </section>
      )}

      {certifications.some(c=>c.name) && (
        <section className="r-section" aria-label="Certifications">
          <h3 className="r-section-title">Certifications</h3>
          {certifications.filter(c=>c.name).map(c => (
            <div key={c.id} className="r-cert-entry">
              <div>
                <p className="r-cert-name">{c.name}</p>
                {c.issuer && <p className="r-cert-issuer">{c.issuer}</p>}
              </div>
              {c.year && <span className="r-cert-year">{c.year}</span>}
            </div>
          ))}
        </section>
      )}
    </article>
  );
}

export default function Preview({ data }) {
  return <ResumeDocument data={data} />
}
