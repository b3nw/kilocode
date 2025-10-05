import { z } from "zod"

import type { ModelInfo } from "@roo-code/types"

import type { ApiHandlerOptions } from "../../../shared/api"
import { parseApiPrice } from "../../../shared/cost"
import { DEFAULT_HEADERS } from "../constants"

/**
 * NanoGptModel
 */

const nanoGptPricingSchema = z.object({
	prompt: z.string().nullish(),
	completion: z.string().nullish(),
})

export const nanoGptModelSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	context_length: z.number(),
	max_completion_tokens: z.number().nullish(),
	pricing: nanoGptPricingSchema.optional(),
})

export type NanoGptModel = z.infer<typeof nanoGptModelSchema>

/**
 * NanoGptModelsResponse
 */

const nanoGptModelsResponseSchema = z.object({
	data: z.array(nanoGptModelSchema),
})

/**
 * getNanoGptModels
 */

export async function getNanoGptModels(
	options?: ApiHandlerOptions & { headers?: Record<string, string> },
): Promise<Record<string, ModelInfo>> {
	const models: Record<string, ModelInfo> = {}
	const modelListType = options?.nanoGptModelList || "all"

	let path: string
	switch (modelListType) {
		case "personalized":
			path = "/api/personalized/v1/models"
			break
		case "subscription":
			path = "/api/subscription/v1/models"
			break
		case "all":
		default:
			path = "/api/v1/models"
			break
	}

	const baseURL = "https://nano-gpt.com"

	try {
		const response = await fetch(`${baseURL}${path}`, {
			headers: { ...DEFAULT_HEADERS, ...(options?.headers ?? {}) },
		})
		const json = await response.json()
		const result = nanoGptModelsResponseSchema.safeParse(json)

		if (!result.success) {
			throw new Error(
				"Nano-GPT models response is invalid: " + JSON.stringify(result.error.format(), undefined, 2),
			)
		}

		for (const model of result.data.data) {
			models[model.id] = parseNanoGptModel({
				model,
				displayName: model.name,
			})
		}
	} catch (error) {
		console.error(`Error fetching Nano-GPT models: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`)
		throw error
	}

	return models
}

/**
 * parseNanoGptModel
 */

export const parseNanoGptModel = ({ model, displayName }: { model: NanoGptModel; displayName?: string }): ModelInfo => {
	const modelInfo: ModelInfo = {
		maxTokens: model.max_completion_tokens || Math.ceil(model.context_length * 0.2),
		contextWindow: model.context_length,
		inputPrice: parseApiPrice(model.pricing?.prompt),
		outputPrice: parseApiPrice(model.pricing?.completion),
		description: model.description,
		displayName,
	}

	return modelInfo
}
