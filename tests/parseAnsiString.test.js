import parseAnsiString from '../utils/parseAnsiString';

describe('[util] parseAnsiString', () => {
  it('should return empty styles when no ANSI codes', () => {
    const str = 'foo bar baz';
    expect(parseAnsiString(str)).toEqual({
      text: 'foo bar baz',
      styles: [],
    })
  });

  it('should extract styles and raw text', () => {
    const str = 'foo \u001b[41mbar\u001b[49m baz';
    expect(parseAnsiString(str)).toEqual({
      text: 'foo bar baz',
      styles: [{
        startIndex: 4,
        endIndex: 7,
        style: {
          background: 'rgba(204,0,0,1)'
        }
      }],
    });
  });

  it('should work when string contains new lines', () => {
    const str = `foo\u001b[41m\nba\n\nr\u001b[49m \nbaz`;
    expect(parseAnsiString(str)).toEqual({
      text: 'foo\nba\n\nr \nbaz',
      styles: [{
        startIndex: 3,
        endIndex: 9,
        style: {
          background: 'rgba(204,0,0,1)'
        }
      }],
    });
  })
})