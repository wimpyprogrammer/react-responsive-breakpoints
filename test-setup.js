/* eslint-env mocha */
import configure from 'enzyme-adapter-react-helper';

// ES2015 polyfills for Sinon and Enzyme
import 'airbnb-js-shims/target/es2015';

configure();

const testsContext = require.context('./src/', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
