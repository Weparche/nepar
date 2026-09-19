export function getContactWorkerUrl() {
  return (import.meta.env.VITE_WORKER_URL || "").replace(/\/$/, "");
}

/** Sends every public inquiry through the existing Nepar contact Worker. */
export async function submitContactLead(payload) {
  const workerUrl = getContactWorkerUrl();
  if (!workerUrl) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response;
  try {
    response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    throw error.name === "AbortError" ? new Error("timeout") : error;
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error("send_failed");
  return true;
}
