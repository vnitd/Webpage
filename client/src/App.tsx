import React from 'react'
import { getAPI } from './utils/request'

function App() {
	const [msg, setMsg] = React.useState<string>()

	React.useEffect(() => {
		if (!msg)
			(async () => {
				const res: any = await getAPI('/api/test')
				setMsg(res.message)
			})()
	})

	return (
		<div className="App">
			<header className="App-header">
				<p>{msg ?? ''}</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
