from django import forms
from .models import Contact


class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = '__all__'

        error_messages = {
            'body': {
                'required': ' * پیام خود را بنویسید لطفا'
            },
            'email': {
                'invalid': ' * ایمیل وارد شده معتبر نیست'
            },
            'number': {
                'required': ' * شماره تماس خود را وارد کنید'
            },
            'subject': {
                'required': ' * موضوع پیام خود را بنویسید'
            }
        }
