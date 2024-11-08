from django.views import View
from django.shortcuts import (render,)
import json
from django.http import JsonResponse
# from django.contrib.auth.models import User
from index.models import User
import random as rand
from index.models import (LiveSupportConnection, LiveSupportMessages)


def creat_connection(request):
    data = json.loads(request.body)
    admins = User.objects.filter(is_staff=True, online=True)
    if len(admins) >= 2:
        admins = admins[rand.randint(0, len(admins)-1)]
    elif (len(admins) < 2) and (len(admins) >= 1):
        admins = admins[0]
    else:
        admins = 'offline'
    connection = LiveSupportConnection.objects.filter(user_name=data['userName'], user_number=data['userNumber'])
    if connection.exists() and admins != 'offline':
        connection.delete()
        LiveSupportConnection.objects.create(
            user_name=data['userName'], user_number=data['userNumber'], admin=admins
        )
        print('status :' 'Connection Was There')
        return JsonResponse({
            'connection': 'is there', 'admin': str(admins)
        }, safe=True)
    elif (not connection.exists()) and (admins != 'offline'):
        LiveSupportConnection.objects.create(
            user_name=data['userName'], user_number=data['userNumber'], admin=admins
        )
        print('status :', 'Connection Is New')
        return JsonResponse({
            'connection': 'NewCreation', 'admin': str(admins)
        }, safe=True)
    else:
        try:
            LiveSupportConnection.objects.get(user_name=data['userName'], user_number=data['userNumber'], admin=admins).delete()
            LiveSupportConnection.objects.create(
                user_name=data['userName'], user_number=data['userNumber'], admin=admins
            )
        except LiveSupportConnection.DoesNotExist:
            LiveSupportConnection.objects.create(
                user_name=data['userName'], user_number=data['userNumber'], admin=admins
            )
        print('status :', 'Admins Were Offline')
        return JsonResponse({
            'connection': 'admins were offline', 'admin': str(admins)
        }, safe=True)


# to create user's messages
def create_message(request):
    message = json.loads(request.body)
    create = LiveSupportMessages.objects.create(
        message=message['message'],
        msg_receiver=message['msg-receiver'],
        msg_sender_number=message['msg-sender-number'],
        msg_sender_username=message['msg-sender-username']
    )
    print('request body :', message, 'create time ', create.created_time.time())
    return JsonResponse({
            'message': str(message['message']), 'msg_time': create.created_time.__format__('%H:%M'),
            'create_date': create.created_date.__format__('%m/%d'),
            'msg_sender': str(create.msg_sender_username)
    }, safe=True)


# to send admin messages to template
def admin_message(request):
    admin = json.loads(request.body)
    chat_list = []
    message = LiveSupportMessages.objects.filter(
        msg_sender_username=admin['admin'],
        msg_receiver_number=admin['msg-receiver-number'],
        msg_receiver=admin['msg-receiver-username'],
        received=False,
    )
    for chat in message:
        chat_list.append({
            'msg_receiver_number': chat.msg_receiver_number,
            'msg_receiver_username': chat.msg_receiver,
            'msg_sender': chat.msg_sender_username,
            'message': chat.message,
            'create_time': chat.created_time.__format__('%H:%M'),
            'create_date': chat.created_time.__format__('%m/%d')
        })
        chat.received = True
        chat.save()
    return JsonResponse({
        'data': chat_list,
    })


# to show messages after page reloading
def messages_on_reloading(request):
    data = json.loads(request.body)
    messages = LiveSupportMessages.objects.all()
    print('message length', len(messages))
    chat_list = []
    for message in messages:
        if (message.msg_sender_username == data['Msg_Sender']) and (message.msg_sender_number == data['Msg_SenderNumber']) and (message.msg_receiver == data['Msg_Admin']):
            chat_list.append({
                'message':  message.message,
                'msg_sender': message.msg_sender_username,
                'msg_receiver': message.msg_receiver,
                'created_time': message.created_time.__format__('%H:%M'),
                'created_date': message.created_time.__format__('%m/%d')
            })
        elif (message.msg_sender_username == data['Msg_Admin']) and (message.msg_receiver == data['Msg_Sender']) and (message.msg_receiver_number == data['Msg_SenderNumber']):
            chat_list.append({
                'message': message.message,
                'msg_sender': message.msg_sender_username,
                'msg_receiver': message.msg_receiver,
                'msg_receiver_number': message.msg_receiver_number,
                'created_time': message.created_time.__format__('%H:%M'),
                'created_date': message.created_time.__format__('%m/%d')
            })
        # print('reloading data :', chat_list)
    return JsonResponse(chat_list, safe=False)


class CheckOnlineAdmins(View):
    def post(self, request):
        data = json.loads(self.request.body)
        requested_user = LiveSupportConnection.objects.get(
            user_name=data['user_name'], user_number=data['user_number'], admin=data['admin']
        )
        admins = User.objects.filter(is_staff=True, online=True)
        if (len(admins) < 2) and (len(admins) >= 1):
            admins = admins[0]
        elif len(admins) >= 2:
            admins = admins[rand.randint(0, len(admins) - 1)]
        elif not admins:
            admins = 'offline'
        if admins != 'offline' and requested_user.admin == 'offline':
            try:
                LiveSupportConnection.objects.get(
                    user_name=data['user_name'], user_number=data['user_number'], admin=admins
                ).delete()
            except LiveSupportConnection.DoesNotExist:
                pass
            requested_user.admin = str(admins)
            requested_user.save()
            LiveSupportMessages.objects.filter(
                msg_sender_username=data['user_name'], msg_sender_number=data['user_number'], msg_receiver='offline'
            ).update(msg_receiver=str(admins))
        return JsonResponse({'admin': str(admins)}, safe=False)
