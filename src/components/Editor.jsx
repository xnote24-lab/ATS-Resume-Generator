import React, { useRef, useState } from 'react'

function FormField({ label, name, value, onChange, placeholder="", type="text", full=false }) {
  return (
    <div className={`ats-field${full ? " full" : ""}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      <input id={`f-${name}`} type={type} value={value}
        onChange={e => onChange(name, e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function SkillsInput({ skills, onChange }) {
  const [val, setVal] = useState("");
  const ref = useRef();

  const add = () => {
    const t = val.trim();
    if (t && !skills.includes(t)) onChange([...skills, t]);
    setVal("");
  };
  const remove = s => onChange(skills.filter(x => x !== s));
  const onKey  = e => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    if (e.key === "Backspace" && val === "" && skills.length) onChange(skills.slice(0,-1));
  };

  return (
    <div className="ats-field full">
      <label htmlFor="skills-input">Skills — press Enter to add</label>
      <div className="ats-skills-box" onClick={() => ref.current?.focus()}>
        {skills.map(s => (
          <span key={s} className="ats-skill-chip">
            {s}
            <button type="button" onClick={() => remove(s)} aria-label={`Remove ${s}`}>×</button>
          </span>
        ))}
        <input ref={ref} id="skills-input" value={val}
          onChange={e => setVal(e.target.value)} onKeyDown={onKey} onBlur={add}
          placeholder={skills.length === 0 ? "e.g. React, Python… press Enter" : ""} />
      </div>
    </div>
  );
}

function PersonalInfoForm({ personal, onChange }) {
  return (
    <section className="ats-section" aria-label="Personal information">
      <div className="ats-section-label">Personal Info</div>
      <div className="ats-row">
        <FormField label="Full Name"           name="name"     value={personal.name}     onChange={onChange} placeholder="Jane Doe"                  full />
        <FormField label="Job Title / Role"    name="title"    value={personal.title}    onChange={onChange} placeholder="Senior Software Engineer"   full />
        <FormField label="Email"               name="email"    value={personal.email}    onChange={onChange} placeholder="jane@email.com"  type="email" />
        <FormField label="Phone"               name="phone"    value={personal.phone}    onChange={onChange} placeholder="+1 (555) 000-0000" type="tel" />
        <FormField label="Location"            name="location" value={personal.location} onChange={onChange} placeholder="New York, NY" />
        <FormField label="LinkedIn URL"        name="linkedin" value={personal.linkedin} onChange={onChange} placeholder="linkedin.com/in/jane" />
        <FormField label="Portfolio / Website" name="website"  value={personal.website}  onChange={onChange} placeholder="janedoe.dev" full />
      </div>
    </section>
  );
}

function ExperienceForm({ experience, onField, onAdd, onRemove }) {
  return (
    <section className="ats-section" aria-label="Work experience">
      <div className="ats-section-label">Work Experience</div>
      {experience.map(exp => (
        <article key={exp.id} className="ats-card">
          {experience.length > 1 &&
            <button className="ats-card-remove" type="button" onClick={() => onRemove(exp.id)} aria-label="Remove entry">×</button>}
          <div className="ats-row">
            <div className="ats-field full">
              <label htmlFor={`role-${exp.id}`}>Job Title</label>
              <input id={`role-${exp.id}`} value={exp.role} onChange={e=>onField(exp.id,"role",e.target.value)} placeholder="Software Engineer" />
            </div>
            <div className="ats-field">
              <label htmlFor={`co-${exp.id}`}>Company</label>
              <input id={`co-${exp.id}`} value={exp.company} onChange={e=>onField(exp.id,"company",e.target.value)} placeholder="Acme Corp" />
            </div>
            <div className="ats-field">
              <label htmlFor={`eloc-${exp.id}`}>Location</label>
              <input id={`eloc-${exp.id}`} value={exp.location} onChange={e=>onField(exp.id,"location",e.target.value)} placeholder="Remote / NYC" />
            </div>
            <div className="ats-field">
              <label htmlFor={`sd-${exp.id}`}>Start Date</label>
              <input id={`sd-${exp.id}`} value={exp.startDate} onChange={e=>onField(exp.id,"startDate",e.target.value)} placeholder="Jan 2022" />
            </div>
            <div className="ats-field">
              <label htmlFor={`ed-${exp.id}`}>End Date</label>
              <input id={`ed-${exp.id}`} value={exp.endDate} onChange={e=>onField(exp.id,"endDate",e.target.value)} placeholder="Dec 2024"
                disabled={exp.current} style={{ opacity: exp.current ? 0.4 : 1 }} />
            </div>
            <div className="ats-check-row">
              <input type="checkbox" id={`cur-${exp.id}`} checked={exp.current} onChange={e=>onField(exp.id,"current",e.target.checked)} />
              <label htmlFor={`cur-${exp.id}`}>Currently working here</label>
            </div>
            <div className="ats-field full">
              <label htmlFor={`bl-${exp.id}`}>Achievements — one per line, start with action verbs</label>
              <textarea id={`bl-${exp.id}`} rows={4} value={exp.bullets} onChange={e=>onField(exp.id,"bullets",e.target.value)}
                placeholder={"Led migration to microservices, reducing latency 40%\nMentored 3 junior engineers\nBuilt CI/CD pipeline on AWS"} />
            </div>
          </div>
        </article>
      ))}
      <button type="button" className="ats-add-btn" onClick={onAdd}>+ Add Experience</button>
    </section>
  );
}

function EducationForm({ education, onField, onAdd, onRemove }) {
  return (
    <section className="ats-section" aria-label="Education">
      <div className="ats-section-label">Education</div>
      {education.map(edu => (
        <article key={edu.id} className="ats-card">
          {education.length > 1 &&
            <button className="ats-card-remove" type="button" onClick={() => onRemove(edu.id)} aria-label="Remove entry">×</button>}
          <div className="ats-row">
            <div className="ats-field full">
              <label htmlFor={`deg-${edu.id}`}>Degree & Field</label>
              <input id={`deg-${edu.id}`} value={edu.degree} onChange={e=>onField(edu.id,"degree",e.target.value)} placeholder="B.S. Computer Science" />
            </div>
            <div className="ats-field">
              <label htmlFor={`sch-${edu.id}`}>School / University</label>
              <input id={`sch-${edu.id}`} value={edu.school} onChange={e=>onField(edu.id,"school",e.target.value)} placeholder="MIT" />
            </div>
            <div className="ats-field">
              <label htmlFor={`edl-${edu.id}`}>Location</label>
              <input id={`edl-${edu.id}`} value={edu.location} onChange={e=>onField(edu.id,"location",e.target.value)} placeholder="Cambridge, MA" />
            </div>
            <div className="ats-field">
              <label htmlFor={`sy-${edu.id}`}>Start Year</label>
              <input id={`sy-${edu.id}`} value={edu.startYear} onChange={e=>onField(edu.id,"startYear",e.target.value)} placeholder="2016" />
            </div>
            <div className="ats-field">
              <label htmlFor={`ey-${edu.id}`}>End Year</label>
              <input id={`ey-${edu.id}`} value={edu.endYear} onChange={e=>onField(edu.id,"endYear",e.target.value)} placeholder="2020" />
            </div>
            <div className="ats-field">
              <label htmlFor={`gpa-${edu.id}`}>GPA (optional)</label>
              <input id={`gpa-${edu.id}`} value={edu.gpa} onChange={e=>onField(edu.id,"gpa",e.target.value)} placeholder="3.8" />
            </div>
          </div>
        </article>
      ))}
      <button type="button" className="ats-add-btn" onClick={onAdd}>+ Add Education</button>
    </section>
  );
}

function CertificationsForm({ certifications, onField, onAdd, onRemove }) {
  return (
    <section className="ats-section" aria-label="Certifications">
      <div className="ats-section-label">Certifications</div>
      {certifications.map(c => (
        <article key={c.id} className="ats-card">
          {certifications.length > 1 &&
            <button className="ats-card-remove" type="button" onClick={() => onRemove(c.id)} aria-label="Remove entry">×</button>}
          <div className="ats-row">
            <div className="ats-field full">
              <label htmlFor={`cn-${c.id}`}>Certification Name</label>
              <input id={`cn-${c.id}`} value={c.name} onChange={e=>onField(c.id,"name",e.target.value)} placeholder="AWS Solutions Architect" />
            </div>
            <div className="ats-field">
              <label htmlFor={`ci-${c.id}`}>Issuing Organization</label>
              <input id={`ci-${c.id}`} value={c.issuer} onChange={e=>onField(c.id,"issuer",e.target.value)} placeholder="Amazon Web Services" />
            </div>
            <div className="ats-field">
              <label htmlFor={`cy-${c.id}`}>Year</label>
              <input id={`cy-${c.id}`} value={c.year} onChange={e=>onField(c.id,"year",e.target.value)} placeholder="2024" />
            </div>
          </div>
        </article>
      ))}
      <button type="button" className="ats-add-btn" onClick={onAdd}>+ Add Certification</button>
    </section>
  );
}

export default function Editor({ data, setPersonal, setSummary, setExpField, addExp, removeExp, setEduField, addEdu, removeEdu, setSkills, setCertField, addCert, removeCert, isPaid, onStartPurchase }) {
  return (
    <>
      <PersonalInfoForm personal={data.personal} onChange={setPersonal} />

      <section className="ats-section" aria-label="Professional summary">
        <div className="ats-section-label">Professional Summary</div>
        <div className="ats-field full">
          <label htmlFor="summary-ta">2–4 sentences with job-description keywords</label>
          <textarea id="summary-ta" rows={4} value={data.summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Results-driven engineer with 6+ years building scalable web apps with React, Node.js, and AWS…" />
        </div>
      </section>

      <ExperienceForm experience={data.experience} onField={setExpField} onAdd={addExp} onRemove={removeExp} />
      <EducationForm  education={data.education}   onField={setEduField} onAdd={addEdu} onRemove={removeEdu} />

      <section className="ats-section" aria-label="Skills">
        <div className="ats-section-label">Skills</div>
        <SkillsInput skills={data.skills} onChange={setSkills} />
      </section>

      <CertificationsForm certifications={data.certifications} onField={setCertField} onAdd={addCert} onRemove={removeCert} />

      <button type="button" className="ats-btn-primary" onClick={() => {
        if (isPaid) return window.print();
        // open purchase popup
        onStartPurchase && onStartPurchase();
      }} aria-label="Print or download resume as PDF" disabled={!isPaid}>
        ⬇ {isPaid ? 'Download / Print Resume' : 'Locked — Purchase to Unlock'}
      </button>
      <div style={{ height: "1.5rem" }} />
    </>
  )
}
