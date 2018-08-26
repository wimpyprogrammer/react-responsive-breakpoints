/* eslint-env mocha */
import configure from 'enzyme-adapter-react-helper';

configure();

const testsContext = require.context('./src/', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
