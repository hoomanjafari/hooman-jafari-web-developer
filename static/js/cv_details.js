
const swiper = new Swiper('.swiper', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 1,
    // preloadImages: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    breakpoints: {
        300: {
            slidesPerView: 1
        },

        600: {
            slidesPerView: 1,
        },

        768: {
            slidesPerView: 1
        },

    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',

        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    // scrollbar: {
    //     el: '.swiper-scrollbar',
    // },

    autoplay: {
        delay: 2000,
        disableOnInteraction: false
    },
});