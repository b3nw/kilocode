import { describe, test, expect } from "vitest"
import { chutesModels, chutesDefaultModelId } from "../chutes.js"
import type { ChutesModelId } from "../chutes.js"

describe("Chutes Provider Configuration", () => {
	test("should have zai-org/GLM-4.5-FP8-Thinking in ChutesModelId type", () => {
		// This test ensures the type includes our new thinking model
		const thinkingModel: ChutesModelId = "zai-org/GLM-4.5-FP8-Thinking"
		expect(thinkingModel).toBe("zai-org/GLM-4.5-FP8-Thinking")
	})

	test("should have zai-org/GLM-4.5-FP8-Thinking model configuration", () => {
		const model = chutesModels["zai-org/GLM-4.5-FP8-Thinking"]

		expect(model).toBeDefined()
		expect(model).toMatchObject({
			maxTokens: 32768,
			contextWindow: 131072,
			supportsImages: false,
			supportsPromptCache: false,
			inputPrice: 0.41,
			outputPrice: 1.65,
		})

		expect(model.description).toContain("Reasoning-first")
		expect(model.description).toContain("structured thinking traces")
		expect(model.description).toContain("multi-step problems")
	})

	test("should have consistent configuration between base and thinking models", () => {
		const baseModel = chutesModels["zai-org/GLM-4.5-FP8"]
		const thinkingModel = chutesModels["zai-org/GLM-4.5-FP8-Thinking"]

		expect(baseModel).toBeDefined()
		expect(thinkingModel).toBeDefined()

		// Should have the same technical specifications
		expect(baseModel.maxTokens).toBe(thinkingModel.maxTokens)
		expect(baseModel.contextWindow).toBe(thinkingModel.contextWindow)
		expect(baseModel.supportsImages).toBe(thinkingModel.supportsImages)
		expect(baseModel.supportsPromptCache).toBe(thinkingModel.supportsPromptCache)

		// Should have different pricing (thinking model costs more)
		expect(baseModel.inputPrice).not.toBe(thinkingModel.inputPrice)
		expect(baseModel.outputPrice).not.toBe(thinkingModel.outputPrice)
		expect(thinkingModel.inputPrice).toBeGreaterThan(baseModel.inputPrice)
		expect(thinkingModel.outputPrice).toBeGreaterThan(baseModel.outputPrice)

		// Should have different descriptions
		expect(baseModel.description).not.toBe(thinkingModel.description)
		expect(thinkingModel.description).toContain("Reasoning-first")
	})

	test("should follow thinking model naming pattern", () => {
		const thinkingModels = Object.keys(chutesModels).filter((modelId) => modelId.includes("Thinking"))

		expect(thinkingModels).toContain("zai-org/GLM-4.5-FP8-Thinking")

		// All thinking models should contain "Thinking" in their name
		thinkingModels.forEach((modelId) => {
			expect(modelId).toContain("Thinking")
		})

		// Our new model should follow the simple "-Thinking" pattern
		expect("zai-org/GLM-4.5-FP8-Thinking").toMatch(/-Thinking$/)
	})

	test("should have valid model configuration structure", () => {
		const model = chutesModels["zai-org/GLM-4.5-FP8-Thinking"]

		// Test that all required fields are present and have correct types
		expect(typeof model.maxTokens).toBe("number")
		expect(typeof model.contextWindow).toBe("number")
		expect(typeof model.supportsImages).toBe("boolean")
		expect(typeof model.supportsPromptCache).toBe("boolean")
		expect(typeof model.inputPrice).toBe("number")
		expect(typeof model.outputPrice).toBe("number")
		expect(typeof model.description).toBe("string")

		// Test that values are reasonable
		expect(model.maxTokens).toBeGreaterThan(0)
		expect(model.contextWindow).toBeGreaterThan(0)
		expect(model.inputPrice).toBeGreaterThanOrEqual(0)
		expect(model.outputPrice).toBeGreaterThanOrEqual(0)
	})

	test("should be accessible in the models object", () => {
		// Test that we can access the model through the models object
		expect("zai-org/GLM-4.5-FP8-Thinking" in chutesModels).toBe(true)

		// Test that it's not the default model (unless explicitly set)
		expect(chutesDefaultModelId).not.toBe("zai-org/GLM-4.5-FP8-Thinking")
	})

	test("should have unique model ID", () => {
		const modelIds = Object.keys(chutesModels)
		const thinkingModelCount = modelIds.filter((id) => id === "zai-org/GLM-4.5-FP8-Thinking").length

		expect(thinkingModelCount).toBe(1)
	})

	test("should contain thinking-related keywords in description", () => {
		const model = chutesModels["zai-org/GLM-4.5-FP8-Thinking"]
		const description = model.description || ""

		// Should contain thinking-related terms
		expect(description.toLowerCase()).toMatch(/reasoning|thinking|traces/)
		expect(description.toLowerCase()).toMatch(/multi-step|problems|math|code/)
	})
})
