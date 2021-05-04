import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import Editor from '../components/Editor';

describe('[component] Editor', () => {
  it('should render without any passed props', () => {
    const component = render(<Editor />);
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should render with all passed props', () => {
    const onChange = () => 1;
    const styles = [
      {
        startIndex: 1,
        endIndex: 3,
        style: {
          backgroundColor: 'red'
        }
      }
    ]
    const component = render(<Editor content="foobar" styles={styles} onChange={onChange} />);
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should render code', () => {
    const { container } = render(<Editor content="const foo = 1;" />);
    const pre = container.querySelector('pre');
    expect(pre.textContent).toEqual('const foo = 1;');
  });

  it('should set textarea value', () => {
    const { container } = render(<Editor content="const foo = 1;" />);
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toEqual('const foo = 1;');
  });

  it('should call onChange on value change', () => {
    const onChange = jest.fn();
    const { container } = render(<Editor content="const foo = 1;" onChange={onChange} />);
    const textarea = container.querySelector('textarea');
    fireEvent.change(textarea, { target: { value: 'const foo = 1; const bar = 2;' } });
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe('const foo = 1; const bar = 2;');
  });

  it('should apply styles', () => {
    const styles = [
      {
        startIndex: 1,
        endIndex: 3,
        style: {
          backgroundColor: 'red'
        }
      },
      {
        startIndex: 6,
        endIndex: 8,
        style: {
          backgroundColor: 'green'
        }
      }
    ]
    const content = `012\n\n567`
    const { container } = render(<Editor content={content} styles={styles} />);
    const spans = container.querySelectorAll('pre span:not(.token)');

    expect(spans.length).toEqual(4);
    expect(spans[0].style.backgroundColor).toEqual('red');
    expect(spans[0].textContent).toEqual('1');
    expect(spans[1].style.backgroundColor).toEqual('red');
    expect(spans[1].textContent).toEqual('2');
    expect(spans[2].style.backgroundColor).toEqual('green');
    expect(spans[2].textContent).toEqual('6');
    expect(spans[3].style.backgroundColor).toEqual('green');
    expect(spans[3].textContent).toEqual('7');
  });

  it('should apply multiple styles', () => {
    const styles = [
      {
        startIndex: 1,
        endIndex: 4,
        style: {
          backgroundColor: 'red'
        }
      },
      {
        startIndex: 2,
        endIndex: 3,
        style: {
          backgroundColor: 'green'
        }
      }
    ]
    const content = `lorem`
    const { container } = render(<Editor content={content} styles={styles} />);
    const spans = container.querySelectorAll('pre span:not(.token)')
    const nestedSpans = container.querySelectorAll('pre span:not(.token) > span:not(.token)');

    expect(spans.length).toEqual(4);
    expect(nestedSpans.length).toEqual(1);
    expect(nestedSpans[0].style.backgroundColor).toEqual('red');
    expect(nestedSpans[0].parentElement.style.backgroundColor).toEqual('green');
    expect(nestedSpans[0].textContent).toEqual('r');
  });
});