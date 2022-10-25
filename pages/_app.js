// Packages
import { ClerkProvider } from '@clerk/nextjs'

const App = ({ Component, pageProps }) => (
	<ClerkProvider {...{ ...pageProps }}>
		<Component {...pageProps} />
	</ClerkProvider>
)

export default App
