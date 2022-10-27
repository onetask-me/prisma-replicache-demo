// Packages
import { useEffect } from 'react'
import Pusher from 'pusher-js'

const HooksPokeListener = ({ rep }) => {
	console.log('Listening', rep)

	useEffect(() => {
		// Listen for pokes, and pull whenever we get one.
		Pusher.logToConsole = true

		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_REPLICHAT_KEY, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_REPLICHAT_CLUSTER
		})

		const channel = pusher.subscribe('replicache')

		channel.bind('poke', () => {
			console.log('got poked')

			rep.pull()
		})

		return () => pusher.unsubscribe('replicache')
	}, [])
}

export default HooksPokeListener
