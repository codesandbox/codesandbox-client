import { transform } from 'babel-standalone';
import dynamicImportSyntax from 'babel-plugin-syntax-dynamic-import';

import detective from './plugins/babel-plugin-detective';
import getRequireStatements from './get-require-statements';

describe('get-require-statements', () => {
  function testAst(code) {
    const result = transform(code, {
      presets: ['es2015', 'react'],
      plugins: [
        'transform-async-to-generator',
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-decorators-legacy',
        dynamicImportSyntax,
        [detective, { source: true, nodes: true }],
      ],
    });

    expect(getRequireStatements(detective.metadata(result))).toMatchSnapshot();
  }

  it('can find simple requires', () => {
    const code = `
      import React from 'react';
      import { render } from 'react-dom';
    `;

    testAst(code);
  });

  it('can find plain requires', () => {
    const code = `
      const react = require('react');
      const reactDom = require('react-dom');
    `;

    testAst(code);
  });

  it('does not find import promises', () => {
    const code = `
      const reactDom = import('react-dom').then(dom => dom.render('a'));
    `;

    testAst(code);
  });

  it('can find dynamic imports', () => {
    const code = `
      const page = import('./' + this.props.page);
      const page2 = require('./page/' + this.props.page2);
    `;

    testAst(code);
  });

  it('can find reexports', () => {
    const code = `
      export * from './Hello';
    `;

    testAst(code);
  });

  it('can work with real life code', () => {
    const code = `
    import React from 'react'
    import { connect } from 'react-redux'
    import { TransitionGroup, Transition } from 'transition-group'
    import universal from 'react-universal-component'
    import isLoading from '../selectors/isLoading'
    import '../css/Switcher.css'

    const Switcher = ({ page, direction, isLoading }) =>
      <TransitionGroup
        className={\`switcher $\{direction}\`}
        duration={500}
        prefix='slide'
      >
        <Transition key={page}>
          <UniversalComponent page={page} isLoading={isLoading} />
        </Transition>
      </TransitionGroup>

    const UniversalComponent = universal(props => import(\`./$\{props.page}\`), {
      minDelay: 500,
      chunkName: props => props.page,
      loading: () => <div className='spinner'><div /></div>,
      error: () => <div className='notFound'>PAGE NOT FOUND - 404</div>
    })

    const mapState = ({ page, direction, ...state }) => ({
      page,
      direction,
      isLoading: isLoading(state)
    })

    export default connect(mapState)(Switcher)
    `;

    testAst(code);
  });
});
