# Generated by Django 4.2.16 on 2024-10-10 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(blank=True, max_length=50, null=True)),
                ('industry', models.CharField(blank=True, max_length=50, null=True)),
                ('number_of_employees', models.PositiveIntegerField(blank=True, null=True)),
                ('hr_name', models.CharField(blank=True, max_length=50, null=True)),
                ('contact_number', models.PositiveIntegerField(blank=True, null=True)),
                ('company_address', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
