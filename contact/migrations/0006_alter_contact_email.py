# Generated by Django 4.2.7 on 2024-04-17 01:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contact', '0005_alter_contact_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='email',
            field=models.EmailField(blank=True, error_messages='salasl asladlawd', max_length=254, null=True),
        ),
    ]
