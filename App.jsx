import React, { useState } from "react";

// UI
const Box = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}>
    {children}
  </div>
);

const Button = (props) => (
  <button style={{ padding: 8, margin: 5 }} {...props} />
);

// SETTINGS (UPDATED ✅)
const charLimits = { short: 200, medium: 400, long: 600 };

const pronouns = { male: "he", female: "she" };

// HELPERS
function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clean(value) {
  return value ? value.trim() : "";
}

// ✅ STYLE GUIDE
function applyStyleGuide(text) {
  if (!text) return "";
  return text
    .replace(/insightfil/gi, "insightful")
    .replace(/triganomotary/gi, "trigonometry")
    .replace(/learner|pupil|boy|girl/gi, "student")
    .replace(/maths/gi, "Mathematics")
    .replace(/classwork/gi, "class work")
    .replace(/organise/gi, "organize")
    .replace(/recognise/gi, "recognize")
    .replace(/realise/gi, "realize")
    .replace(/needs /gi, "should ")
    .trim();
}

// ✅ SMART TRAIT FORMATTER (removes “and spam”)
function formatTraits(text) {
  if (!text) return "";

  let t = text.split(" and ").join(", ");
  return t;
}

// ✅ PRONOUN MIX
function getRef(step, gender) {
  const p = pronouns[gender] || "he";
  return ["^n", capitalise(p), capitalise(p), "^n"][step % 4];
}

// ✅ EXTENSION PHRASES (for reaching 600 chars)
const extensions = [
  "and is continuing to grow in confidence",
  "while developing a deeper understanding of the subject matter",
  "and is beginning to work more independently",
  "which is evident in class participation and task completion"
];

// ✅ COMMENT ENGINE (ADVANCED)
function generateComment(data) {
  let sentences = [];
  let step = 0;
  const limit = charLimits[data.length || "medium"];

  const cleanTraits = formatTraits(applyStyleGuide(data.traits));
  const cleanBehaviour = applyStyleGuide(data.behaviour);
  const cleanTopics = applyStyleGuide(data.topics);
  const cleanCapabilities = applyStyleGuide(data.capabilities);
  const cleanConcern = applyStyleGuide(data.concern);

  const add = (sentence) => {
    sentence = sentence.trim();

    // ✅ Grammar smoothing
    sentence = sentence.replace(/, and/g, " and");
    sentence = sentence.replace(/ and and/g, " and");

    sentence = capitalise(sentence);

    if (!sentence.endsWith(".")) sentence += ".";

    const combined = [...sentences, sentence].join(" ");
    if (combined.length <= limit) {
      sentences.push(sentence);
    }
  };

  // ✅ 1 TRAITS (FIXED)
  if (cleanTraits && cleanBehaviour) {
    add(`${getRef(step++, data.gender)} is ${cleanTraits}, ${cleanBehaviour}, and approaches learning positively`);
  }

  // ✅ 2 CAPABILITIES
  if (cleanCapabilities) {
    add(`${getRef(step++, data.gender)} shows ${cleanCapabilities}, which supports academic growth`);
  }

  // ✅ 3 ACADEMIC
  add(`${getRef(step++, data.gender)} is making steady progress in ${data.subject}`);

  // ✅ 4 TOPICS
  if (cleanTopics) {
    add(`${getRef(step++, data.gender)} has worked with topics such as ${cleanTopics}`);
  }

  // ✅ 5 EXTENSIONS (NEW — fills length naturally ✅)
  while (sentences.join(" ").length < limit - 80) {
    add(`${getRef(step++, data.gender)} ${extensions[Math.floor(Math.random()*extensions.length)]}`);
  }

  // ✅ 6 CONCERN
  if (cleanConcern) {
    add(`${getRef(step++, data.gender)} should focus on improving ${cleanConcern} to continue making progress`);
  }

  return sentences.join(" ");
}

export default function App() {
  const [names, setNames] = useState([]);
  const [comments, setComments] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const rows = event.target.result.split("\n");

      const newNames = [];
      const newComments = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;

        const values = row.split(",").map(v => clean(v));
        if (values.length < 9) continue;

        const [name, gender, subject, traits, behaviour, topics, capabilities, concern, length] = values;

        const comment = generateComment({
          gender, subject, traits, behaviour, topics, capabilities, concern, length
        });

        newNames.push(name);
        newComments.push(comment);
      }

      setNames(newNames);
      setComments(newComments);
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv =
      "name,gender,subject,traits,behaviour,topics,capabilities,concern,length\n" +
      "John,male,Mathematics,positive and respectful and well-behaved,engaging,algebra,strong reasoning,accuracy,long";

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "template.csv";
    a.click();
  };

  // ✅ WORD TABLE EXPORT
  const exportToWord = () => {
    let content = "<table border='1' style='border-collapse: collapse;'>";

    for (let i = 0; i < comments.length; i++) {
      content += `
        <tr>
          <td style="padding:8px;"><b>${names[i]}</b></td>
          <td style="padding:8px;">${comments[i]}</td>
        </tr>
      `;
    }

    content += "</table>";

    const blob = new Blob([content], { type: "application/msword" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report-comments.doc";
    a.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Report Comment Generator</h1>

      <Box>
        <Button onClick={downloadTemplate}>Download Template</Button>
        <input type="file" accept=".csv" onChange={handleUpload} />
        <Button onClick={exportToWord}>Export to Word</Button>
      </Box>

      <Box>
        <h3>Bulk Comments</h3>
        {comments.map((c, i) => (
          <p key={i}>
            <b>{names[i]}</b>: {c}
          </p>
        ))}
      </Box>
    </div>
  );
}
