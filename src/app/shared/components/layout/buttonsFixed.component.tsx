import themes from 'app/Theme/themes';
import { useState } from 'react';

export const ButtonsComponent = ({ handleChange }: any) => {

  var fontSize = 16;
  const [stateTheme, setStateTheme] = useState(false);

  const onChangeTheme = () => {
    // ChangeTheme();
    setStateTheme(!stateTheme);
    localStorage.setItem('isBlack', stateTheme.toString());
    (stateTheme) ? handleChange(themes.black) : handleChange(themes.default)
  };

  const changeFont = (operator: string = '') => {
    debugger
    if (fontSize === 24 && operator === '+') {
      return
    }

    if (fontSize === 16 && operator === '-') {
      return
    }
    operator === '+' ? fontSize++ : fontSize--;
    document.getElementsByTagName('body')[0].style.fontSize = `${fontSize}px`;
  }

  return (
    <>
      <div className='sidebar_help'>
        <ul className="social">
          <li><button className='btn ant-btn-primary' onClick={() => changeFont("+")}><span className='text'>+</span><i className="fa-solid fa-a ml-2"></i></button></li>
          <li><button style={{ marginTop: '-19px' }} className='btn ant-btn-primary' onClick={() => changeFont("-")}><span className='text'>-</span><i className="fa-solid fa-a ml-2"></i></button></li>
          <li><button onClick={() => onChangeTheme()} style={{ marginTop: '-20px' }} className='btn ant-btn-primary'><i className="fa-sharp fa-solid fa-circle-half-stroke fa-lg"></i></button></li>
        </ul>
      </div>
    </>
  )
}
