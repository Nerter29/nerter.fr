import db from './db.js';

const insertScore = db.prepare('INSERT OR IGNORE INTO difficulty (id, label) VALUES (?, ?)');
insertScore.run(1, "facile");
insertScore.run(2, "normal");
insertScore.run(3, "difficile");