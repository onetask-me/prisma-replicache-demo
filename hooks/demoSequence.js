// Packages
import { useState, useEffect } from 'react'

const HooksDemoSequence = () => {
	// For demonstration purposes, create a continuous sequence of to-do names, even if browser reloads
	const [demoTodoSequence, setDemoTodoSequence] = useState(1)

	useEffect(() => {
		const stored = window.localStorage.getItem('demo')

		if (stored) setDemoTodoSequence(Number(stored))
	}, [])

	useEffect(() => window.localStorage.setItem('demo', demoTodoSequence), [demoTodoSequence])

	return [demoTodoSequence, setDemoTodoSequence]
}

export default HooksDemoSequence
