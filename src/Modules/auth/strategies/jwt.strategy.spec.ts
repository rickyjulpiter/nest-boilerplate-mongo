import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategyInstance: JwtStrategy;

  beforeEach(() => {
    strategyInstance = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategyInstance).toBeDefined();
  });
});
