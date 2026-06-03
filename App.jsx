import React, { useState } from "react";

// UI
const Box = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}>
    {children}
  </div>
);

const Button = (props) => (
  <button style={{ padding: 8, marginTop: 6, marginRight: 5 }} {...props} />
);

// SETTINGS
const charLimits = { short: 180, medium: 300, long: 450 };

// DATA
const subjects = [
  "Mathematics",
  "English Home Language",
  "Afrikaans First Additional Language"
];

const pronouns = { male: "he", female: "she" };

// HELPERS
function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clean(value) {
  return value ? value.trim() : "";
}

// STYLE GUIDE
function applyStyleGuide(text) {
  if (!text) return "";

  return text
    .replace(/insightfil/gi, "insightful")
    .replace(/triganomotary/gi, "trigonometry")
    .replace(/learner|pupil|boy|girl/gi, "student")
    .replace(/maths/gi, "Mathematics")
    .replace(/classwork/gi, "class work")
    .replace(/cocurricular/gi, "co-curricular")
    .replace(/organise/gi, "organize")
    .replace(/recognise/gi, "recognize")
    .replace(/realise/gi, "realize")
    .replace(/needs /gi, "should ")
    .trim();
}

// CORE ENGINE
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

  if (cleanTraits && cleanBehaviour) {
    add(`^n is ${cleanTraits} and ${cleanBehaviour}, and ${p} approaches learning positively`);
  }

  if (cleanCapabilities) {
    add(`${P} shows ${cleanCapabilities}, which supports continued academic growth`);
  }

  add(`${P} is making steady progress in ${data.subject}`);

  if (cleanTopics) {
    add(`${P} has worked with topics such as ${cleanTopics}`);
  }

  if (cleanConcern) {
    add(`${P} should focus on improving ${cleanConcern}`);
  }

  return text + ".";
}

export default function App() {
  const [comment, setComment] = useState("");
  const [bulkComments, setBulkComments] = useState([]);

  // ✅ BULK FIXED
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const lines = event.target.result.split("\n");

      const generated = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].trim();

        if (!row) continue;

        const values = row.split(",").map(v => clean(v));

        if (values.length < 9) continue;

        const [
          name,
          gender,
          subject,
          traits,
          behaviour,
          topics,
          capabilities,
          concern,
          length
        ] = values;

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

        generated.push(result);
      }

      console.log("Generated:", generated); // ✅ Debug help

      setBulkComments(generated);
    };

    reader.readAsText(file);
  };

  // ✅ EXPORT
  const exportToWord = () => {
    const all = bulkComments.join("\n\n");

    const blob = new Blob([all], { type: "application/msword" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report-comments.doc";
    a.click();
  };

  // ✅ TEMPLATE
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
