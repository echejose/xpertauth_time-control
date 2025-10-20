import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workSessions = pgTable("work_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  breakfastStart: timestamp("breakfast_start"),
  breakfastEnd: timestamp("breakfast_end"),
  snackStart: timestamp("snack_start"),
  snackEnd: timestamp("snack_end"),
  endTime: timestamp("end_time"),
  totalWorkMinutes: integer("total_work_minutes"),
  totalBreakMinutes: integer("total_break_minutes"),
  actualWorkMinutes: integer("actual_work_minutes"),
  status: text("status").notNull().default("working"),
});

export const insertWorkSessionSchema = createInsertSchema(workSessions).omit({
  id: true,
});

export type InsertWorkSession = z.infer<typeof insertWorkSessionSchema>;
export type WorkSession = typeof workSessions.$inferSelect;
