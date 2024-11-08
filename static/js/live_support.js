const live_support_close_btn = document.getElementById('live-support-close-btn'),
    live_support_container = document.getElementById('live-support-container'),
    live_support_icon = document.getElementById('live-support-icon'),
    send_user_infoBtn = document.getElementById('send-user-info'),
    support_user_name = document.getElementById('support-user-name'),
    support_user_number = document.getElementById('support-user-number'),
    support_form = document.getElementById('support-form'),
    admin_status_p = document.getElementById('admin-status-p'),
    admin_status_span = document.getElementById('admin-status-span'),
    admin_status = document.getElementById('admin-status'),
    support_chatting_textarea = document.getElementById('support-chatting-textarea'),
    is_typing = document.getElementById('indicator'),
    chat_send_btn = document.getElementById('chat-send-btn'),
    support_chatting_form = document.getElementById('support-chatting-form'),
    support_chatting = document.getElementById('support-chatting'),
    no_admin_user_msg = document.getElementById('no-admin-user-msg');

array = []

// -----------------------------------------------------------------------
// for opening the live-support-container
live_support_icon.addEventListener('click', () => {
    live_support_container.style.display = 'flex';
    support_chatting.scrollTo(0, support_chatting.scrollHeight)
})

// for closing the live-support-container
live_support_close_btn.addEventListener('click', () =>{
    live_support_container.style.display = 'none';
})

// -----------------------------------------------------------------------
// get CSRF_TOKEN from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// -----------------------------------------------------------------------
// to check after reloading page

function CheckSupport() {
    let admin = JSON.parse(localStorage.getItem('admin'));
    if (localStorage.getItem('user-info')) {
        support_form.remove();
        admin_status.style.display = 'flex';
        support_chatting_form.style.opacity= '100%';
        if (admin === 'offline') {
            admin_status_p.innerHTML = 'در حال حاضر هیچ ادمینی انلاین نیست';
            no_admin_user_msg.style.display = 'block'
        }
        else {
            admin_status_span.innerHTML = admin;
            no_admin_user_msg.style.display = 'none'
            document.getElementById('admin-1st-message').style.display = 'block';
        }
    }
}
CheckSupport()

// -----------------------------------------------------------------------
// sending username & user number & admin to server with Ajax
function ConnectionDetails(username, user_number) {
    fetch('/create_connection/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({
            'userName': username,
            'userNumber': user_number,
        })
    })
    .then(res => res.json())
    .then(data => {
        support_form.remove();
        admin_status.style.display = 'flex';
        support_chatting_form.style.opacity = '100%';
        localStorage.setItem('user-info', JSON.stringify(array));
        localStorage.setItem('admin', JSON.stringify(data.admin));
        if (data.admin === 'offline') {
            admin_status_p.innerHTML = 'در حال حاضر هیچ ادمینی انلاین نیست';
            no_admin_user_msg.style.display = 'block';
        }
        else {
            admin_status_span.innerHTML = data.admin;
            no_admin_user_msg.style.display = 'none';
            document.getElementById('admin-1st-message').style.display = 'block';
        }
        console.log(data);
        setInterval(ShowAdminMsg, 20000)
    })
}

// -----------------------------------------------------------------------
// get user information
send_user_infoBtn.addEventListener('click', () => {
    let userName = support_user_name.value;
    let userNumber = support_user_number.value;
    array.push({
        'username': userName,
        'user_number': userNumber
    })
    support_user_name.value = "";
    support_user_number.value = "";
    if (userName.toString().toLowerCase().match('^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$')
    && userNumber.match('^(\\+98|0)?9\\d{9}$')) {
        ConnectionDetails(userName, userNumber)
    }
    else {
        alert('لطفا شماره تماس و ایمیل صحیح وارد کنید')
    }
    console.log('CSRF_TOKEN IS : ', csrftoken)
})

// -----------------------------------------------------------------------
// to append user message to chat box

function CreateMessage(message, time, date, sender) {
    let i = document.createElement('div');
    i.classList.add('user-message', 'animate');
    i.innerHTML =`<p class="time-size">(${sender} -- ${time} -- ${date})</p> ${message}`;
    support_chatting.appendChild(i);
}

// -----------------------------------------------------------------------
// to send message to the server

function SendMessage(message) {
    fetch('/create_message/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'message': message,
            'msg-sender-username': JSON.parse(localStorage.getItem('user-info'))[0].username,
            'msg-sender-number': JSON.parse(localStorage.getItem('user-info'))[0].user_number,
            'msg-receiver': JSON.parse(localStorage.getItem('admin'))
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            CreateMessage(data.message, data.msg_time, data.create_date, data.msg_sender);
            support_chatting.scrollTo(0, support_chatting.scrollHeight);
        })
}

