/* eslint-env browser, mocha */
/* global viewport:false */ // viewport provided by karma-viewport
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import once from 'lodash.once';

import withBreakpointsCustom from './withBreakpointsCustom';
import '../test-setup';

const customStylesId = 'karma-test-styles';
let isWindowResized = false;

/**
 * Accurately report async assertion failures.
 * From https://stackoverflow.com/a/15208067.
 */
function assertAsync(done, fnAssertions) {
	try {
		fnAssertions();
		done();
	} catch (err) {
		done(err);
	}
}

function removeCustomStyles() {
	const styleSheet = document.getElementById(customStylesId);
	if (!styleSheet) { return; }
	styleSheet.disabled = true;
	styleSheet.parentNode.removeChild(styleSheet);
}

function addCustomStyles(cssDeclarations) {
	removeCustomStyles();
	const style = document.createElement('style');
	style.type = 'text/css';
	style.id = customStylesId;
	style.appendChild(document.createTextNode(cssDeclarations));
	document.head.appendChild(style);
}

function resizeWindowToWidth(newWidth) {
	viewport.set(newWidth);
	isWindowResized = true;
}

chai.use(dirtyChai);
chai.use(sinonChai);

const InnerComponent = () => <div />;

const sandbox = sinon.createSandbox();

afterEach((done) => {
	sandbox.resetHistory();

	if (isWindowResized) {
		viewport.reset();
		isWindowResized = false;
		// Resetting the viewport does not finish immediately.
		window.addEventListener('resize', once(() => done()));
	} else {
		done();
	}
});

after(() => sandbox.restore());

describe('withBreakpointsCustom wraps another component', () => {
	let component;

	before(() => {
		const OuterComponent = withBreakpointsCustom({}, InnerComponent);
		component = shallow(<OuterComponent foo="bar" />);
	});

	it('should render', () => {
		expect(component).to.exist();
	});

	it('should wrap inner component', () => {
		expect(component.first().is(InnerComponent)).to.be.true();
	});

	it('should pass props to inner component', () => {
		expect(component.find(InnerComponent).prop('foo')).to.equal('bar');
	});

	it('should not add additional props when no breakpoints', () => {
		expect(component.find(InnerComponent).props()).to.deep.equal({ foo: 'bar' });
	});
});

describe('withBreakpointsCustom detects breakpoint markers', () => {
	it('should detect markers by ID', () => {
		document.body.innerHTML = `
			<div id="sm-id" style="display: none"></div>
			<div id="lg-id"></div>
		`;

		const breakpoints = [
			{ prop: 'isSizeSm', selector: '#sm-id' },
			{ prop: 'isSizeLg', selector: '#lg-id' },
		];
		const OuterComponent = withBreakpointsCustom({ breakpoints }, InnerComponent);
		const component = shallow(<OuterComponent />);

		expect(component.props()).to.deep.equal({ isSizeSm: false, isSizeLg: true });
	});

	it('should detect markers by class', () => {
		document.body.innerHTML = `
			<div class="sm-class" style="display: none"></div>
			<div class="lg-class"></div>
		`;

		const breakpoints = [
			{ prop: 'isSizeSm', selector: '.sm-class' },
			{ prop: 'isSizeLg', selector: '.lg-class' },
		];
		const OuterComponent = withBreakpointsCustom({ breakpoints }, InnerComponent);
		const component = shallow(<OuterComponent />);

		expect(component.props()).to.deep.equal({ isSizeSm: false, isSizeLg: true });
	});

	it('should calculate missing breakpoints as hidden', () => {
		const breakpoints = [
			{ prop: 'isSizeSm', selector: '#notexistent' },
		];
		const OuterComponent = withBreakpointsCustom({ breakpoints }, InnerComponent);
		const component = shallow(<OuterComponent />);

		expect(component.props()).to.deep.equal({ isSizeSm: false });
	});
});

