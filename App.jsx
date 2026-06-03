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

// SETTINGS
const charLimits = { short: 180, medium: 300, long: 450 };

// DATA
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

// ✅ PRONOUN CYCLING
function getRef(step, gender) {
  const p = pronouns[gender] || "he";
  return ["^n", capitalise(p), capitalise(p), "^n"][step % 4];
}

// ✅ COMMENT ENGINE (FULLY FIXED)
function generateComment(data) {
  let sentences = [];
  let step = 0;
  const limit = charLimits[data.length || "medium"];

  const cleanTraits = applyStyleGuide(data.traits);
  const cleanBehaviour = applyStyleGuide(data.behaviour);
  const cleanTopics = applyStyleGuide(data.topics);
  const cleanCapabilities = applyStyleGuide(data.capabilities);
  const cleanConcern = applyStyleGuide(data.concern);

  const add = (sentence) => {
    sentence = capitalise(sentence.trim());
    if (!sentence.endsWith(".")) sentence += ".";
    const combined = [...sentences, sentence].join(" ");
    if (combined.length <= limit) {
      sentences.push(sentence);
    }
  };

  // ✅ 1 Traits + Behaviour
  if (cleanTraits && cleanBehaviour) {
    add(`${getRef(step++, data.gender)} is ${cleanTraits} and ${cleanBehaviour} and approaches learning positively`);
  }

  // ✅ 2 Capabilities
  if (cleanCapabilities) {
    add(`${getRef(step++, data.gender)} shows ${cleanCapabilities}, which supports academic growth`);
  }

  // ✅ 3 Academic
  add(`${getRef(step++, data.gender)} is making steady progress in ${data.subject}`);

  // ✅ 4 Topics
  if (cleanTopics) {
    add(`${getRef(step++, data.gender)} has worked with topics such as ${cleanTopics}`);
  }

  // ✅ 5 Concern
  if (cleanConcern) {
    add(`${getRef(step++, data.gender)} should focus on improving ${cleanConcern}`);
  }

  return sentences.join(" ");
}

export default function App() {
  const [bulkData, setBulkData] = useState([]);
  const [bulkComments, setBulkComments] = useState([]);

  // ✅ UPLOAD FIXED
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const lines = event.target.result.split("\n");
      const data = [];
      const comments = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].trim();
        if (!row) continue;

        const values = row.split(",").map(v => clean(v));
        if (values.length < 9) continue;

        const [name, gender, subject, traits, behaviour, topics, capabilities, concern, length] = values;

        const comment = generateComment({
          name, gender, subject, traits, behaviour, topics, capabilities, concern, length
        });

        data.push(name);
        comments.push(comment);
      }

      setBulkData(data);
      setBulkComments(comments);
    };

    reader.readAsText(file);
  };

  // ✅ DOWNLOAD TEMPLATE
  const downloadTemplate = () => {
    const csv =
      "name,gender,subject,traits,behaviour,topics,capabilities,concern,length\n" +
      "John,male,Mathematics,positive and respectful,well-behaved,algebra,strong reasoning,accuracy,medium\n" +
      "Lisa,female,English Home Language,focused and motivated,engaging,essay writing,clear expression,grammar,long";

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report_template.csv";
    a.click();
  };

  // ✅ WORD EXPORT TABLE ✅✅✅
  const exportToWord = () => {
    let content = "<table border='1' style='border-collapse: collapse;'>";

    for (let i = 0; i < bulkComments.length; i++) {
      content += `
        <tr>
          <td style="padding:8px;"><b>${bulkData[i]}</b></td>
          <td style="padding:8px;">${bulkComments[i]}</td>
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
        {bulkComments.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </Box>
    </div>
  );
}
