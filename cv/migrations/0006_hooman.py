# Generated by Django 4.2.7 on 2024-04-18 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cv', '0005_alter_mycv_main_img'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hooman',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('resume', models.FileField(upload_to='pdf/%y%m%d%H%M')),
            ],
        ),
    ]