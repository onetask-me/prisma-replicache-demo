// Packages
import { customAlphabet } from 'nanoid'

// Remove standard chars `_` and `-` for Ids, and also don’t include `I` and `l` due to similarity. See: https://github.com/ai/nanoid#custom-alphabet-or-size
const ApisUtilsNanoid = (n = 6) => {
	const nanoid = customAlphabet('0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', n)

	return nanoid()
}

export default ApisUtilsNanoid
