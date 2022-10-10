
export const ChangeTheme = () => {

  var header = document.getElementsByTagName("header");
  var label = document.getElementsByTagName("label");
  var antMenuItem = document.getElementsByClassName("ant-menu-title-content");
  var h2 = document.getElementsByTagName("h2");
  var p = document.getElementsByTagName("p");
  var b = document.getElementsByTagName("b");
  var li = document.getElementsByTagName("li");
  var h4 = document.getElementsByTagName("h4");
  var antMenuItemContent = document.getElementsByClassName("ant-steps-item-content");
  var element = document.getElementsByTagName("div");
  var section = document.getElementsByTagName("section");
  var footer = document.getElementsByTagName("footer");
  var input = document.getElementsByTagName("input");
  var ant_input_affix_wrapper = document.getElementsByClassName("ant-input-affix-wrapper");
  var ant_steps_icon = document.getElementsByClassName("ant-steps-icon");
  var ant_steps_item_icon = document.getElementsByClassName("ant-steps-item-icon");
  var ant_steps_item_icon = document.getElementsByClassName("ant-steps-item-icon");

  if (localStorage.getItem('isBlack') === 'true') {

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
      h2[index].classList.add("text-white");
    }

    for (let index = 0; index < p.length; index++) {
      p[index].classList.add("border");
      p[index].classList.remove("text-muted");
      p[index].classList.add("border-warning");
      p[index].classList.add("text-white");
    }

    for (let index = 0; index < b.length; index++) {
      b[index].classList.add("border");
      b[index].classList.add("border-warning");
      b[index].classList.add("text-white");
    }

    for (let index = 0; index < h4.length; index++) {
      h4[index].classList.add("border");
      h4[index].classList.add("border-warning");
    }

    for (let index = 0; index < li.length; index++) {
      li[index].classList.add("border");
      li[index].classList.add("border-warning");
    }

    for (let index = 0; index < antMenuItemContent.length; index++) {
      antMenuItemContent[index].classList.add("border");
      antMenuItemContent[index].classList.add("border-warning");
    }

    for (let index = 0; index < section.length; index++) {
      section[index].classList.add("black");
    }

    for (let index = 0; index < footer.length; index++) {
      footer[index].classList.add("black");
    }

    for (let index = 0; index < ant_input_affix_wrapper.length; index++) {
      ant_input_affix_wrapper[index].classList.add("black");
    }

    for (let index = 0; index < input.length; index++) {
      input[index].classList.add("black");
    }

    for (let index = 0; index < ant_steps_icon.length; index++) {
      ant_steps_icon[index].classList.add("text-warning");
    }

    for (let index = 0; index < ant_steps_item_icon.length; index++) {
      ant_steps_item_icon[index].classList.add("border");
      ant_steps_item_icon[index].classList.add("border-warning");
    }

  } else {

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
      h2[index].classList.remove("text-white");
    }

    for (let index = 0; index < p.length; index++) {
      p[index].classList.remove("border");
      p[index].classList.add("text-muted");
      p[index].classList.remove("border-warning");
      p[index].classList.remove("text-white");
    }

    for (let index = 0; index < b.length; index++) {
      b[index].classList.remove("border");
      b[index].classList.remove("border-warning");
      b[index].classList.remove("text-white");
    }

    for (let index = 0; index < h4.length; index++) {
      h4[index].classList.remove("border");
      h4[index].classList.remove("border-warning");
    }

    for (let index = 0; index < li.length; index++) {
      li[index].classList.remove("border");
      li[index].classList.remove("border-warning");
    }

    for (let index = 0; index < antMenuItemContent.length; index++) {
      antMenuItemContent[index].classList.remove("border");
      antMenuItemContent[index].classList.remove("border-warning");
    }

    for (let index = 0; index < section.length; index++) {
      section[index].classList.remove("black");
    }

    for (let index = 0; index < footer.length; index++) {
      footer[index].classList.remove("black");
    }

    for (let index = 0; index < ant_input_affix_wrapper.length; index++) {
      ant_input_affix_wrapper[index].classList.remove("black");
    }

    for (let index = 0; index < input.length; index++) {
      input[index].classList.remove("black");
    }

    for (let index = 0; index < ant_steps_icon.length; index++) {
      ant_steps_icon[index].classList.remove("text-warning");
    }

    for (let index = 0; index < ant_steps_item_icon.length; index++) {
      ant_steps_item_icon[index].classList.remove("border");
      ant_steps_item_icon[index].classList.remove("border-warning");
    }
  }

}
