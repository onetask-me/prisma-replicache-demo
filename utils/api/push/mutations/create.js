// Utilities
import utilGenerateId from 'utils/generateId'

const UtilsApiPushMutationsCreate = async ({ args, nextMutationId, tx, userId }) =>
	await tx.todo.create({
		data: {
			// --- PUBLIC ID ---
			todoId: utilGenerateId(),
			// --- RELATIONS ---
			User: { connect: { userId } },
			// --- FIELDS ---
			...args,
			lastModifiedVersion: nextMutationId
		}
	})

export default UtilsApiPushMutationsCreate
