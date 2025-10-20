import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/sessions/start", async (req, res) => {
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const allUnfinishedSessions = await storage.getAllSessions();
      const unfinishedSession = allUnfinishedSessions.find(s => !s.endTime);
      
      if (unfinishedSession) {
        return res.status(400).json({ 
          error: "Existe una sesión sin finalizar. Por favor, finaliza la sesión anterior antes de iniciar una nueva." 
        });
      }

      const session = await storage.createSession({
        date: today,
        startTime: now,
        status: "working",
        breakfastStart: null,
        breakfastEnd: null,
        snackStart: null,
        snackEnd: null,
        endTime: null,
        totalWorkMinutes: null,
        totalBreakMinutes: null,
        actualWorkMinutes: null,
      });

      res.json(session);
    } catch (error) {
      console.error("Error starting session:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  app.patch("/api/sessions/:id/breakfast-start", async (req, res) => {
    try {
      const { id } = req.params;
      const now = new Date();

      const session = await storage.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Sesión no encontrada" });
      }

      if (session.endTime) {
        return res.status(400).json({ error: "No se puede modificar una sesión finalizada" });
      }

      if (session.status !== "working") {
        return res.status(400).json({ error: "Debes estar trabajando para iniciar una pausa" });
      }

      if (session.breakfastStart) {
        return res.status(400).json({ error: "La pausa de desayuno ya ha sido iniciada" });
      }

      const updated = await storage.updateSession(id, {
        breakfastStart: now,
        status: "breakfast",
      });

      res.json(updated);
    } catch (error) {
      console.error("Error starting breakfast:", error);
      res.status(500).json({ error: "Error al iniciar desayuno" });
    }
  });

  app.patch("/api/sessions/:id/breakfast-end", async (req, res) => {
    try {
      const { id } = req.params;
      const now = new Date();

      const session = await storage.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Sesión no encontrada" });
      }

      if (!session.breakfastStart) {
        return res.status(400).json({ error: "La pausa de desayuno no ha sido iniciada" });
      }

      if (session.breakfastEnd) {
        return res.status(400).json({ error: "La pausa de desayuno ya ha finalizado" });
      }

      const updated = await storage.updateSession(id, {
        breakfastEnd: now,
        status: "working",
      });

      res.json(updated);
    } catch (error) {
      console.error("Error ending breakfast:", error);
      res.status(500).json({ error: "Error al finalizar desayuno" });
    }
  });

  app.patch("/api/sessions/:id/snack-start", async (req, res) => {
    try {
      const { id } = req.params;
      const now = new Date();

      const session = await storage.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Sesión no encontrada" });
      }

      if (session.endTime) {
        return res.status(400).json({ error: "No se puede modificar una sesión finalizada" });
      }

      if (session.status !== "working") {
        return res.status(400).json({ error: "Debes estar trabajando para iniciar una pausa" });
      }

      if (session.snackStart) {
        return res.status(400).json({ error: "La pausa de merienda ya ha sido iniciada" });
      }

      const updated = await storage.updateSession(id, {
        snackStart: now,
        status: "snack",
      });

      res.json(updated);
    } catch (error) {
      console.error("Error starting snack:", error);
      res.status(500).json({ error: "Error al iniciar merienda" });
    }
  });

  app.patch("/api/sessions/:id/snack-end", async (req, res) => {
    try {
      const { id } = req.params;
      const now = new Date();

      const session = await storage.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Sesión no encontrada" });
      }

      if (!session.snackStart) {
        return res.status(400).json({ error: "La pausa de merienda no ha sido iniciada" });
      }

      if (session.snackEnd) {
        return res.status(400).json({ error: "La pausa de merienda ya ha finalizado" });
      }

      const updated = await storage.updateSession(id, {
        snackEnd: now,
        status: "working",
      });

      res.json(updated);
    } catch (error) {
      console.error("Error ending snack:", error);
      res.status(500).json({ error: "Error al finalizar merienda" });
    }
  });

  app.patch("/api/sessions/:id/end", async (req, res) => {
    try {
      const { id } = req.params;
      const now = new Date();

      const session = await storage.getSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Sesión no encontrada" });
      }

      if (session.endTime) {
        return res.status(400).json({ error: "La sesión ya ha finalizado" });
      }

      const totalMinutes = Math.floor(
        (now.getTime() - new Date(session.startTime).getTime()) / (1000 * 60)
      );

      let breakMinutes = 0;
      if (session.breakfastStart && session.breakfastEnd) {
        breakMinutes += Math.floor(
          (new Date(session.breakfastEnd).getTime() - new Date(session.breakfastStart).getTime()) / (1000 * 60)
        );
      }
      if (session.snackStart && session.snackEnd) {
        breakMinutes += Math.floor(
          (new Date(session.snackEnd).getTime() - new Date(session.snackStart).getTime()) / (1000 * 60)
        );
      }

      const updated = await storage.updateSession(id, {
        endTime: now,
        status: "finished",
        totalWorkMinutes: totalMinutes,
        totalBreakMinutes: breakMinutes,
        actualWorkMinutes: Math.max(0, totalMinutes - breakMinutes),
      });

      res.json(updated);
    } catch (error) {
      console.error("Error ending session:", error);
      res.status(500).json({ error: "Error al finalizar sesión" });
    }
  });

  app.get("/api/sessions/today", async (req, res) => {
    try {
      const session = await storage.getTodaySession();
      res.json(session || null);
    } catch (error) {
      console.error("Error getting today's session:", error);
      res.status(500).json({ error: "Error al obtener sesión de hoy" });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (startDate && endDate && typeof startDate === "string" && typeof endDate === "string") {
        const sessions = await storage.getSessionsByDateRange(startDate, endDate);
        return res.json(sessions);
      }

      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error getting sessions:", error);
      res.status(500).json({ error: "Error al obtener sesiones" });
    }
  });

  app.post("/api/sessions/cleanup", async (req, res) => {
    try {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      const cutoffDate = threeYearsAgo.toISOString().split("T")[0];

      const deletedCount = await storage.deleteOldSessions(cutoffDate);
      res.json({ deletedCount, cutoffDate });
    } catch (error) {
      console.error("Error cleaning up old sessions:", error);
      res.status(500).json({ error: "Error al limpiar sesiones antiguas" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
