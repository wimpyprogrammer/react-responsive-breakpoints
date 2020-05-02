/* eslint-env mocha */
import configure from 'enzyme-adapter-react-helper';

// Load Sinon and Enzyme polyfills. Refined by useBuiltIns: "entry" in .babelrc.
import 'core-js/stable';

configure();

const testsContext = require.context('./src/', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
