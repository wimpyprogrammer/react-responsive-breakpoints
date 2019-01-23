// A stripped-down version of lodash throttle from
// https://github.com/lodash/lodash/blob/0843bd4/lodash.js#L10898-L10914

export default function throttle(func, wait) {
	let lastArgs;
	let lastThis;
	let result;
	let timerId;
	let lastCallTime;

	function invokeFunc() {
		const args = lastArgs;
		const thisArg = lastThis;

		lastArgs = undefined;
		lastThis = undefined;
		result = func.apply(thisArg, args);
		return result;
	}

	function trailingEdge() {
		timerId = undefined;

		// Only invoke if we have `lastArgs` which means `func` has been
		// debounced at least once.
		if (lastArgs) {
			return invokeFunc();
		}
		lastArgs = undefined;
		lastThis = undefined;
		return result;
	}

	function shouldInvoke(time) {
		const timeSinceLastCall = time - lastCallTime;

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (lastCallTime === undefined
			|| (timeSinceLastCall >= wait)
			|| (timeSinceLastCall < 0));
	}

	function remainingWait(time) {
		const timeSinceLastCall = time - lastCallTime;
		const timeWaiting = wait - timeSinceLastCall;

		return timeWaiting;
	}

	// eslint-disable-next-line consistent-return
	function timerExpired() {
		const time = Date.now();
		if (shouldInvoke(time)) {
			return trailingEdge();
		}
		// Restart the timer.
		timerId = setTimeout(timerExpired, remainingWait(time));
	}

	function leadingEdge() {
		// Reset any `maxWait` timer.
		// Start the timer for the trailing edge.
		timerId = setTimeout(timerExpired, wait);
		// Invoke the leading edge.
		return invokeFunc();
	}

	function cancel() {
		if (timerId !== undefined) {
			clearTimeout(timerId);
		}
		lastArgs = undefined;
		lastCallTime = undefined;
		lastThis = undefined;
		timerId = undefined;
	}

	function debounced() {
		const time = Date.now();
		const isInvoking = shouldInvoke(time);

		// eslint-disable-next-line prefer-rest-params
		lastArgs = arguments;
		lastThis = this;
		lastCallTime = time;

		if (isInvoking) {
			if (timerId === undefined) {
				return leadingEdge();
			}
		}
		if (timerId === undefined) {
			timerId = setTimeout(timerExpired, wait);
		}
		return result;
	}
	debounced.cancel = cancel;
	return debounced;
}
