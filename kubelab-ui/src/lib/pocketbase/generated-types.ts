/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Applications = "applications",
	Deployments = "deployments",
	HelmRepositories = "helmRepositories",
	HelmRepositoryCredentials = "helmRepositoryCredentials",
	Hooks = "hooks",
	KeyValues = "keyValues",
	Repositories = "repositories",
	RepositoryCredentials = "repositoryCredentials",
	SecretKeyValues = "secretKeyValues",
	Stages = "stages",
	Templates = "templates",
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

export type ApplicationsRecord = {
	name: string
	helmRepository?: RecordIdString
	stages?: RecordIdString[]
}

export type DeploymentsRecord = {
	name: string
	description?: string
	repositories: RecordIdString[]
	keyValues?: RecordIdString[]
	secretKeyValues?: RecordIdString[]
}

export type HelmRepositoriesRecord = {
	name: string
	url: string
	helmRepositoryCredentials?: RecordIdString
}

export type HelmRepositoryCredentialsRecord = {
	username: string
	password: string
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

export type KeyValuesRecord = {
	key: string
	value?: string
	displayName?: string
}

export enum RepositoriesStatusOptions {
	"PENDING" = "PENDING",
	"SYNCING" = "SYNCING",
	"UP-TO-DATE" = "UP-TO-DATE",
	"ERROR" = "ERROR",
}
export type RepositoriesRecord = {
	name: string
	url: string
	status: RepositoriesStatusOptions
	repositoryCredentials?: RecordIdString
}

export type RepositoryCredentialsRecord = {
	username?: string
	password?: string
}

export type SecretKeyValuesRecord = {
	key: string
	value?: string
	displayName?: string
}

export type StagesRecord = {
	name: string
	parentStage?: RecordIdString
	deployments?: RecordIdString[]
	template?: RecordIdString
	keyValues?: RecordIdString[]
	secretKeyValues?: RecordIdString[]
}

export type TemplatesRecord = {
	name: string
	description: string
	keyValues?: RecordIdString[]
	secretKeyValues?: RecordIdString[]
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ApplicationsResponse<Texpand = unknown> = Required<ApplicationsRecord> & BaseSystemFields<Texpand>
export type DeploymentsResponse<Texpand = unknown> = Required<DeploymentsRecord> & BaseSystemFields<Texpand>
export type HelmRepositoriesResponse<Texpand = unknown> = Required<HelmRepositoriesRecord> & BaseSystemFields<Texpand>
export type HelmRepositoryCredentialsResponse = Required<HelmRepositoryCredentialsRecord> & BaseSystemFields
export type HooksResponse = Required<HooksRecord> & BaseSystemFields
export type KeyValuesResponse = Required<KeyValuesRecord> & BaseSystemFields
export type RepositoriesResponse<Texpand = unknown> = Required<RepositoriesRecord> & BaseSystemFields<Texpand>
export type RepositoryCredentialsResponse = Required<RepositoryCredentialsRecord> & BaseSystemFields
export type SecretKeyValuesResponse = Required<SecretKeyValuesRecord> & BaseSystemFields
export type StagesResponse<Texpand = unknown> = Required<StagesRecord> & BaseSystemFields<Texpand>
export type TemplatesResponse<Texpand = unknown> = Required<TemplatesRecord> & BaseSystemFields<Texpand>
export type UsersResponse = Required<UsersRecord> & AuthSystemFields

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	applications: ApplicationsRecord
	deployments: DeploymentsRecord
	helmRepositories: HelmRepositoriesRecord
	helmRepositoryCredentials: HelmRepositoryCredentialsRecord
	hooks: HooksRecord
	keyValues: KeyValuesRecord
	repositories: RepositoriesRecord
	repositoryCredentials: RepositoryCredentialsRecord
	secretKeyValues: SecretKeyValuesRecord
	stages: StagesRecord
	templates: TemplatesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	applications: ApplicationsResponse
	deployments: DeploymentsResponse
	helmRepositories: HelmRepositoriesResponse
	helmRepositoryCredentials: HelmRepositoryCredentialsResponse
	hooks: HooksResponse
	keyValues: KeyValuesResponse
	repositories: RepositoriesResponse
	repositoryCredentials: RepositoryCredentialsResponse
	secretKeyValues: SecretKeyValuesResponse
	stages: StagesResponse
	templates: TemplatesResponse
	users: UsersResponse
}
