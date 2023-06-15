/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	ExerciseSessions = "exercise_sessions",
	Exercises = "exercises",
	Hooks = "hooks",
	LabSessions = "lab_sessions",
	Labs = "labs",
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

export type ExerciseSessionsRecord = {
	user: RecordIdString
	startTime: IsoDateString
	endTime?: IsoDateString
	exercise: RecordIdString
	agentRunning?: boolean
}

export type ExercisesRecord = {
	title?: string
	description?: string
	lab: RecordIdString
	docs?: string
	hint?: string
	solution?: string
	check?: string
	bootstrap?: string
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

export type LabSessionsRecord = {
	user: RecordIdString
	startTime: IsoDateString
	endTime?: IsoDateString
	lab: RecordIdString
	clusterRunning?: boolean
}

export type LabsRecord = {
	title?: string
	description?: string
	docs?: string
}

export type UsersRecord = {
	name?: string
	avatar?: string
	totalScore?: number
	avgMinutesToSolution?: number
}

// Response types include system fields and match responses from the PocketBase API
export type ExerciseSessionsResponse<Texpand = unknown> = Required<ExerciseSessionsRecord> & BaseSystemFields<Texpand>
export type ExercisesResponse<Texpand = unknown> = Required<ExercisesRecord> & BaseSystemFields<Texpand>
export type HooksResponse = Required<HooksRecord> & BaseSystemFields
export type LabSessionsResponse<Texpand = unknown> = Required<LabSessionsRecord> & BaseSystemFields<Texpand>
export type LabsResponse = Required<LabsRecord> & BaseSystemFields
export type UsersResponse = Required<UsersRecord> & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	exercise_sessions: ExerciseSessionsRecord
	exercises: ExercisesRecord
	hooks: HooksRecord
	lab_sessions: LabSessionsRecord
	labs: LabsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	exercise_sessions: ExerciseSessionsResponse
	exercises: ExercisesResponse
	hooks: HooksResponse
	lab_sessions: LabSessionsResponse
	labs: LabsResponse
	users: UsersResponse
}