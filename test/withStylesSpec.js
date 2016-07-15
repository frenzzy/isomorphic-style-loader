/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable react/prefer-stateless-function */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import React, { createClass, Component, PropTypes } from 'react';
import TestUtils from 'react-addons-test-utils';
import withStyles from '../src/withStyles';

describe('withStyles(...styles)(WrappedComponent)', () => {
  class Provider extends Component {
    static childContextTypes = {
      insertCss: PropTypes.func.isRequired,
    };
    getChildContext() {
      return { insertCss() {} };
    }
    render() {
      return <div {...this.props} />;
    }
  }

  class Passthrough extends Component {
    render() {
      return <div {...this.props} />;
    }
  }

  it('Should set the displayName correctly', () => {
    expect(withStyles('')(
      class Foo extends Component {
        render() {
          return <div />;
        }
      }
    ).displayName).to.equal('WithStyles(Foo)');

    expect(withStyles('')(
      createClass({
        displayName: 'Bar',
        render() {
          return <div />;
        },
      })
    ).displayName).to.equal('WithStyles(Bar)');

    expect(withStyles('')(
      createClass({
        render() {
          return <div />;
        },
      })
    ).displayName).to.equal('WithStyles(Component)');
  });

  it('Should expose the component with styles as WrappedComponent', () => {
    class Container extends Component {
      render() {
        return <Passthrough />;
      }
    }

    const Decorated = withStyles('')(Container);
    expect(Decorated.WrappedComponent).to.equal(Container);
  });

  it('Should return the instance of the wrapped component for use in calling child methods', () => {
    const someData = { some: 'data' };

    class Container extends Component {
      someInstanceMethod() {
        return someData;
      }

      render() {
        return <Passthrough />;
      }
    }

    const Decorated = withStyles('')(Container);

    const tree = TestUtils.renderIntoDocument(
      <Provider>
        <Decorated />
      </Provider>
    );

    const decorated = TestUtils.findRenderedComponentWithType(tree, Decorated);

    expect(() => decorated.someInstanceMethod()).to.throw(Error);
    expect(decorated.getWrappedInstance().someInstanceMethod()).to.equal(someData);
    expect(decorated.refs.wrappedInstance.someInstanceMethod()).to.equal(someData);
  });
});
