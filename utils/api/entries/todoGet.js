const UtilsApiEntriesTodoGet = async ({ cookie, spaceId, tx }) => {
	const prismaTodoFindMany = await tx.todo.findMany({
		where: {
			AND: [{ lastModifiedVersion: { gt: cookie || 0 } }, { spaceId }]
		},
		select: {
			// --- SYSTEM ---
			lastModifiedVersion: true,
			// --- PUBLIC ID ---
			todoId: true,
			// --- FIELDS ---
			isArchived: true,
			isDraft: true,
			name: true,
			sortOrder: true
		}
	})

	return { data: prismaTodoFindMany }
}

export default UtilsApiEntriesTodoGet
