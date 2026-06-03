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
const charLimits = { short: 200, medium: 400, long: 600 };

const pronouns = { male: "he", female: "she" };

// HELPERS
function capitalise(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clean(value) {
  return value ? value.trim() : "";
}

function applyStyleGuide(text) {
  if (!text) return "";
  return text
    .replace(/insightfil/gi, "insightful")
    .replace(/triganomotary/gi, "trigonometry")
    .replace(/learner|pupil|boy|girl/gi, "student")
    .replace(/maths/gi, "Mathematics")
    .replace(/needs /gi, "should ")
    .trim();
}

// ✅ FORMAT LIST (fixes "and and and")
function formatList(text) {
  if (!text) return "";
  return text.replace(/ and /gi, ", ");
}

//////////////////////////////////////////////////////////////////////////////////////
// ✅ ✅ ✅ FINAL HUMAN COMMENT ENGINE (REPLACED)
//////////////////////////////////////////////////////////////////////////////////////
function generateComment(data) {
  const p = pronouns[data.gender] || "he";
  const P = capitalise(p);

  const traits = formatList(applyStyleGuide(data.traits));
  const behaviour = applyStyleGuide(data.behaviour);
  const capabilities = applyStyleGuide(data.capabilities);
  const topics = applyStyleGuide(data.topics);
  const concern = applyStyleGuide(data.concern);

  // ✅ Variation banks
  const capabilityEndings = [
    "and is becoming more confident in applying these skills",
    "and applies these skills effectively in class",
    "and continues to grow in confidence"
  ];

  const topicEndings = [
    "and is showing a growing understanding",
    "and is becoming more comfortable with the work",
    "and applies this knowledge in class tasks"
  ];

  const shortClosers = [
    "This is encouraging.",
    "This is evident in class.",
    "This progress is pleasing."
  ];

  let sentences = [];

  // ✅ Sentence 1 (natural opening)
  if (traits && behaviour) {
    sentences.push(
      `^n is ${traits}, ${behaviour}, and approaches classroom tasks with a positive attitude`
    );
  }

  // ✅ Sentence 2 (capability + academic)
  if (capabilities) {
    sentences.push(
      `${P} shows ${capabilities}, ${capabilityEndings[Math.floor(Math.random()*capabilityEndings.length)]} in ${data.subject}`
    );
  } else {
    sentences.push(
      `${P} is making steady progress in ${data.subject} and is becoming more confident in his work`
    );
  }

  // ✅ Sentence 3 (topics)
  if (topics) {
    sentences.push(
      `${P} has worked with topics such as ${topics}, ${topicEndings[Math.floor(Math.random()*topicEndings.length)]}`
    );
  }

  // ✅ Sentence 4 (short human sentence)
  sentences.push(
    shortClosers[Math.floor(Math.random()*shortClosers.length)]
  );

  // ✅ Sentence 5 (concern)
  if (concern) {
    sentences.push(
      `${P} should continue to work on ${concern} to strengthen overall performance`
    );
  }

  // ✅ Build final comment
  return sentences
    .map(s => capitalise(s.trim()) + (s.endsWith(".") ? "" : "."))
    .join(" ");
}

//////////////////////////////////////////////////////////////////////////////////////
// ✅ REST OF APP (UNCHANGED)
//////////////////////////////////////////////////////////////////////////////////////

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

        newNames.push(name);

        newComments.push(
          generateComment({
            gender,
            subject,
            traits,
            behaviour,
            topics,
            capabilities,
            concern,
            length
          })
        );
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
