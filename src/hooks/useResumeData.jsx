import { useState } from 'react'

const INIT = {
  personal: { name:"", title:"", email:"", phone:"", location:"", linkedin:"", website:"" },
  summary: "",
  experience: [{ id:1, role:"", company:"", location:"", startDate:"", endDate:"", current:false, bullets:"" }],
  education:  [{ id:1, degree:"", school:"", location:"", startYear:"", endYear:"", gpa:"" }],
  skills: [],
  certifications: [{ id:1, name:"", issuer:"", year:"" }],
};
let _id = 100;
const uid = () => ++_id;

export default function useResumeData() {
  const [data, setData] = useState(INIT);

  const setPersonal  = (k,v) => setData(d => ({ ...d, personal: { ...d.personal, [k]:v } }));
  const setSummary   = (v)   => setData(d => ({ ...d, summary: v }));

  const setExpField  = (id,k,v) => setData(d => ({ ...d, experience: d.experience.map(e => e.id===id ? {...e,[k]:v} : e) }));
  const addExp       = ()       => setData(d => ({ ...d, experience: [...d.experience, { id:uid(), role:"", company:"", location:"", startDate:"", endDate:"", current:false, bullets:"" }] }));
  const removeExp    = (id)     => setData(d => ({ ...d, experience: d.experience.filter(e => e.id!==id) }));

  const setEduField  = (id,k,v) => setData(d => ({ ...d, education: d.education.map(e => e.id===id ? {...e,[k]:v} : e) }));
  const addEdu       = ()       => setData(d => ({ ...d, education: [...d.education, { id:uid(), degree:"", school:"", location:"", startYear:"", endYear:"", gpa:"" }] }));
  const removeEdu    = (id)     => setData(d => ({ ...d, education: d.education.filter(e => e.id!==id) }));

  const setSkills    = (s)      => setData(d => ({ ...d, skills: s }));

  const setCertField = (id,k,v) => setData(d => ({ ...d, certifications: d.certifications.map(c => c.id===id ? {...c,[k]:v} : c) }));
  const addCert      = ()       => setData(d => ({ ...d, certifications: [...d.certifications, { id:uid(), name:"", issuer:"", year:"" }] }));
  const removeCert   = (id)     => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id!==id) }));

  return { data, setPersonal, setSummary, setExpField, addExp, removeExp, setEduField, addEdu, removeEdu, setSkills, setCertField, addCert, removeCert };
}
