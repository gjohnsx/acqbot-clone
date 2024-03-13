import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const opportunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  expectedBudget: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type Opportunity = z.infer<typeof opportunitySchema>;
