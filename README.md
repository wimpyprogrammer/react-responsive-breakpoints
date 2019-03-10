# react-responsive-breakpoints

[![npm package](https://badge.fury.io/js/react-responsive-breakpoints.svg)](https://badge.fury.io/js/react-responsive-breakpoints)
![node version](https://img.shields.io/node/v/react-responsive-breakpoints.svg)
[![Build Status](https://travis-ci.org/wimpyprogrammer/react-responsive-breakpoints.svg?branch=master)](https://travis-ci.org/wimpyprogrammer/react-responsive-breakpoints)
[![codecov](https://codecov.io/gh/wimpyprogrammer/react-responsive-breakpoints/branch/master/graph/badge.svg)](https://codecov.io/gh/wimpyprogrammer/react-responsive-breakpoints)
[![Known Vulnerabilities](https://snyk.io/test/github/wimpyprogrammer/react-responsive-breakpoints/badge.svg)](https://snyk.io/test/github/wimpyprogrammer/react-responsive-breakpoints)
[![Greenkeeper badge](https://badges.greenkeeper.io/wimpyprogrammer/react-responsive-breakpoints.svg)](https://greenkeeper.io/)

[![Build Status](https://saucelabs.com/browser-matrix/wimpyprogrammer.svg)](https://saucelabs.com/beta/builds/0645fda2076745e390ca9b938c2dc721)

A higher-order React component to translate CSS breakpoints into properties.

Libraries like [`react-responsive`](https://www.npmjs.com/package/react-responsive) and [`react-responsive-component`](https://www.npmjs.com/package/react-responsive-component) let you specify media queries in your React code.  But if you're using a responsive CSS framework like [Bootstrap](https://getbootstrap.com/), [Foundation](https://foundation.zurb.com/), or even a homegrown one, you probably want your React components to mirror your existing CSS breakpoints without duplicating them in JavaScript.

## [Demo on CodeSandbox]((https://codesandbox.io/s/1vwkk6rml3?module=%2FResponsiveButton.js))

[![react-responsive-breakpoints Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1vwkk6rml3?module=%2FResponsiveButton.js)

## Installation

Published on `npm` as [`react-responsive-breakpoints`](https://www.npmjs.com/package/react-responsive-breakpoints).

npm users:
```
npm install --save react-responsive-breakpoints
```

yarn users:
```
yarn add react-responsive-breakpoints
```

`react-responsive-breakpoints` does not include its own version of React.  It will use whatever version is already installed in your project.

Then add a DOM element for each breakpoint size in your application.  Each DOM element should only appear at its respective breakpoint.  For example, if your application uses Bootstrap v3.3, add [responsive elements](https://getbootstrap.com/docs/3.3/css/#responsive-utilities) like:

```html
<div class="visible-xs-block" id="marker-xs"></div>
<div class="visible-sm-block" id="marker-sm"></div>
<div class="visible-md-block" id="marker-md"></div>
<div class="visible-lg-block" id="marker-lg"></div>
```

For best results, create these responsive DOM markers outside of the React application so they are ready as soon as `react-responsive-breakpoints` needs them.

## Usage

Use `withBreakpointsCustom(options, Component)` to create a higher-order component around your custom React component.
- `options` (Object) - your responsive configuration options
	- `options.breakpoints` (Array) - An array of objects.  Each object specifies a responsive breakpoint and contains two properties:
		- `prop` (String) - The name of the property that will be passed to `Component` indicating whether the breakpoint is active
		- `selector` (String) - A CSS selector for the DOM marker that appears at the breakpoint, e.g. `"#some-id"` or `".some-class"`
- `Component` (ReactElement) - Your React component

```js
import React from 'react';
import { withBreakpointsCustom } from 'react-responsive-breakpoints';

/**
 * The "isSize*" properties will be automatically set by react-responsive-breakpoints.
 * All other properties pass through as usual.
 */
const MyComponent = ({ counter, isSizeXs, isSizeSm, isSizeMd, isSizeLg, onIncrement }) => {
	return (
		<div>
			{counter}
			<button type="button" onClick={onIncrement}>Increment</button>
			{/* Display custom content depending on the screen width */}
			{isSizeXs ? (
				<div>X-small screen content</div>
			) : null}
			{isSizeSm ? (
				<div>Small screen content</div>
			) : null}
			{isSizeMd ? (
				<div>Medium screen content</div>
			) : null}
			{isSizeLg ? (
				<div>Large screen content</div>
			) : null}
		</div>
	);
};

const breakpoints = [
	{ prop: 'isSizeXs', selector: '#marker-xs' },
	{ prop: 'isSizeSm', selector: '#marker-sm' },
	{ prop: 'isSizeMd', selector: '#marker-md' },
	{ prop: 'isSizeLg', selector: '#marker-lg' },
];
const MyResponsiveComponent = withBreakpointsCustom({ breakpoints }, MyComponent);
```

Lastly, use your new higher-order component in place of your custom component.

```js
let x = 1;

function incrementCounter() {
	x++;
}

return (
	<MyResponsiveComponent counter={x} onIncrement={incrementCounter}>
);
```

## License

[MIT](/LICENSE)
