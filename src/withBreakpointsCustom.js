/* eslint-env browser */
import React, { Component } from 'react';
import reduce from 'lodash.reduce';
import throttle from 'lodash.throttle';

function isVisible(markerEl) {
	return markerEl && window.getComputedStyle(markerEl).display !== 'none';
}

export default (options, InnerComponent) => {
	function calculateBreakpoints() {
		return reduce(options.breakpoints, (breakpoints, { prop, selector }) => {
			const markerEl = document.querySelector(selector);
			return { ...breakpoints, [prop]: isVisible(markerEl) };
		}, {});
	}

	class WithBreakpointsCustom extends Component {
		constructor(props) {
			super(props);
			// Calculate the initial breakpoints when the component first loads
			this.state = calculateBreakpoints();
			this.recalculateBreakpoints = throttle(this.recalculateBreakpoints.bind(this), 200);
		}

		componentDidMount() {
			window.addEventListener('resize', this.recalculateBreakpoints);
		}

		componentWillUnmount() {
			window.removeEventListener('resize', this.recalculateBreakpoints);
		}

		recalculateBreakpoints() {
			this.setState(calculateBreakpoints());
		}

		render() {
			// Convert the calculated state to props of the inner component
			return <InnerComponent {...this.props} {...this.state} />;
		}
	}

	return WithBreakpointsCustom;
};
