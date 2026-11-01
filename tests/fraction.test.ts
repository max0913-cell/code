import { D, F, Frac } from '../src/core/fraction';

describe('Frac (exacte breuken)', () => {
  it('rekent zonder floating-point-fouten', () => {
    expect(D('0,1').add(D('0,2')).toDecimal()).toBe('0,3');
    expect(D('0,16').mul(D('0,4')).toDecimal()).toBe('0,064');
    expect(D('0,57').div(D('0,03')).toDecimal()).toBe('19');
    expect(F(1, 3).add(F(1, 2)).toFracText()).toBe('5/6');
  });
  it('herkent eindige decimalen', () => {
    expect(F(1, 8).isTerminating()).toBe(true);
    expect(F(1, 3).isTerminating()).toBe(false);
    expect(F(3, 40).toDecimal()).toBe('0,075');
    expect(D('0,00018').places()).toBe(5);
    expect(Frac.parse('12').toDecimal()).toBe('12');
  });
  it('vereenvoudigt breuken', () => {
    expect(F(6, 8).toFracText()).toBe('3/4');
    expect(F(-2, -4).toFracText()).toBe('1/2');
  });
});
