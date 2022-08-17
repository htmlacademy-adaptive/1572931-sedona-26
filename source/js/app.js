const toggleMenuButton = document.querySelector(".main-navigation__toggle");
const menu = document.querySelector(".site-navigation");

const openMenuHandler = () => {
  menu.classList.toggle("site-navigation--active");
};

toggleMenuButton.addEventListener("click", openMenuHandler);
