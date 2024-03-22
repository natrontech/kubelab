/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Companies = "companies",
	ExerciseSessionLogs = "exercise_session_logs",
	ExerciseSessions = "exercise_sessions",
	Exercises = "exercises",
	Faqs = "faqs",
	Features = "features",
	Hooks = "hooks",
	LabSessions = "lab_sessions",
	Labs = "labs",
	Notifications = "notifications",
	Plans = "plans",
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

export type CompaniesRecord = {
	name: string
	logo: string
}

export enum ExerciseSessionLogsTypeOptions {
	"start" = "start",
	"end" = "end",
}
export type ExerciseSessionLogsRecord = {
	user: RecordIdString
	timestamp: IsoDateString
	exercise_session: RecordIdString
	type: ExerciseSessionLogsTypeOptions
}

export type ExerciseSessionsRecord = {
	agentRunning?: boolean
	user: RecordIdString
	startTime?: IsoDateString
	endTime?: IsoDateString
	exercise: RecordIdString
}

export type ExercisesRecord = {
	title?: string
	description?: string
	docs?: string
	hint?: string
	solution?: string
	check?: string
	bootstrap?: string
	lab: RecordIdString
}

export type FaqsRecord = {
	question?: string
	answer?: string
}

export type FeaturesRecord = {
	feature?: string
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
	startTime?: IsoDateString
	endTime?: IsoDateString
	lab: RecordIdString
	clusterRunning?: boolean
}

export type LabsRecord = {
	title?: string
	description?: string
	docs?: string
}

export enum NotificationsTypeOptions {
	"help" = "help",
}
export type NotificationsRecord = {
	type: NotificationsTypeOptions
	user: RecordIdString
	done?: boolean
	exercise?: RecordIdString
}

export type PlansRecord = {
	name: string
	description: string
	price?: number
	features: RecordIdString[]
	optionalFeatures?: RecordIdString[]
}

export enum UsersRoleOptions {
	"user" = "user",
	"admin" = "admin",
}
export type UsersRecord = {
	name?: string
	avatar?: string
	plan?: RecordIdString
	role: UsersRoleOptions
	company?: RecordIdString
	workshop?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type CompaniesResponse = Required<CompaniesRecord> & BaseSystemFields
export type ExerciseSessionLogsResponse<Texpand = unknown> = Required<ExerciseSessionLogsRecord> & BaseSystemFields<Texpand>
export type ExerciseSessionsResponse<Texpand = unknown> = Required<ExerciseSessionsRecord> & BaseSystemFields<Texpand>
export type ExercisesResponse<Texpand = unknown> = Required<ExercisesRecord> & BaseSystemFields<Texpand>
export type FaqsResponse = Required<FaqsRecord> & BaseSystemFields
export type FeaturesResponse = Required<FeaturesRecord> & BaseSystemFields
export type HooksResponse = Required<HooksRecord> & BaseSystemFields
export type LabSessionsResponse<Texpand = unknown> = Required<LabSessionsRecord> & BaseSystemFields<Texpand>
export type LabsResponse = Required<LabsRecord> & BaseSystemFields
export type NotificationsResponse<Texpand = unknown> = Required<NotificationsRecord> & BaseSystemFields<Texpand>
export type PlansResponse<Texpand = unknown> = Required<PlansRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	companies: CompaniesRecord
	exercise_session_logs: ExerciseSessionLogsRecord
	exercise_sessions: ExerciseSessionsRecord
	exercises: ExercisesRecord
	faqs: FaqsRecord
	features: FeaturesRecord
	hooks: HooksRecord
	lab_sessions: LabSessionsRecord
	labs: LabsRecord
	notifications: NotificationsRecord
	plans: PlansRecord
	users: UsersRecord
}

export type CollectionResponses = {
	companies: CompaniesResponse
	exercise_session_logs: ExerciseSessionLogsResponse
	exercise_sessions: ExerciseSessionsResponse
	exercises: ExercisesResponse
	faqs: FaqsResponse
	features: FeaturesResponse
	hooks: HooksResponse
	lab_sessions: LabSessionsResponse
	labs: LabsResponse
	notifications: NotificationsResponse
	plans: PlansResponse
	users: UsersResponse
}