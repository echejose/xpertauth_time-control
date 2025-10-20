import { workSessions, type WorkSession, type InsertWorkSession } from "@shared/schema";
import { db } from "./db";
import { eq, gte, lte, and, sql } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertWorkSession): Promise<WorkSession>;
  updateSession(id: string, updates: Partial<WorkSession>): Promise<WorkSession | undefined>;
  getSessionById(id: string): Promise<WorkSession | undefined>;
  getTodaySession(): Promise<WorkSession | undefined>;
  getSessionsByDateRange(startDate: string, endDate: string): Promise<WorkSession[]>;
  getAllSessions(): Promise<WorkSession[]>;
  deleteOldSessions(cutoffDate: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async createSession(session: InsertWorkSession): Promise<WorkSession> {
    try {
      const [newSession] = await db
        .insert(workSessions)
        .values(session)
        .returning();
      return newSession;
    } catch (error) {
      console.error("[storage] Error creating session:", error);
      throw new Error("No se pudo crear la sesión");
    }
  }

  async updateSession(id: string, updates: Partial<WorkSession>): Promise<WorkSession | undefined> {
    try {
      const [updated] = await db
        .update(workSessions)
        .set(updates)
        .where(eq(workSessions.id, id))
        .returning();
      return updated || undefined;
    } catch (error) {
      console.error("[storage] Error updating session:", error);
      throw new Error("No se pudo actualizar la sesión");
    }
  }

  async getSessionById(id: string): Promise<WorkSession | undefined> {
    try {
      const [session] = await db
        .select()
        .from(workSessions)
        .where(eq(workSessions.id, id));
      return session || undefined;
    } catch (error) {
      console.error("[storage] Error getting session by ID:", error);
      throw new Error("No se pudo obtener la sesión");
    }
  }

  async getTodaySession(): Promise<WorkSession | undefined> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [session] = await db
        .select()
        .from(workSessions)
        .where(eq(workSessions.date, today))
        .orderBy(sql`${workSessions.startTime} DESC`)
        .limit(1);
      return session || undefined;
    } catch (error) {
      console.error("[storage] Error getting today's session:", error);
      throw new Error("No se pudo obtener la sesión de hoy");
    }
  }

  async getSessionsByDateRange(startDate: string, endDate: string): Promise<WorkSession[]> {
    try {
      return await db
        .select()
        .from(workSessions)
        .where(
          and(
            gte(workSessions.date, startDate),
            lte(workSessions.date, endDate)
          )
        )
        .orderBy(sql`${workSessions.date} DESC, ${workSessions.startTime} DESC`);
    } catch (error) {
      console.error("[storage] Error getting sessions by date range:", error);
      throw new Error("No se pudieron obtener las sesiones");
    }
  }

  async getAllSessions(): Promise<WorkSession[]> {
    try {
      return await db
        .select()
        .from(workSessions)
        .orderBy(sql`${workSessions.date} DESC, ${workSessions.startTime} DESC`);
    } catch (error) {
      console.error("[storage] Error getting all sessions:", error);
      throw new Error("No se pudieron obtener las sesiones");
    }
  }

  async deleteOldSessions(cutoffDate: string): Promise<number> {
    try {
      const result = await db
        .delete(workSessions)
        .where(lte(workSessions.date, cutoffDate));
      return result.rowCount || 0;
    } catch (error) {
      console.error("[storage] Error deleting old sessions:", error);
      throw new Error("No se pudieron eliminar las sesiones antiguas");
    }
  }
}

export const storage = new DatabaseStorage();
