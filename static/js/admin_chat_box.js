const admin_online_status = document.getElementById('admin-online-status'),
    admin_status_p = document.getElementById('admin-online-status-p'),
    online_indicator = document.getElementById('online-indicator'),
    remove_chat_connections_btn = document.getElementById('remove-chat-connections-btn'),
    three_dots = document.getElementById('three-dots-options'),
    three_dots_btn = document.getElementById('three-dots-btn'),
    users_requested = document.getElementById('users-requested'),
    chats = document.querySelectorAll('.message'),
    no_requests_yet = document.getElementById('no-requests-yet'),
    admin_message_textarea = document.getElementById('admin-message-textarea'),
    admin_msg_send_btn = document.getElementById('admin-msg-send-btn');

let selected_username = null,
    selected_user_number = null,
    selected_user_div = null,
    user_info = document.querySelectorAll('#user-info'),
    chat_messages = document.getElementById('chat-messages');








// to show/disappear three dots options
three_dots_btn.addEventListener('click', () => {
    three_dots.classList.toggle('display-toggle');
})







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










//send ajax to server to change admin online or offline
function ChangeAdminStatus() {
    fetch('/admin_status_changer/', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
}






// to change admin online status from offline to online and the otherwise
admin_online_status.addEventListener('click', () => {
    online_indicator.classList.toggle('online-indicator-color')
    if (online_indicator.classList.contains('online-indicator-color')) {
        admin_status_p.innerHTML = 'Online';
        ChangeAdminStatus()
    }
    else {
        admin_status_p.innerHTML = 'Offline';
        ChangeAdminStatus()
    }
})









// to save the selected requested user information
function ClearSelected(e) {
    e.forEach( x => {
        x.style.opacity = '50%'
        x.style.border = 'none'
    })
}

function ShowMessages() {
    while (chat_messages.firstElementChild) {
        chat_messages.firstElementChild.remove()
    }
    fetch('/show_messages/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'msgReceiver': selected_username,
            'msgReceiverNumber': selected_user_number,
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data.data)
        data.data.forEach(message => {
            if (message.msg_sender === selected_username && message.msg_sender_number === selected_user_number) {
                let x = document.createElement('div')
                x.classList.add('user-chat', 'message')
                x.innerHTML = `<p>( ${message.create_time} -- ${message.create_date} -- ${message.msg_sender} )</p> ${message.message}`
                chat_messages.appendChild(x)
            }
            else if (message.msg_receiver === selected_username && message.msg_receiver_number === selected_user_number) {
                let x = document.createElement('div')
                x.classList.add('admin-chat', 'message')
                x.innerHTML = `<p>( ${message.create_time} -- ${message.create_date} -- ${message.msg_sender})</p> ${message.message}`
                chat_messages.appendChild(x)
            }
            chat_messages.scrollTo(0, chat_messages.scrollHeight)
        })
    })
}

user_info.forEach(target => {
    target.addEventListener('click', () => {
        selected_username = target.firstElementChild.innerHTML
        selected_user_number = target.lastElementChild.innerHTML
        selected_user_div = target
        ClearSelected(user_info)
        target.style.opacity = '100%';
        target.style.border = '2px solid black'
        ShowMessages()
        console.log({
            'selected_username is ': selected_username,
            'selected_user_number is': selected_user_number
        })
    })
})








// to clear selected user's all messages and connection by pressing it button
remove_chat_connections_btn.addEventListener('click', () => {
    if (selected_user_number !== null && selected_username !== null) {
        fetch('/clear_connections_messages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'SelectedUserName': selected_username,
                'SelectedUserNumber': selected_user_number,
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('selected user info is :', data)
            selected_user_div.remove()

            while (chat_messages.firstElementChild) {
                chat_messages.firstElementChild.remove()
            }
        })
    }
    else {
        alert('لطفا اول کانکشن مورد نظر را انتخاب کنید و بعد روی این دکمه کلیک کنید')
    }
})








// to check if there is any new request is appeared or any deleted request is exists
function CheckUserRequests() {
    fetch('/check_user_requests/', {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => {
        if (no_requests_yet && no_requests_yet.style.display !== 'none')
            no_requests_yet.style.display = 'none'

        data.data.forEach(connection => {
            let x = document.createElement('div')
            x.classList.add('user-info')
            x.innerHTML = `<p>${connection.userName}</p>  <p>${connection.userNumber}</p>`
            users_requested.appendChild(x)
            user_info = document.querySelectorAll('.user-info')
            x.addEventListener('click', (e) => {
                selected_username = x.firstElementChild.innerHTML;
                selected_user_number = x.lastElementChild.innerHTML;
                selected_user_div = x;
                ClearSelected(user_info)
                x.style.opacity = '100%'
                x.style.border = '2px solid black'
                let chat_msg = document.querySelectorAll('.message');
                chat_msg.forEach(msg => {
                    msg.remove()
                })
                ShowMessages()
            })
        })
    })
}
setInterval(CheckUserRequests, 10000)











// to get admin message and send it to server with Ajax
function CreateAdminMessage(message, date, time, admin) {
    let msg = document.createElement('div')
    msg.classList.add('admin-chat', 'message')
    msg.innerHTML = `<p>( ${date} -- ${time} -- ${admin} )</p> ${message.message}`
    chat_messages.appendChild(msg)
    chat_messages.scrollTo(0, chat_messages.scrollHeight)
}

admin_msg_send_btn.addEventListener('click', () => {
    if (admin_message_textarea.value !== '' && selected_username !== null && selected_user_number !== null) {
        fetch('/create_admin_message/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'msgReceiver': selected_username,
                'msgReceiverNumber': selected_user_number,
                'message': admin_message_textarea.value,
            })
        })
        .then(res => res.json())
        .then(data => {
            CreateAdminMessage(data.data, data.create_date, data.create_time, data.admin_sender)
            admin_message_textarea.value = '';
        })
    }
    else {
        alert('برای ارسال پیام روی کانکشن مورد نظر کلیک کنید')
    }
})









// to show user new messages on admin chat box
function UserMessages() {
    if (selected_user_number !== null && selected_username !== null) {
        fetch('/user_new_messages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                'msg_sender': selected_username,
                'msg_sender_number': selected_user_number
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.data.length > 0) {
                data.data.forEach(message => {
                    let new_msg = document.createElement('div')
                    new_msg.classList.add('user-chat', 'message')
                    new_msg.innerHTML = `<p>( ${message.created_time} -- ${message.created_date} -- ${message.msg_sender} )</p> ${message.message}`
                    chat_messages.appendChild(new_msg)
                    chat_messages.scrollTo(0, chat_messages.scrollHeight)
                })
            }

        })
    }
}
setInterval(UserMessages, 5000)
