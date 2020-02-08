import { h, render } from 'preact';
import App from './components/App';

let elem = document.body;
render(<App/>, elem, elem.firstElementChild!);

if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept('./components/App', (New: typeof App) => {
		New = require('./components/App').default;
		render(<New />, elem, elem.firstElementChild!);
	});
}
