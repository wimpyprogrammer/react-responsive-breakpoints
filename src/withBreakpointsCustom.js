/* eslint-env browser */
import React, { Component } from 'react';
import throttle from 'lodash.throttle';

function noop() {}

function isVisible(markerEl) {
	return !!markerEl && window.getComputedStyle(markerEl).display !== 'none';
}

export default (options, InnerComponent) => {
	function calculateBreakpoints() {
		const breakpointConfig = options.breakpoints || [];

		return breakpointConfig.reduce((breakpoints, { prop, selector }) => {
			const markerEl = document.querySelector(selector);
			return { ...breakpoints, [prop]: isVisible(markerEl) };
		}, {});
	}

	class WithBreakpointsCustom extends Component {
		constructor(props) {
			super(props);
			// Calculate the initial breakpoints when the component first loads
			this.state = calculateBreakpoints();
			this.recalculateBreakpointsThrottled = throttle(this.recalculateBreakpoints.bind(this), 200);
		}

		componentDidMount() {
			window.addEventListener('resize', this.recalculateBreakpointsThrottled);
		}

		componentWillUnmount() {
			this.recalculateBreakpointsThrottled.cancel();
			window.removeEventListener('resize', this.recalculateBreakpointsThrottled);
		}

		recalculateBreakpoints() {
			const { onRecalculateBreakpoints = noop } = options;
			this.setState(calculateBreakpoints(), onRecalculateBreakpoints);
		}

		render() {
			// Convert the calculated state to props of the inner component
			return <InnerComponent {...this.props} {...this.state} />;
		}
	}

	return WithBreakpointsCustom;
};
