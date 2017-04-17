// @flow
import path from 'path';
import generateValidator from '../generate-validator.js';
import generateFlow from '../generate-flow.js';

const MODELS_TO_SNAPSHOT = [
  'account',
  'balance_transaction',
  'card',
  'charge',
  'coupon',
  'customer',
  'discount',
  'dispute',
];
describe('Stripe openapi', () => {
  // $FlowFixMe
  const spec = require(path.join(__dirname, '../../', 'openapi/openapi/spec2.json'));
  it('generates a validator for the entire spec', () => {
    expect(generateValidator(spec)).toMatchSnapshot();
  });
  MODELS_TO_SNAPSHOT.forEach((model) => {
    it(`generates flow types for ${model}`, () => {
      expect(generateFlow(spec.definitions[model])).toMatchSnapshot();
    });
  });
});
