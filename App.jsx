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

const openings = [
  "^n demonstrates",
  "^n shows",
  "^n continues to show"
];

const effortPhrases = [
  "consistent effort",
  "a good level of effort",
  "a steady level of effort",
  "a developing level of effort"
];

const performanceStarters = [
  "demonstrates",
  "has shown",
  "continues to build"
];

const subjectPhrases = {
  Mathematics: [
    "a solid understanding of key concepts",
    "a growing confidence in problem-solving"
  ],
  "English Home Language": [
    "confidence in reading and writing",
    "a growing ability to express ideas clearly"
  ],
  "Afrikaans First Additional Language": [
    "good progress in reading and writing",
    "a growing understanding of the language"
  ]
};

const topicStarters = [
  "has engaged with topics such as",
  "has worked with topics including"
];

const behaviourPhrases = [
  "works well in the classroom",
  "contributes positively to the learning environment"
];

const concernStarters = [
  "should focus on improving",
  "would benefit from improving"
];

const pronouns = {
  male: "he",
  female: "she"
};

// HELPERS
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getReference(step, gender) {
  const p = pronouns[gender] || "they";
  return ["^n", p, p, "^n", p][step % 5];
}

// ✅ CAPITALISATION
function fixSentence(sentence) {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

// ✅ STYLE GUIDE CLEANER (CRITICAL)
function applyStyleGuide(text) {
  if (!text) return "";

  return text
    .replace(/learner|pupil|boy|girl/gi, "student")
    .replace(/maths/gi, "Mathematics")
    .replace(/classwork/gi, "class work")
    .replace(/cocurricular/gi, "co-curricular")
    .replace(/insightfil/gi, "insightful")
    .replace(/triganomotary/gi, "trigonometry")
    .replace(/needs /gi, "should ")
    .replace(/organise/gi, "organize")
    .replace(/realise/gi, "realize")
    .replace(/recognise/gi, "recognize")
    .replace(/focussed/gi, "focused")
    .replace(/analyse/gi, "analyse") // enforce correct use
    .trim();
}

// MAIN
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
    let step = 0;
    const limit = charLimits[length];

    // CLEAN INPUTS
    const cleanTraits = applyStyleGuide(traits);
    const cleanTopics = applyStyleGuide(topics);
    const cleanConcern = applyStyleGuide(concern);
    const cleanCapabilities = applyStyleGuide(capabilities);

    const add = (sentence) => {
      const fixed = applyStyleGuide(fixSentence(sentence));
      if ((text + " " + fixed).trim().length <= limit) {
        text += (text ? " " : "") + fixed;
      }
    };

    // FIX REPETITION
    let opening = pick(openings);
    let effort = pick(effortPhrases);
    if (opening.includes("developing") && effort.includes("developing")) {
      effort = "steady effort";
    }

    add(`${opening} ${effort} in ${subject}.`);

    add(`${getReference(step++, gender)} ${pick(performanceStarters)} ${pick(subjectPhrases[subject])} and is becoming more confident.`);

    if (cleanTopics) {
      add(`${getReference(step++, gender)} ${pick(topicStarters)} ${cleanTopics}.`);
    }

    if (cleanCapabilities) {
      add(`${getReference(step++, gender)} shows ${cleanCapabilities}.`);
    }

    if (cleanTraits) {
      add(`${getReference(step++, gender)} is ${cleanTraits}.`);
    }

    if (behaviour) {
      add(`${getReference(step++, gender)} ${applyStyleGuide(behaviour)}.`);
    } else {
      add(`${getReference(step++, gender)} ${pick(behaviourPhrases)}.`);
    }

    if (cleanConcern) {
      add(`${getReference(step++, gender)} ${pick(concernStarters)} ${cleanConcern}.`);
    }

    setComment(text);
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
        <p>Characters: {comment.length} / {charLimits[length]}</p>
      </Box>

      <Box>
        <p>{comment}</p>
      </Box>
    </div>
  );
}
