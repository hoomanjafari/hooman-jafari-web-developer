from django.shortcuts import render, redirect
from django.views import View
from django.contrib import messages
from .forms import ContactForm
from .models import Contact


class ContactView(View):
    def get(self, request):
        form = ContactForm()
        return render(request, 'contact/contact.html', {'form': form})

    def post(self, request):
        form = ContactForm(self.request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'اطلاعات شما ثبت شد بزودی با شما تماس میگیرم', 'success')
            return redirect('contact:contact')
        messages.error(request, 'لطفا اطلاعات خواسته شده را به درستی وارد کنید', 'danger')
        return render(request, 'contact/contact.html', {'form': form})
