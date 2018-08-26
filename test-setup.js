/* eslint-env mocha */
import configure from 'enzyme-adapter-react-helper';

// Polyfill string.startsWith() required for Sinon
import 'string.prototype.startswith';

configure();

const testsContext = require.context('./src/', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
