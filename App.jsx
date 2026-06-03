import React, { useState } from "react";

// UI
const Box = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}>
    {children}
  </div>
);

const Button = (props) => (
  <button style={{ padding: 8, marginTop: 6 }} {...props} />
);

// SETTINGS
const charLimits = { short: 180, medium: 300, long: 450 };

// DATA
const subjects = [
  "Mathematics",
  "English Home Language",
  "Afrikaans First Additional Language"
];

const pronouns = {
  male: "he",
  female: "she"
};

// HELPERS
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPronoun(gender) {
  return pronouns[gender] || "they";
}

function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ✅ STYLE GUIDE CLEANER
function applyStyleGuide(text) {
  if (!text) return "";

  return text
    .replace(/learner|pupil|boy|girl/gi, "student")
    .replace(/insightfil/gi, "insightful")
    .replace(/triganomotary/gi, "trigonometry")
    .replace(/maths/gi, "Mathematics")
    .replace(/classwork/gi, "class work")
    .replace(/cocurricular/gi, "co-curricular")
    .replace(/organise/gi, "organize")
    .replace(/recognise/gi, "recognize")
    .replace(/realise/gi, "realize")
    .replace(/focussed/gi, "focused")
    .replace(/needs /gi, "should ")
    .trim();
}

// ✅ CORE COMMENT ENGINE
function generateComment(data) {
  let text = "";
  const limit = charLimits[data.length || "medium"];

  const p = pronouns[data.gender] || "he";
  const P = capitalise(p);

  const cleanTraits = applyStyleGuide(data.traits);
  const cleanBehaviour = applyStyleGuide(data.behaviour);
  const cleanTopics = applyStyleGuide(data.topics);
  const cleanCapabilities = applyStyleGuide(data.capabilities);
  const cleanConcern = applyStyleGuide(data.concern);

  const add = (sentence) => {
    const s = capitalise(sentence);
    if ((text + " " + s).trim().length <= limit) {
      text += (text ? " " : "") + s;
    }
  };

  // ✅ 1. Traits + behaviour (human opening)
  if (cleanTraits && cleanBehaviour) {
    add(`^n is ${cleanTraits} and ${cleanBehaviour}, and ${p} approaches lessons with a positive attitude`);
  } else if (cleanTraits) {
    add(`^n is ${cleanTraits} and ${p} engages positively during lessons`);
  }

  // ✅ 2. Capabilities
  if (cleanCapabilities) {
    add(`${P} shows ${cleanCapabilities}, which supports continued academic growth`);
  }

  // ✅ 3. Academic
  add(`${P} is making steady progress in ${data.subject} and is becoming more confident in applying key skills`);

  // ✅ 4. Topics
  if (cleanTopics) {
    add(`${P} has worked with topics such as ${cleanTopics} and is developing a stronger understanding`);
  }

  // ✅ 5. Concern
  if (cleanConcern) {
    add(`${P} should focus on improving ${cleanConcern} to continue making progress`);
  }

  return text + ".";
}

export default function App() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [subject, setSubject] = useState(subjects[0]);
  const [traits, setTraits] = useState("");
  const [behaviour, setBehaviour] = useState("");
  const [topics, setTopics] = useState("");
  const [capabilities, setCapabilities] = useState("");
  const [concern, setConcern] = useState("");
  const [length, setLength] = useState("medium");
  const [comment, setComment] = useState("");
  const [bulkComments, setBulkComments] = useState([]);

  // ✅ SINGLE COMMENT
  const generate = () => {
    const result = generateComment({
      name,
      gender,
      subject,
      traits,
      behaviour,
      topics,
      capabilities,
      concern,
      length
    });

    setComment(result);
  };

  // ✅ BULK CSV UPLOAD
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const rows = event.target.result.split("\n").slice(1);

      const generated = rows.map((row) => {
        const [name, gender, subject, traits, behaviour, topics, capabilities, concern, length] = row.split(",");

        if (!name) return null;

        return generateComment({
          name,
          gender,
          subject,
          traits,
          behaviour,
          topics,
          capabilities,
          concern,
          length
        });

      }).filter(Boolean);

      setBulkComments(generated);
    };

    reader.readAsText(file);
  };

  // ✅ EXPORT TO WORD
  const exportToWord = () => {
    const all = [comment, ...bulkComments].join("\n\n");

    const blob = new Blob([all], { type: "application/msword" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report-comments.doc";
    a.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Report Comment Generator</h1>

      <Box>

        <input placeholder="Learner name" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>

        <input placeholder="Learner traits" value={traits} onChange={(e) => setTraits(e.target.value)} />
        <input placeholder="Behaviour" value={behaviour} onChange={(e) => setBehaviour(e.target.value)} />
        <input placeholder="Topics covered" value={topics} onChange={(e) => setTopics(e.target.value)} />
        <input placeholder="Capabilities" value={capabilities} onChange={(e) => setCapabilities(e.target.value)} />
        <input placeholder="Area of concern" value={concern} onChange={(e) => setConcern(e.target.value)} />

        <label>Length</label>
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        <Button onClick={generate}>Generate Comment</Button>
        <Button onClick={exportToWord}>Export to Word</Button>

        <input type="file" accept=".csv" onChange={handleUpload} />

        <p>Characters: {comment.length} / {charLimits[length]}</p>
      </Box>

      <Box>
        <p>{comment}</p>
      </Box>

      {bulkComments.length > 0 && (
        <Box>
          <h3>Bulk Comments</h3>
          {bulkComments.map((c, i) => (
            <p key={i}>{c}</p>
          ))}
        </Box>
      )}
    </div>
  );
}
