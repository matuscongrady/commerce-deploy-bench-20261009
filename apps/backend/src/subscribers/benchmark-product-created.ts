import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import type { IProductModuleService } from "@medusajs/framework/types"
import { BENCHMARK_REVISION } from "../benchmark-revision"

export default async function benchmarkProductCreated({ event, container }: SubscriberArgs<{ id: string }>) {
  const productService = container.resolve<IProductModuleService>(Modules.PRODUCT)
  const product = await productService.retrieveProduct(event.data.id)
  if (!product.metadata?.benchmark_nonce) return
  await updateProductsWorkflow(container).run({
    input: {
      products: [{ id: product.id, metadata: { ...product.metadata, benchmark_worker_mode: process.env.MEDUSA_WORKER_MODE, benchmark_worker_revision: BENCHMARK_REVISION } }],
    },
  })
}

export const config: SubscriberConfig = { event: "product.created" }
