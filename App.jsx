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
// ✅ ✅ ✅ MULTI-STYLE HUMAN COMMENT ENGINE (ONLY CHANGE)
//////////////////////////////////////////////////////////////////////////////////////
function generateComment(data) {
  const p = pronouns[data.gender] || "he";
  const P = capitalise(p);

  const traits = formatList(applyStyleGuide(data.traits));
  const behaviour = applyStyleGuide(data.behaviour);
  const capabilities = applyStyleGuide(data.capabilities);
  const topics = applyStyleGuide(data.topics);
  const concern = applyStyleGuide(data.concern);

  const endings = [
    "and is becoming more confident in his work",
    "and continues to show steady improvement",
    "and applies these skills effectively in class"
  ];

  const topicEndings = [
    "and is showing a growing understanding",
    "and is becoming more comfortable with the content",
    "and is beginning to apply this knowledge independently"
  ];

  const closers = [
    "This is encouraging.",
    "This progress is pleasing.",
    "This is evident in class."
  ];

  const style = Math.floor(Math.random() * 3);
  let sentences = [];

  // ✅ STYLE A
  if (style === 0) {
    if (traits && behaviour) {
      sentences.push(`^n is ${traits}, ${behaviour}, and approaches classroom tasks positively`);
    }

    if (capabilities) {
      sentences.push(`${P} shows ${capabilities}, ${endings[Math.floor(Math.random()*endings.length)]} in ${data.subject}`);
    }

    if (topics) {
      sentences.push(`${P} has worked with topics such as ${topics}, ${topicEndings[Math.floor(Math.random()*topicEndings.length)]}`);
    }

    sentences.push(closers[Math.floor(Math.random()*closers.length)]);

    if (concern) {
      sentences.push(`${P} should continue to work on ${concern} to strengthen overall performance`);
    }
  }

  // ✅ STYLE B
  if (style === 1) {
    if (traits && behaviour) {
      sentences.push(`^n is ${traits} and ${behaviour}, and contributes positively in class`);
    }

    if (topics) {
      sentences.push(`${P} has engaged with work on ${topics}, and is developing greater confidence`);
    }

    if (capabilities) {
      sentences.push(`${P} demonstrates ${capabilities} in ${data.subject}`);
    }

    sentences.push(closers[Math.floor(Math.random()*closers.length)]);

    if (concern) {
      sentences.push(`${P} would benefit from focusing more on ${concern}`);
    }
  }

  // ✅ STYLE C
  if (style === 2) {
    if (traits) {
      sentences.push(`^n is a ${traits} student who approaches learning with a positive attitude`);
    }

    sentences.push(`${P} is making good progress in ${data.subject}`);

    if (capabilities) {
      sentences.push(`${P} shows ${capabilities}, and is becoming increasingly confident`);
    }

    if (topics) {
      sentences.push(`${P} has covered topics such as ${topics}, and applies understanding in class`);
    }

    if (concern) {
      sentences.push(`${P} should focus on ${concern} to continue improving`);
    }
  }

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
