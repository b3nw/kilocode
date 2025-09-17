import { z } from "zod"

export const ghostServiceSettingsSchema = z
	.object({
		enableAutoTrigger: z.boolean().optional(),
		autoTriggerDelay: z.number().min(1).max(30).default(3).optional(),
		enableQuickInlineTaskKeybinding: z.boolean().optional(),
		enableSmartInlineTaskKeybinding: z.boolean().optional(),
		enableCustomProvider: z.boolean().optional(),
		apiConfigId: z.string().optional(),
	})
	.optional()

export type GhostServiceSettings = z.infer<typeof ghostServiceSettingsSchema>

export const commitRangeSchema = z.object({
	from: z.string(),
	to: z.string(),
})

export type CommitRange = z.infer<typeof commitRangeSchema>

export const kiloCodeClineMessageMetaDataSchema = z.object({
	commitRange: commitRangeSchema.optional(),
})

export type KiloCodeClineMessageMetaData = z.infer<typeof kiloCodeClineMessageMetaDataSchema>

const toggle = z.enum(["enable", "disable"])

export const kiloCodeModelMetaDataSchema = z.object({
	preferredIndex: z.number().optional(),
	recommendations: z
		.object({
			diff: toggle.optional(),
			todoList: toggle.optional(),
		})
		.optional(),
})

export type KiloCodeModelMetaData = z.infer<typeof kiloCodeModelMetaDataSchema>
