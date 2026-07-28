const currentPage = window.location.pathname.split("/").pop();

const links = document.querySelectorAll("nav ul li a");

links.forEach(function(link) {

    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }

});