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

// ✅ STYLE GUIDE CLEANER (from your documents)
function applyStyleGuide(text) {
  if (!text) return "";

  return text
    .replace(/learner|pupil|boy|girl/gi, "student") // enforce "student"
    .replace(/maths/gi, "Mathematics")
    .replace(/classwork/gi, "class work")
    .replace(/cocurricular/gi, "co-curricular")
    .replace(/insightfil/gi, "insightful")
    .replace(/triganomotary/gi, "trigonometry")
    .replace(/organise/gi, "organize")
    .replace(/recognise/gi, "recognize")
    .replace(/realise/gi, "realize")
    .replace(/focussed/gi, "focused")
    .replace(/needs /gi, "should ") // softer tone
    .trim();
}

// MAIN COMPONENT
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

  const generate = () => {
    let text = "";
    const limit = charLimits[length];

    const p = getPronoun(gender);
    const P = capitalise(p);

    // Clean inputs
    const cleanTraits = applyStyleGuide(traits);
    const cleanBehaviour = applyStyleGuide(behaviour);
    const cleanTopics = applyStyleGuide(topics);
    const cleanCapabilities = applyStyleGuide(capabilities);
    const cleanConcern = applyStyleGuide(concern);

    const add = (sentence) => {
      const s = capitalise(sentence);
      if ((text + " " + s).trim().length <= limit) {
        text += (text ? " " : "") + s;
      }
    };

    // ✅ 1. TRAITS + BEHAVIOUR (OPENING HUMAN LINE)
    if (cleanTraits && cleanBehaviour) {
      add(`^n is ${cleanTraits} and ${cleanBehaviour}, and ${p} approaches lessons with a positive attitude`);
    } else if (cleanTraits) {
      add(`^n is ${cleanTraits} and ${p} engages positively during lessons`);
    }

    // ✅ 2. CAPABILITIES (STRENGTH)
    if (cleanCapabilities) {
      add(`${P} shows ${cleanCapabilities}, which supports continued academic growth`);
    }

    // ✅ 3. ACADEMIC PERFORMANCE (SUBJECT-BASED)
    add(`${P} is making good progress in ${subject} and is becoming more confident in applying key skills`);

    // ✅ 4. TOPICS COVERED
    if (cleanTopics) {
      add(`${P} has worked with topics such as ${cleanTopics} and is developing a stronger understanding`);
    }

    // ✅ 5. CONCERN (SOFTENED + DEVELOPMENTAL)
    if (cleanConcern) {
      add(`${P} should focus on improving ${cleanConcern} to continue making progress`);
    }

    setComment(text + ".");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Report Comment Generator</h1>

      <Box>
        {/* ORDER CORRECT ✅ */}

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

        <p>Characters: {comment.length} / {charLimits[length]}</p>
      </Box>

      <Box>
        <p>{comment}</p>
      </Box>

    </div>
  );
}
