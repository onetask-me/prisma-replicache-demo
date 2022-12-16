// Packages
import { useState, useEffect } from 'react'
import { getCookie } from 'cookies-next'

const HooksDesignLayouts = () => {
	const [spaceId, setSpaceId] = useState(null)
	const [userId, setUserId] = useState(null)

	useEffect(() => {
		setSpaceId(window.localStorage.getItem('spaceId'))

		setUserId(getCookie('userId'))
	}, [])

	return { data: { spaceId, userId } }
}

export default HooksDesignLayouts
