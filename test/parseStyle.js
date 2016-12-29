const expect = require('chai').expect;
const parseStyle = require('../lib/parseStyle');

describe('parseStyle', () => {

    it('should skip control codes', () => {
        const input = 'text\x01with\x04control\x05codes';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'textwithcontrolcodes',

            start: 0,
            end: 20
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should not skip control codes when parameter `stripControlCodes` is set to false', () => {
        const input = 'text\x01with\x04control\x05codes';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'text\x01with\x04control\x05codes',

            start: 0,
            end: 23
        }];

        const actual = parseStyle(input, false);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse bold', () => {
        const input = '\x02bold';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 0,
            end: 4
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse textColor', () => {
        const input = '\x038yellowText';
        const expected = [{
            bold: false,
            textColor: 8,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellowText',

            start: 0,
            end: 10
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse textColor and background', () => {
        const input = '\x034,8yellowBG redText';
        const expected = [{
            textColor: 4,
            bgColor: 8,
            bold: false,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellowBG redText',

            start: 0,
            end: 16
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should parse italic', () => {
        const input = '\x1ditalic';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: true,
            underline: false,
            text: 'italic',

            start: 0,
            end: 6
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should carry state corretly forward', () => {
        const input = '\x02bold\x038yellow\x02nonBold\x03default';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 0,
            end: 4
        }, {
            bold: true,
            textColor: 8,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'yellow',

            start: 4,
            end: 10
        }, {
            bold: false,
            textColor: 8,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'nonBold',

            start: 10,
            end: 17
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'default',

            start: 17,
            end: 24
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should toggle bold correctly', () => {
        const input = '\x02bold\x02 \x02bold\x02';
        const expected = [{
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 0,
            end: 4
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: ' ',

            start: 4,
            end: 5
        }, {
            bold: true,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'bold',

            start: 5,
            end: 9
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should reset all styles', () => {
        const input = '\x02\x034\x16\x1d\x1ffull\x0fnone';
        const expected = [{
            bold: true,
            textColor: 4,
            bgColor: undefined,
            reverse: true,
            italic: true,
            underline: true,
            text: 'full',

            start: 0,
            end: 4
        }, {
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'none',

            start: 4,
            end: 8
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });

    it('should optimize fragments', () => {
        const input = '\x031\x031,2\x031\x031,2\x031\x031,2\x03a';
        const expected = [{
            bold: false,
            textColor: undefined,
            bgColor: undefined,
            reverse: false,
            italic: false,
            underline: false,
            text: 'a',

            start: 0,
            end: 1
        }];

        const actual = parseStyle(input);

        expect(actual).to.deep.equal(expected);
    });
});
