import { deleteCookie } from 'cookies-next'

const UtilsResetAccount = ({ setSpaceId, setUserId }) => {
	deleteCookie('userId')
	setUserId(null)

	window.localStorage.removeItem('spaceId1')
	window.localStorage.removeItem('spaceId2')
	setSpaceId(null)
}

export default UtilsResetAccount
