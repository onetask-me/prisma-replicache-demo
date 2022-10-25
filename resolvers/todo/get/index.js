const ResolversTodoGet = async tx => {
	const todos = await tx.scan().values().toArray()

	console.log('Get todos:', todos)

	return todos
}

export default ResolversTodoGet