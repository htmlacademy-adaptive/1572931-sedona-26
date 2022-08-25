const toggleMenuButton = document.querySelector(".main-navigation__toggle");
const menu = document.querySelector(".site-navigation");
const nav = document.querySelector(".main-navigation"); // сама навигация

nav.classList.remove("main-navigation--nojs");

const openMenuHandler = () => {
  if (nav.classList.contains("main-navigation--opened")) {
    nav.classList.remove("main-navigation--opened");
    nav.classList.add("main-navigation--closed");

    return;
  }

  nav.classList.remove("main-navigation--closed");
  nav.classList.add("main-navigation--opened");
};

toggleMenuButton.addEventListener("click", openMenuHandler);
