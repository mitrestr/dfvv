(() => {
    const slides = document.querySelectorAll('.slider-burger__slide');
    const arrowLeft = document.querySelector('.slider-burger__arrow:first-child');
    const arrowRight = document.querySelector('.slider-burger__arrow:last-child');
    let currentSlide = 0;
    const changeSlide = (next)  => {
        slides[currentSlide].style.display = 'none';
        slides[next].style.display = '';
        currentSlide = next;
    };
    arrowLeft.onclick = () => {
        changeSlide((currentSlide + slides.length - 1) % slides.length);
    };
    arrowRight.onclick = () => {
        changeSlide((currentSlide + 1) % slides.length);
    };
})();

(() => {
    const items = document.querySelectorAll('.menu-acco__item');
    for (const item of items) {
        const trigger = item.querySelector('.menu-acco__trigger');
        const content = item.querySelector('.menu-acco__content');
        let opened = false;
        trigger.onclick = () => {
            content.style.display = opened ? 'none' : '';
            opened = !opened;
        };
    }
})();

(() => {
    const items = document.querySelectorAll('.team-acco__item');
    for (const item of items) {
        const content = item.querySelector('.team-acco__content');
        let opened = false;
        const baseClass = item.className;
        item.onclick = () => {
            opened = !opened;
            item.className = baseClass + (opened ? ' team-acco__item_active' : '');
        };
    }
})();


const openPopup = (() => {
    const popupArea = document.querySelector('.popup-area');
    let opened = null;
    const popups = {
        '#success': document.querySelector('#success'),
        '#fail': document.querySelector('#fail'),
        '#full-review': document.querySelector('#full-review'),
    };
    const openPopup = (id) => {
        popupArea.style.display = '';
        popups[id].style.display = '';
        opened = popups[id];
    };
    const closePopup = (e) => {
        e.preventDefault();
        opened.style.display = 'none';
        opened = null;
        popupArea.style.display = 'none';
    };
    const closeButtons = document.querySelectorAll('.close-popup-btn');
    for (const btn of closeButtons) {
        btn.onclick = closePopup;
    }
    return openPopup;
})();

(() => {
    const reviewButtons = document.querySelectorAll('.review__view');
    for (const btn of reviewButtons) {
        btn.onclick = () => openPopup('#full-review');
    }
})();

(() => {
    const orderForm = document.querySelector('#order-form');
    const elements = orderForm.elements;
    const commentParts = [
        ['Улица', 'street'],
        ['Дом', 'home'],
        ['Корпус', 'part'],
        ['Квартира', 'appt'],
        ['Этаж', 'floor'],
        ['Комментарий', 'comment'],
        ['Оплата', 'payment'],
        ['Перезвон', 'callback'],
    ];

    const formIsValid = () => {
        const requiredFields = ['name', 'phone'];
        for (const fieldName of requiredFields) {
            if (elements[fieldName].value === '') {
                return false;
            }
        }
        return true;
    };

    const paramToComment = a => {
        const e = elements[a[1]];
        let res = a[0] + ': ';
        if (e.type === 'text') {
            return res + e.value;
        }
        if (e.type === 'textarea') {
            return res + '\n' + e.value + '\n';
        }
        if (e.type === 'checkbox') {
            if (e.checked) {
                return res + e.nextElementSibling.nextElementSibling.innerText;
            }
            return '';
        }
        for (let i = 0; i < e.length; i++) {
            if (e[i].checked) {
                return res + e[i].nextElementSibling.nextElementSibling.innerText;
            }
        }
        
        return '';
    };
    orderForm.onsubmit = (e) => {
        e.preventDefault();
        if (!formIsValid()) {
            return;
        }
        const data = new FormData();
        data.append('name', elements.name.value);
        data.append('phone', elements.phone.value);
        data.append('comment', commentParts.map(paramToComment).join('\n'));
        data.append('to', 'admin@burger.my');
        const http = new XMLHttpRequest();
      //  http.open('POST', 'https://webdev-api.loftschool.com/sendmail/fail', true);
        http.open('POST', 'https://webdev-api.loftschool.com/sendmail', true);
       
        http.onload = () => {
            const resp = JSON.parse(http.responseText);
            openPopup(resp.status ? '#success' : '#fail');
        };
        http.send(data);
    };
})();