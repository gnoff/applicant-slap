// this is some barebones testing i've thrown together. it is not meant to be
// representative of a comprehensive testing approach

let utils = require('../utils')

let roll = utils.roll

describe("utils", () => {
  describe("roll", () => {
    test('roll should produce numbers >= 0 and < 100', () => {
      // this test is a fuzz test. it is not comprehensive but should fail statistically often
      // if something is wrong with the roll function
      for (var i = 0; i < 1000; i++) {
        let r = roll()
        expect(r >= 0 && r < 100).toBe(true)
      }
    })

    test('roll should allow for a modifer which causes the roll to exceed bounds', () => {
      expect(roll(101) > 100).toBe(true)
      expect(roll(-101) < 0).toBe(true)
    })
  });
});
