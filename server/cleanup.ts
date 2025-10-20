import { storage } from "./storage";

export async function cleanupOldSessions() {
  try {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const cutoffDate = threeYearsAgo.toISOString().split("T")[0];

    const deletedCount = await storage.deleteOldSessions(cutoffDate);
    console.log(`[cleanup] Deleted ${deletedCount} sessions older than ${cutoffDate}`);
    return deletedCount;
  } catch (error) {
    console.error("[cleanup] Error cleaning up old sessions:", error);
    return 0;
  }
}

export function scheduleCleanup() {
  const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;
  
  cleanupOldSessions();
  
  setInterval(() => {
    cleanupOldSessions();
  }, CLEANUP_INTERVAL);
  
  console.log("[cleanup] Automatic cleanup scheduled (runs daily)");
}
