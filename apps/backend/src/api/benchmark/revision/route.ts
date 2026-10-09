import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BENCHMARK_REVISION } from "../../../benchmark-revision"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({ revision: BENCHMARK_REVISION, workerMode: process.env.MEDUSA_WORKER_MODE })
}