describe('withBreakpointsCustom listens for changes', () => {
	let spyAddEventListener;
	let spyRemoveEventListener;

	before(() => {
		spyAddEventListener = sandbox.spy(window, 'addEventListener');
		spyRemoveEventListener = sandbox.spy(window, 'removeEventListener');
	});

	it('should listen for window resize on mount', () => {
		const OuterComponent = withBreakpointsCustom({}, InnerComponent);
		shallow(<OuterComponent />);

		expect(spyAddEventListener).to.have.been.calledWith('resize');
		expect(spyRemoveEventListener).not.to.have.been.calledWith('resize');
	});

	it('should call onRecalculateBreakpoints on window resize', (done) => {
		const onRecalculateBreakpoints = () => done();
		const OuterComponent = withBreakpointsCustom({ onRecalculateBreakpoints }, InnerComponent);

		shallow(<OuterComponent />);

		resizeWindowToWidth(200);
	});

	it('should end listen for window resize on unmount', () => {
		const OuterComponent = withBreakpointsCustom({}, InnerComponent);
		shallow(<OuterComponent />).unmount();

		expect(spyRemoveEventListener).to.have.been.calledWith('resize');
	});
});

describe('withBreakpointsCustom throttles updates', () => {
	it('should update on initial and after successive window resizes', (done) => {
		const onRecalculateBreakpoints = sandbox.spy();
		const OuterComponent = withBreakpointsCustom({ onRecalculateBreakpoints }, InnerComponent);
		shallow(<OuterComponent />);

		[200, 205, 210, 215].forEach(width => resizeWindowToWidth(width));

		const assertions = () => {
			// Some browsers may throttle successive resizes to a single event.  Otherwise
			// the library will throttle to two events, one leading and one trailing.
			expect(onRecalculateBreakpoints.callCount).to.be.oneOf([1, 2]);
		};
		setTimeout(() => assertAsync(done, assertions), 500);
	}).timeout(1000);

	it('should update after each periodic window resize', (done) => {
		const onRecalculateBreakpoints = sandbox.spy();
		const OuterComponent = withBreakpointsCustom({ onRecalculateBreakpoints }, InnerComponent);
		shallow(<OuterComponent />);

		setTimeout(() => resizeWindowToWidth(200), 500);
		setTimeout(() => resizeWindowToWidth(300), 1000);
		setTimeout(() => resizeWindowToWidth(400), 1500);

		const assertions = () => expect(onRecalculateBreakpoints).to.have.been.calledThrice();
		setTimeout(() => assertAsync(done, assertions), 2000);
	}).timeout(2500);

	it('should update on initial and after successive window resizes over a period', (done) => {
		const onRecalculateBreakpoints = sandbox.spy();
		const OuterComponent = withBreakpointsCustom({ onRecalculateBreakpoints }, InnerComponent);
		shallow(<OuterComponent />);

		setTimeout(() => {
			resizeWindowToWidth(200);
			resizeWindowToWidth(225);
			resizeWindowToWidth(250);
		}, 500);
		setTimeout(() => {
			resizeWindowToWidth(300);
			resizeWindowToWidth(325);
			resizeWindowToWidth(350);
		}, 1000);
		setTimeout(() => {
			resizeWindowToWidth(400);
			resizeWindowToWidth(425);
			resizeWindowToWidth(450);
		}, 1500);

		const assertions = () => {
			// Some browsers may throttle successive resizes to a single event.  Otherwise
			// the library will throttle to two events, one leading and one trailing.
			expect(onRecalculateBreakpoints.callCount).to.oneOf([3, 6]);
		};
		setTimeout(() => assertAsync(done, assertions), 2000);
	}).timeout(2500);
});

describe('withBreakpointsCustom recalculates breakpoint markers', () => {
	it('should recalculate on resize', (done) => {
		let component;

		addCustomStyles(`
			#marker { display: none; }
			@media (max-width: 700px) {
				#marker { display: block; }
			}
		`);
		document.body.innerHTML = `
			<div id="marker"></div>
		`;
		resizeWindowToWidth(701);

		let innerComponent;
		const onRecalculateBreakpoints = () => {
			component.update();
			innerComponent = component.find(InnerComponent);
			expect(innerComponent.props()).to.deep.equal({ isSizeSm: true });
			done();
		};

		const breakpoints = [
			{ prop: 'isSizeSm', selector: '#marker' },
		];
		const OuterComponent = withBreakpointsCustom(
			{ breakpoints, onRecalculateBreakpoints },
			InnerComponent,
		);

		component = shallow(<OuterComponent />);
		innerComponent = component.find(InnerComponent);
		expect(innerComponent.props()).to.deep.equal({ isSizeSm: false });

		resizeWindowToWidth(699);
	});
});
