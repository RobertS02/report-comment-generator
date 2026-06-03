import React, { useState } from "react";

// Simple UI
const Box = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10, borderRadius: 8 }}>
    {children}
  </div>
);

const Button = ({ children, ...props }) => (
  <button style={{ padding: 8, marginTop: 6 }} {...props}>
    {children}
  </button>
);

// SETTINGS
const charLimits = { short: 180, medium: 300, long: 450 };

// DATA
const subjects = [
  "Mathematics",
  "English Home Language",
  "Afrikaans First Additional Language"
];

const effortPhrases = [
  "consistent effort",
  "steady effort",
  "a good level of effort",
  "a developing level of effort"
];

const openings = [
  "^n demonstrates",
  "^n shows",
  "^n continues to show",
  "^n is developing"
];

const performanceStarters = [
  "has shown",
  "demonstrates",
  "continues to build",
  "is developing"
];

const subjectPhrases = {
  Mathematics: [
    "a solid understanding of key concepts",
    "a growing confidence in problem-solving",
    "a good grasp of the work covered",
    "increasing confidence in applying skills"
  ],
  "English Home Language": [
    "confidence in reading and writing",
    "a good understanding of language skills",
    "a growing ability to express ideas clearly",
    "steady progress in comprehension and writing"
  ],
  "Afrikaans First Additional Language": [
    "good progress in reading and writing",
    "a growing understanding of the language",
    "steady development in language usage",
    "increasing confidence in Afrikaans"
  ]
};

const topicStarters = [
  "has engaged with topics such as",
  "has worked with topics including",
  "has covered areas such as",
  "has been introduced to concepts such as"
];

const traitsStarters = [
  "participates actively in class",
  "engages positively during lessons",
  "is increasingly confident during class activities",
  "shows a willingness to take part in learning activities"
];

const behaviourPhrases = [
  "works well in the classroom",
  "is a positive part of the class",
  "contributes positively to the learning environment"
];

const concernStarters = [
  "should focus on improving",
  "needs to work on",
  "would benefit from improving"
];

const pronouns = {
  male: "he",
  female: "she"
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getReference(step, gender) {
  const p = pronouns[gender] || "they";
  return ["^n", p, p, "^n", p][step % 5];
}

export default function App() {
  const [subject, setSubject] = useState(subjects[0]);
  const [topics, setTopics] = useState("");
  const [traits, setTraits] = useState("");
  const [concern, setConcern] = useState("");
  const [gender, setGender] = useState("male");
  const [length, setLength] = useState("medium");
  const [comment, setComment] = useState("");

  const generate = () => {
    let text = "";
    let step = 0;
    const limit = charLimits[length];

    const add = (sentence) => {
      if ((text + " " + sentence).trim().length <= limit) {
        text += (text ? " " : "") + sentence;
      }
    };

    // Opening
    add(`${pick(openings)} ${pick(effortPhrases)} in ${subject}.`);

    // Performance
    add(`${getReference(step++, gender)} ${pick(performanceStarters)} ${pick(subjectPhrases[subject])}.`);

    // Topics
    if (topics) {
      add(`${getReference(step++, gender)} ${pick(topicStarters)} ${topics}.`);
    }

    // Traits
    if (traits) {
      add(`${getReference(step++, gender)} ${traits}.`);
    } else {
      add(`${getReference(step++, gender)} ${pick(traitsStarters)}.`);
    }

    // Behaviour
    add(`${getReference(step++, gender)} ${pick(behaviourPhrases)}.`);

    // Concern
    if (concern) {
      add(`${getReference(step++, gender)} ${pick(concernStarters)} ${concern}.`);
    }

    setComment(text);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Report Comment Generator</h1>

      <Box>
        <label>Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>

        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Length</label>
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>

        <input placeholder="Topics covered (e.g. algebra, essays)" value={topics} onChange={(e) => setTopics(e.target.value)} />
        <input placeholder="Learner traits" value={traits} onChange={(e) => setTraits(e.target.value)} />
        <input placeholder="Area of concern" value={concern} onChange={(e) => setConcern(e.target.value)} />

        <Button onClick={generate}>Generate Comment</Button>

        <p>Characters: {comment.length} / {charLimits[length]}</p>
      </Box>

      <Box>
        <p>{comment}</p>
      </Box>
    </div>
  );
}
