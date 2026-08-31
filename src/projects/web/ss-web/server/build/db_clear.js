import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, '../data/database.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
    delete table score;
    delete table user;
    create table IF NOT EXISTS user(
        uid varchar,
        pseudo varchar,
        constraint user_pk primary key(uid)
    );
    create table IF NOT EXISTS difficulty(
        id int,
        label varchar,
        constraint difficulty_pk primary key(id)
    );
    create table IF NOT EXISTS score(
        user_uid varchar,
        difficulty_id int,
        max_score int,
        updated_at Integer,
        constraint score_pk primary key(user_uid, difficulty_id),
        constraint score_pk_user foreign key(user_uid) references user(uid),
        constraint score_pk_difficulty foreign key(difficulty_id) references difficulty(id)
    );
`);
export default db;
