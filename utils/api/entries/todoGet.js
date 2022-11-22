const UtilsApiEntriesTodoGet = async ({ spaceId, tx, userId, versionAt }) => {
	// Important: we need to make sure that the `spaceId` provided in the query is also owned by user
	const prismaTodoFindMany = await tx.todo.findMany({
		where: {
			AND: [{ versionUpdatedAt: { gt: versionAt ?? 0 } }, { spaceId }, { Space: { userId } }]
		},
		select: {
			// --- SYSTEM ---
			versionUpdatedAt: true,
			// --- PUBLIC ID ---
			todoId: true,
			// --- FIELDS ---
			isArchived: true,
			isDeleted: true,
			isDraft: true,
			name: true,
			sortOrder: true
		}
	})

	return { data: prismaTodoFindMany }
}

export default UtilsApiEntriesTodoGet
