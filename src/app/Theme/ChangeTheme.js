
export const ChangeTheme = () => {

  var header = document.getElementsByTagName("header");
  var label = document.getElementsByTagName("label");
  var antMenuItem = document.getElementsByClassName("ant-menu-item");
  var h2 = document.getElementsByTagName("h2");
  var p = document.getElementsByTagName("p");
  var span = document.getElementsByTagName("h4");

  if (localStorage.getItem('isBlack') === 'true') {
    var element = document.getElementsByTagName("div");

    for (let index = 0; index < element.length; index++) {
      element[index].classList.add("black");
    }

    for (let index = 0; index < header.length; index++) {
      header[index].classList.add("black");
    }

    for (let index = 0; index < label.length; index++) {
      label[index].classList.add("border");
      label[index].classList.add("border-warning");
      label[index].classList.add("text-white");
    }

    for (let index = 0; index < antMenuItem.length; index++) {
      antMenuItem[index].classList.add("border");
      antMenuItem[index].classList.add("border-warning");
    }

    for (let index = 0; index < h2.length; index++) {
      h2[index].classList.add("border");
      h2[index].classList.add("border-warning");
    }

    for (let index = 0; index < p.length; index++) {
      p[index].classList.add("border");
      p[index].classList.add("border-warning");
    }

    for (let index = 0; index < span.length; index++) {
      span[index].classList.add("border");
      span[index].classList.add("border-warning");
    }

  } else {
    var element = document.getElementsByTagName("div");
    for (let index = 0; index < element.length; index++) {
      element[index].classList.remove("black");
    }

    for (let index = 0; index < header.length; index++) {
      header[index].classList.remove("black");
    }

    for (let index = 0; index < label.length; index++) {
      label[index].classList.remove("border");
      label[index].classList.remove("border-warning");
      label[index].classList.remove("text-white");
    }

    for (let index = 0; index < antMenuItem.length; index++) {
      antMenuItem[index].classList.remove("border-warning");
      antMenuItem[index].classList.remove("border");
    }
    for (let index = 0; index < h2.length; index++) {
      h2[index].classList.remove("border");
      h2[index].classList.remove("border-warning");
    }

    for (let index = 0; index < p.length; index++) {
      p[index].classList.remove("border");
      p[index].classList.remove("border-warning");
    }

    for (let index = 0; index < span.length; index++) {
      span[index].classList.remove("border");
      span[index].classList.remove("border-warning");
    }
  }

  // var element = document.getElementsByTagName("div");





  // for (let index = 0; index < element.length; index++) {
  //   element[index].classList.toggle("black");
  // }



}
