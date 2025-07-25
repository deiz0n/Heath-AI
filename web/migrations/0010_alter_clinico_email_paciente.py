# Generated by Django 5.1.6 on 2025-05-26 17:55

import cpf_field.models
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web', '0009_clinico_alter_multimodal_raio_x_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clinico',
            name='email',
            field=models.EmailField(max_length=254),
        ),
        migrations.CreateModel(
            name='Paciente',
            fields=[
                ('id', models.UUIDField(default=uuid.UUID('74fdd11f-49a2-4976-8547-7db8ad301617'), editable=False, primary_key=True, serialize=False)),
                ('nome', models.CharField()),
                ('sobrenome', models.CharField()),
                ('cpf', cpf_field.models.CPFField(max_length=14, verbose_name='cpf')),
                ('data_nascimento', models.DateField()),
                ('endereco', models.CharField()),
                ('exame', models.ManyToManyField(related_name='exames', to='web.multimodal')),
            ],
        ),
    ]
