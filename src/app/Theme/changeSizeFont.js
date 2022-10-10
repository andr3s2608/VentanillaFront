let fontSize = 16;
export const changeSizeFont = (operator = '') => {

  if (fontSize >= 24 && operator === '+') return;

  if (fontSize <= 12 && operator === '-') return;

  operator === '+' ? fontSize++ : fontSize--;

  var divs = document.getElementsByTagName("div");
  var labels = document.getElementsByTagName("label");
  var ps = document.getElementsByTagName("p");
  var spans = document.getElementsByTagName("span");
  var h1s = document.getElementsByTagName("h1");
  var h2s = document.getElementsByTagName("h2");
  var h3s = document.getElementsByTagName("h3");

  for (let index = 0; index < divs.length; index++) {
    divs[index].style.fontSize = `${fontSize}px`;
  }

  for (let index = 0; index < labels.length; index++) {
    labels[index].style.fontSize = `${fontSize}px`;
  }

  for (let index = 0; index < ps.length; index++) {
    ps[index].style.fontSize = `${fontSize}px`;
  }

  for (let index = 0; index < spans.length; index++) {
    spans[index].style.fontSize = `${fontSize}px`;
  }

  for (let index = 0; index < h1s.length; index++) {
    h1s[index].style.fontSize = `${fontSize}px`;
  }

  for (let index = 0; index < h2s.length; index++) {
    h2s[index].style.fontSize = `${fontSize}px`;
  }

  for (let index = 0; index < h3s.length; index++) {
    h3s[index].style.fontSize = `${fontSize}px`;
  }
}
