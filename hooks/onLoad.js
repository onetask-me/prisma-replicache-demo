// Packages
import { useEffect } from 'react'
import { getCookie } from 'cookies-next'

const HooksOnLoad = ({ setSpaceId, setUserId }) => {
	useEffect(() => {
		setSpaceId(window.localStorage.getItem('spaceId1'))

		setUserId(getCookie('userId'))
	}, [])
}

export default HooksOnLoad
