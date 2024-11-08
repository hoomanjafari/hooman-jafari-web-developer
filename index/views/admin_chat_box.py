from django.views import View
from django.shortcuts import (render, redirect)
from index.models import User
from django.http import JsonResponse
import json
from index.models import (LiveSupportConnection, LiveSupportMessages)


class AdminChatBox(View):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_staff is not True:
            return redirect('home:home')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        online = User.objects.filter(online=True, username=request.user.username).exists()
        connections = LiveSupportConnection.objects.filter(admin=request.user)
        return render(request, 'index/admin_chat_box.html', {
            'online': online, 'connections': connections
        })


class AdminStatusChanger(View):
    def get(self, request):
        admin = User.objects.get(username=request.user.username)
        if admin.online is True:
            admin.online = False
            admin.save()
            print({'admin was :': 'Online', 'admin name :': request.user})
        elif admin.online is False:
            admin.online = True
            admin.save()
            print({'admin was :': 'Offline', 'admin name :': str(request.user)})
        return JsonResponse({
            'change admin status:': 'Done'
        }, safe=True)


# to clearing the connections and messages that belongs to the requested admin
class ClearConnectionsMessages(View):
    def post(self, request):
        data = json.loads(self.request.body)
        print('selected user data is', data, 'admin is ', request.user)
        connections = LiveSupportConnection.objects.filter(
            user_name=data['SelectedUserName'], user_number=data['SelectedUserNumber'], admin=request.user
        )
        msg_user_sent = LiveSupportMessages.objects.filter(
            msg_sender_username=data['SelectedUserName'], msg_sender_number=data['SelectedUserNumber'],
            msg_receiver=request.user
        )
        msg_admin_sent = LiveSupportMessages.objects.filter(
            msg_sender_username=request.user, msg_receiver=data['SelectedUserName'],
            msg_receiver_number=data['SelectedUserNumber']
        )
        if request.user.is_authenticated:
            connections.delete()
            msg_user_sent.delete()
            msg_admin_sent.delete()

        return JsonResponse({
            'clearing messages and connections :': 'Done',
            'data': data
        }, safe=True)


# to check if there is any new user request that connect to the specific admin or there is deleted old requests
# every 10sec
class CheckUserRequests(View):
    def get(self, request):
        connections_list = []
        connections = LiveSupportConnection.objects.filter(admin=request.user, received=False)
        for connection in connections:
            connections_list.append({
                'userName': connection.user_name,
                'userNumber': connection.user_number,
                'admin': connection.admin
            })
            connections.update(received=True)
        print('data', connections_list)
        return JsonResponse({'data': connections_list}, safe=True)


# to create admin messages
class CreateAdminMessage(View):
    def post(self, request):
        data = json.loads(request.body)
        print('admin message info is', data)
        create_message = LiveSupportMessages.objects.create(
            msg_sender_username=request.user, msg_receiver=data['msgReceiver'],
            msg_receiver_number=data['msgReceiverNumber'], message=data['message']
        )
        return JsonResponse({
            'creating admin message :': 'Done',
            'data': data,
            'create_time': create_message.created_time.__format__('%m/%d'),
            'create_date': create_message.created_time.__format__('%H:%M'),
            'admin_sender': str(create_message.msg_sender_username),
        })


# to show selected user message on click
class ShowMessages(View):
    def post(self, request):
        data = json.loads(request.body)
        msg_list = []
        messages = LiveSupportMessages.objects.all()
        for message in messages:
            if message.msg_receiver == str(request.user) and message.msg_sender_username == data['msgReceiver'] and message.msg_sender_number == data['msgReceiverNumber']:
                msg_list.append({
                    'msg_sender': message.msg_sender_username,
                    'msg_sender_number': message.msg_sender_number,
                    'msg_receiver': message.msg_sender_username,
                    'message': message.message,
                    'create_time': message.created_time.__format__('%H:%M'),
                    'create_date': message.created_time.__format__('%m/%d')
                })
                message.received = True
                message.save()
            elif message.msg_receiver == data['msgReceiver'] and message.msg_receiver_number == data['msgReceiverNumber'] and message.msg_sender_username == str(request.user):
                msg_list.append({
                    'msg_sender': message.msg_sender_username,
                    'msg_receiver': message.msg_receiver,
                    'msg_receiver_number': message.msg_receiver_number,
                    'message': message.message,
                    'create_time': message.created_time.__format__('%H:%M'),
                    'create_date': message.created_time.__format__('%m/%d')
                })
        print('messages are :', msg_list)
        return JsonResponse({
            'show messages': 'Done',
            'data': msg_list
        })


# to show user new messages on admin chat box
class UserNewMessages(View):
    def post(self, request):
        data = json.loads(self.request.body)
        user_msg = []
        messages = LiveSupportMessages.objects.filter(
            msg_receiver=request.user, msg_sender_username=data['msg_sender'],
            msg_sender_number=data['msg_sender_number'], received=False
        )
        if messages.exists():
            for message in messages:
                user_msg.append({
                    'message': message.message,
                    'msg_sender': message.msg_sender_username,
                    'created_time': message.created_time.__format__('%H:%M'),
                    'created_date': message.created_time.__format__('%m/%d')
                })
                message.received = True
                message.save()
        return JsonResponse({
            'User new messages ': 'Done',
            'data': user_msg
        })
