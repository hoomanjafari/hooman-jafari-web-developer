from django.urls import path
from . import views

app_name = 'home'
urlpatterns = [
    path('', views.Home.as_view(), name='home'),
    path('search-page/', views.SearchView.as_view(), name='search-page'),
    path('admin_chat_box/', views.AdminChatBox.as_view(), name='admin-chat-box'),
    path('create_connection/', views.creat_connection, name='create-connection'),
    path('create_message/', views.create_message, name='create_message'),
    path('admin_message/', views.admin_message, name='admin-message'),
    path('messages_on_reloading/', views.messages_on_reloading, name='messages-on-reloading'),
    path('check_online_admins/', views.CheckOnlineAdmins.as_view(), name='check-online-admins'),


    path('admin_status_changer/', views.AdminStatusChanger.as_view(), name='admin-status-changer'),
    path('clear_connections_messages/', views.ClearConnectionsMessages.as_view(), name='clear-connections-messages'),
    path('check_user_requests/', views.CheckUserRequests.as_view(), name='check-user-requests'),
    path('create_admin_message/', views.CreateAdminMessage.as_view(), name='create-admin-message'),
    path('show_messages/', views.ShowMessages.as_view(), name='show-messages-inAdminChat'),
    path('user_new_messages/', views.UserNewMessages.as_view(), name='user-new-messages'),
]
