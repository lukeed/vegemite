import { render } from 'preact';
import App from './components/App';

let elem = document.body;
let root = render(<App/>, elem, elem.firstElementChild);

if (process.env.NODE_ENV === 'development' && module.hot) {
	module.hot.accept('./components/App', New => {
		New = require('./components/App').default;
		root = render(<New />, elem, root);
	});
}
