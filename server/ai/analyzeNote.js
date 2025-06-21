const nlp = require("compromise");

function analyzeNoteJS(note) {
  const doc = nlp(note);
  const nouns = doc.nouns().out("array");
  const verbs = doc.verbs().out("array");
  const keywords = [...new Set([...nouns, ...verbs])];
  return { keywords };
}

module.exports = { analyzeNoteJS };