import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { labels, priorities, statuses } from "./data";

const opportunities = Array.from({ length: 100 }, () => ({
  id: `OPP-${faker.number.int({ min: 1000, max: 9999 })}`,
  title: faker.hacker
    .phrase()
    .replace(/^./, (letter: string) => letter.toUpperCase()),
  status: faker.helpers.arrayElement(statuses).value,
  label: faker.helpers.arrayElement(labels).value,
  priority: faker.helpers.arrayElement(priorities).value,
  expectedBudget: faker.finance.amount({
    min: 150000,
    max: 5000000,
    dec: 0,
    symbol: "$",
    autoFormat: true,
  }),
  startDate: faker.date.recent(30).toISOString(),
  endDate: faker.date.future(30).toISOString(),
}));

fs.writeFileSync(
  path.join(__dirname, "opportunities.json"),
  JSON.stringify(opportunities, null, 2)
);

console.log("✅ Opportunities data generated.");
