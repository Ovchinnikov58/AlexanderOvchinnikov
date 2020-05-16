'use strict';

window.addEventListener('DOMContentLoaded', function() {
    //плавная прокрутка
    let linkNav = document.querySelectorAll('[href^="#"]'); //выбираем все ссылки к якорю на странице
    let V = 0.6; // скорость, может иметь дробное значение через точку (чем меньше значение - тем больше скорость)
    
    for (let i = 0; i < linkNav.length; i++) {

        linkNav[i].addEventListener('click', function(e) { //по клику на ссылку
            e.preventDefault();
             //отменяем стандартное поведение
            let w = window.pageYOffset;  // производим прокрутка прокрутка
            let hash = this.href.replace(/[^#]*(.*)/, '$1');  // к id элемента, к которому нужно перейти
            let t = document.querySelector(hash).getBoundingClientRect().top;  // отступ от окна браузера до id
            let start = null;

            requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
            function step(time) {
                if (start === null) start = time;

                let progress = time - start;
                let r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));

                window.scrollTo( 0, r );
                if (r != w + t) {
                    requestAnimationFrame(step)
                } else {
                    location.hash = hash  // URL с хэшем
                }
            }
        }, false);
    }

    //табы
    
    let tab = document.querySelectorAll('.info-header-tab');
    let info = document.querySelector('.info-header');
    let tabContent = document.querySelectorAll('.info-tabcontent');

    hideTabContent(1);

    info.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    // timer

    let deadline = '2020-06-21';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date());
        let seconds = Math.floor((t/1000) % 60);
        let minutes = Math.floor((t/1000/60) % 60);
        let hours = Math.floor((t/1000/60/60) % 24);
        let days = Math.floor((t/1000/60/60/24));

        return {
            'total' : t,
            'days' : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id);
        let days = timer.querySelector('.days');
        let hours = timer.querySelector('.hours');
        let minutes = timer.querySelector('.minutes');
        let seconds = timer.querySelector('.seconds');
        let timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);
            hours.textContent = (t.hours < 10) ? '0' + t.hours : t.hours;
            minutes.textContent = (t.minutes < 10) ? '0' + t.minutes : t.minutes;
            seconds.textContent = (t.seconds < 10) ? '0' + t.seconds : t.seconds;
            days.textContent = (t.days < 10) ? '0' + t.days : t.days;

            if (t.total <= 0) {
                clearInterval(timeInterval);

                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
                days.textContent = '00';
            }
        }
    }

    setClock('timer', deadline);

    // modal

    let more = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let close = document.querySelector('.popup-close');
    let infoBlock = document.querySelector('.info');

    infoBlock.addEventListener('click', function(event) {
        if (!event.target.classList.contains('description-btn')) return;
        openModal();
    });

    more.addEventListener('click', openModal);
    close.addEventListener('click', closeModal);

    function openModal() {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        statusMessage.innerHTML = '';
    }

    //Form

    let message = {
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так'
    };

    let form = document.querySelector('.main-form');
    let input = form.getElementsByTagName('input');
    let statusMessage = document.createElement('div');
    statusMessage.classList.add('status');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        let response = await fetch('server.php', {
            method: 'POST',
            body: new FormData(form)
        });

        //let result = await response.json;

        form.appendChild(statusMessage);
        
        if (response.ok) {
            statusMessage.innerHTML = message.success;
        } else {
            statusMessage.innerHTML = message.failure;
        }
    
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }
        
    });
    
    // form.addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     form.appendChild(statusMessage);

    //     let request = new XMLHttpRequest();
    //     request.open('POST', 'server.php');
    //     //request.setRequestHeader('Content-Type', 'aplication/x-www-form-urlencoded'); // сервер
    //     request.setRequestHeader('Content-Type', 'aplication/json; charset=utf-8'); // json

    //     let formData = new FormData(form);

    //     let obj = {};

    //     formData.forEach((value, key) => {
    //         obj[key] = value;
    //     });

    //     let json = JSON.stringify(obj);

    //     //request.send(formData);
    //     request.send(json);

    //     request.addEventListener('readystatechange', function() {
    //         if (request.readyState < 4) {
    //             statusMessage.innerHTML = message.loading;
    //         } else if (request.readyState === 4 && request.status == 200) {
    //             statusMessage.innerHTML = message.success;
    //         } else {
    //             statusMessage.innerHTML = message.failure;
    //         }
    //     });

    //     for (let i = 0; i < input.length; i++) {
    //         input[i].value = '';
    //     }
    // });

    //Slider

    let slideIndex = 1;
    let slides = document.querySelectorAll('.slider-item');
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');
    let dotsWrap = document.querySelector('.slider-dots');
    let dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function() {
        plusSlides(-1);
    });

    next.addEventListener('click', function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event) { //не понял
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });
    
    let intervalCarousel = setInterval(() => plusSlides(1), 5000);

    //calc

    let persons = document.querySelectorAll('.counter-block-input')[0];
    let restDays = document.querySelectorAll('.counter-block-input')[1];
    let place = document.getElementById('select');
    let totalValue = document.getElementById('total');
    let personsSum = 0;
    let daysSum = 0;
    let total = 0;

    totalValue.innerHTML = 0;

    persons.addEventListener('change', function() {
        personsSum = +this.value;
        total = (daysSum + personsSum)*4000;

        if (persons.value == '' || restDays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            //totalValue.innerHTML = total;
            totalValue.innerHTML = total * place.options[place.selectedIndex].value;
        }
    });

    restDays.addEventListener('change', function() {
        daysSum = +this.value;
        total = (daysSum + personsSum)*4000;

        if (persons.value == '' || restDays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            //totalValue.innerHTML = total;
            totalValue.innerHTML = total * place.options[place.selectedIndex].value;
        }
    });

    place.addEventListener('change', function() {
        if (restDays.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });
});

