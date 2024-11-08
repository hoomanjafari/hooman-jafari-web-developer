window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById('header-ul').style.position = "fixed";
    } else {
        document.getElementById('header-ul').style.position = "relative";
    }
})

document.getElementById('burger_btn').addEventListener('click', () => {
    document.getElementById('mobile-menu-bar-container').style.visibility = 'visible';
    document.getElementById('mobile-menu-bar-box').style.width = '60vw';
    document.getElementById('mobile-menu-close-btn').style.opacity = '100%';
})

document.getElementById('mobile-menu-close-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu-bar-container').style.visibility = 'hidden';
    document.getElementById('mobile-menu-bar-box').style.width = '0';
    document.getElementById('mobile-menu-close-btn').style.opacity = '0';
})

window.addEventListener('click', (e) => {
    let box = document.getElementById('mobile-menu-bar-container');
    if (e.target === box) {
        document.getElementById('mobile-menu-bar-container').style.visibility = 'hidden';
        document.getElementById('mobile-menu-bar-box').style.width = '0';
        document.getElementById('mobile-menu-close-btn').style.opacity = '0';
    }
})