// -----------------------------------------------------------------------
// get live support messages

chat_send_btn.addEventListener('click', () => {
    let message = support_chatting_textarea.value;
    if (localStorage.getItem('user-info') && support_chatting_textarea.value !== '') {
        SendMessage(message);
        support_chatting_textarea.value = '';
    }
})

// -----------------------------------------------------------------------
// get live support messages

function ShowAdminMsg() {
    fetch('/admin_message/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body:JSON.stringify({
            'admin': JSON.parse(localStorage.getItem('admin')),
            'msg-receiver-number': JSON.parse(localStorage.getItem('user-info'))[0].user_number,
            'msg-receiver-username': JSON.parse(localStorage.getItem('user-info'))[0].username,
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.data.length > 0) {
                console.log(data)
                is_typing.style.display = 'flex'
                setTimeout( () => {
                    is_typing.style.display = 'none'
                    data.data.forEach(message => {
                    let i = document.createElement('div');
                    i.classList.add('admin-message', 'animate');
                    i.innerHTML = `<p class="time-size">(${message.msg_sender} -- ${message.create_time} -- ${message.create_date} )</p> ${message.message}`
                    support_chatting.appendChild(i);
                    support_chatting.scrollTo(0, support_chatting.scrollHeight);
                })
                }, 5000)
            }
            else {
                console.log('i dont know ...')
            }
        })
}

if (localStorage.getItem('user-info')) {
    setInterval(ShowAdminMsg, 10000)
}

// -----------------------------------------------------------------------
// show live support messages after reloading the page

function CreateMessagesOnReloading(data) {
    data.forEach( item => {
        if (
            item.msg_sender === JSON.parse(localStorage.getItem('user-info'))[0].username
            && item.msg_receiver === JSON.parse(localStorage.getItem('admin'))
        ) {
            let i = document.createElement('div');
            i.classList.add('user-message', 'animate');
            i.innerHTML = `<p class="time-size">( ${item.msg_sender} -- ${item.created_time} -- ${item.created_date})</p> ${item.message}`
            support_chatting.appendChild(i)
        }
        else if (
            item.msg_sender === JSON.parse(localStorage.getItem('admin'))
            && item.msg_receiver === JSON.parse(localStorage.getItem('user-info'))[0].username
            && item.msg_receiver_number === JSON.parse(localStorage.getItem('user-info'))[0].user_number
        ) {
            let i = document.createElement('div');
            i.classList.add('admin-message', 'animate');
            i.innerHTML = `<p class="time-size">(${item.msg_sender} -- ${item.created_time} -- ${item.created_date} )</p> ${item.message}`
            support_chatting.appendChild(i);
        }
    })
}

function MessagesOnReloading() {
    if (localStorage.getItem('user-info')) {
        fetch('/messages_on_reloading/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'Msg_Sender': JSON.parse(localStorage.getItem('user-info'))[0].username,
            'Msg_SenderNumber': JSON.parse(localStorage.getItem('user-info'))[0].user_number,
            'Msg_Admin': JSON.parse(localStorage.getItem('admin'))
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            CreateMessagesOnReloading(data)
        })
    }
}
MessagesOnReloading()

// -----------------------------------------------------------------------
// check online admins to user with offline admins

function CheckOnlineAdmins() {
    let current_admin = JSON.parse(localStorage.getItem('admin'))
    if (current_admin === 'offline') {
        fetch('/check_online_admins/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'user_name': JSON.parse(localStorage.getItem('user-info'))[0].username,
            'user_number': JSON.parse(localStorage.getItem('user-info'))[0].user_number,
            'admin': JSON.parse(localStorage.getItem('admin'))
        })
        })
        .then(res => res.json())
        .then(data => {
            if (data.admin === 'offline') {
                admin_status_p.innerHTML = 'در حال حاضر هیچ ادمینی انلاین نیست';
                no_admin_user_msg.style.display = 'block';
            }
            else {
                localStorage.removeItem('admin');
                localStorage.setItem('admin', JSON.stringify(data.admin));
                console.log('new admin is', data.admin)
                admin_status.innerHTML = `<p class="admin-status-p"><span>${data.admin}</span> پاسخگوی سوالات شما می باشد </p>`
                no_admin_user_msg.style.display = 'none';
                document.getElementById('admin-1st-message').style.display = 'block';
                clearInterval(check_online_admins)
            }
            console.log('checking done')
        })
    }
}
let check_online_admins = setInterval(CheckOnlineAdmins, 20000);
