import { Database } from "bun:sqlite";
export const db = new Database("database.sqlite");
db.exec("CREATE TABLE IF NOT EXISTS counter('count' INT);");
const insert = () => db.prepare("INSERT INTO counter (count) VALUES ?").run(42);
export const count = () => (db.query("select count from counter").get() as {
  count: number
}).count;
