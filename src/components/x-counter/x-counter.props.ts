import {db, count} from '../../db';

export const add = () => {
  db.prepare("UPDATE counter SET count = ?").run(count()+1);
  return count();
} 