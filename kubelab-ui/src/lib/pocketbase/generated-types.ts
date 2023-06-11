/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Exercises = "exercises",
	Hooks = "hooks",
	Labs = "labs",
	Sessions = "sessions",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ExercisesRecord = {
	title?: string
	description?: string
	docs?: string
	hint?: string
	solution?: string
	check?: string
	bootstrap?: string
	agentRunning?: boolean
}

export enum HooksEventOptions {
	"insert" = "insert",
	"update" = "update",
	"delete" = "delete",
}

export enum HooksActionTypeOptions {
	"command" = "command",
	"post" = "post",
}
export type HooksRecord = {
	collection: string
	event: HooksEventOptions
	action_type: HooksActionTypeOptions
	action: string
	action_params?: string
	expands?: string
	disabled?: boolean
}

export type LabsRecord = {
	title?: string
	description?: string
	exercises: RecordIdString[]
	docs?: string
}

export type SessionsRecord = {
	user?: RecordIdString
	title?: string
	startTime?: IsoDateString
	endTime?: IsoDateString
	lab: RecordIdString
	score?: number
	clusterRunning?: boolean
}

export type UsersRecord = {
	name?: string
	avatar?: string
	totalScore?: number
	avgMinutesToSolution?: number
}

// Response types include system fields and match responses from the PocketBase API
export type ExercisesResponse = Required<ExercisesRecord> & BaseSystemFields
export type HooksResponse = Required<HooksRecord> & BaseSystemFields
export type LabsResponse<Texpand = unknown> = Required<LabsRecord> & BaseSystemFields<Texpand>
export type SessionsResponse<Texpand = unknown> = Required<SessionsRecord> & BaseSystemFields<Texpand>
export type UsersResponse = Required<UsersRecord> & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	exercises: ExercisesRecord
	hooks: HooksRecord
	labs: LabsRecord
	sessions: SessionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	exercises: ExercisesResponse
	hooks: HooksResponse
	labs: LabsResponse
	sessions: SessionsResponse
	users: UsersResponse
}