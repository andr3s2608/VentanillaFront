
export const ChangeTheme = () => {
  var element = document.getElementsByTagName("div");
  var header = document.getElementsByTagName("header");
  var label = document.getElementsByTagName("label");

  for (let index = 0; index < label.length; index++) {
    label[index].classList.toggle("black");
  }

  for (let index = 0; index < element.length; index++) {
    element[index].classList.toggle("black");
  }

  for (let index = 0; index < header.length; index++) {
    header[index].classList.toggle("black");
  }

}
