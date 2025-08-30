export type Anomaly = {
  id: string
  type: "double-count" | "volume-spike" | "suspicious-pattern"
  severity: "low" | "medium" | "high"
  details: string
  relatedIds?: string[]
  ts: number
}

// Simple rules:
// - Double-count: same IoT reading ID used in >1 certification or mint
// - Volume spike: producer mints > X kg within short window
// - Pattern: repeated buy/sell loop between same parties
export function detectAnomalies(context: {
  iotReadings: any[]
  certifications: any[]
  credits: any[]
  transactions: any[]
}) {
  const anomalies: Anomaly[] = []
  const now = Date.now()

  // Double-count
  const certByReading: Record<string, number> = {}
  for (const c of context.certifications) {
    if (!c.readingId) continue
    certByReading[c.readingId] = (certByReading[c.readingId] || 0) + 1
    if (certByReading[c.readingId] > 1) {
      anomalies.push({
        id: "a-" + Math.random().toString(36).slice(2),
        type: "double-count",
        severity: "high",
        details: `IoT reading ${c.readingId} used in multiple certifications`,
        relatedIds: [c._id, c.readingId],
        ts: now,
      })
    }
  }

  // Volume spike (threshold 100,000 kg within 24h)
  const byProducer: Record<string, { total: number; timestamps: number[] }> = {}
  for (const cr of context.credits) {
    const p = cr.producerDid
    byProducer[p] = byProducer[p] || { total: 0, timestamps: [] }
    byProducer[p].total += cr.amountKg || 0
    byProducer[p].timestamps.push(new Date(cr.createdAt || now).getTime())
  }
  for (const p in byProducer) {
    const times = byProducer[p].timestamps.sort()
    const windowMs = 24 * 60 * 60 * 1000
    let windowSum = 0
    let start = 0
    for (let end = 0; end < times.length; end++) {
      windowSum += context.credits[end]?.amountKg || 0
      while (times[end] - times[start] > windowMs) {
        windowSum -= context.credits[start]?.amountKg || 0
        start++
      }
      if (windowSum > 100000) {
        anomalies.push({
          id: "a-" + Math.random().toString(36).slice(2),
          type: "volume-spike",
          severity: "medium",
          details: `Unusual mint volume for producer ${p} in 24h window`,
          ts: now,
        })
        break
      }
    }
  }

  // Suspicious loop pattern
  const pairCounts: Record<string, number> = {}
  for (const tx of context.transactions) {
    if (tx.type !== "trade") continue
    const key = `${tx.sellerDid}->${tx.buyerDid}`
    pairCounts[key] = (pairCounts[key] || 0) + 1
    if (pairCounts[key] > 3) {
      anomalies.push({
        id: "a-" + Math.random().toString(36).slice(2),
        type: "suspicious-pattern",
        severity: "low",
        details: `Repeated trades between ${tx.sellerDid} and ${tx.buyerDid}`,
        ts: now,
      })
    }
  }

  return anomalies
}
