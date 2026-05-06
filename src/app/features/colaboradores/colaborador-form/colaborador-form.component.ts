import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ColaboradorService } from '../services/colaborador.service';
import { ColaboradorRequest, ColaboradorResponse } from '../models/colaborador.model';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-colaborador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeader],
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.css']
})
export class ColaboradorFormComponent implements OnInit {
  form: FormGroup;
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  service = inject(ColaboradorService);
  isEditMode = false;
  colaboradorId: string | null = null;
  private toastService = inject(ToastService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ativo: [true],
      cpf: ['', Validators.required],
      matricula: ['', Validators.required],
      funcao: ['', Validators.required],
      areaAtuacao: ['', Validators.required],
      dataAdmissao: ['', Validators.required],
      contatoEmergencia: ['', Validators.required],
      qualificacoes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.colaboradorId = id;
      this.loadColaboradorData();
      this.form.get('cpf')?.disable();
      this.form.get('matricula')?.disable();
      this.form.get('dataAdmissao')?.disable();
    }
  }

  loadColaboradorData() {
    if (this.colaboradorId) {
      this.service.getById(this.colaboradorId).subscribe((colaborador: ColaboradorResponse) => {
        this.form.patchValue(colaborador);
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const requestBody = this.toRequestBody();
      if (this.isEditMode && this.colaboradorId) {
        this.service.update(this.colaboradorId, requestBody).subscribe({
          next: (response) => {
            this.toastService.show('Colaborador atualizado com sucesso.', 'success');
            this.goBack();
          },
          error: (error) => {
            console.error('Erro ao atualizar colaborador:', error);
            this.toastService.show('Erro ao atualizar colaborador.', 'error');
          }
        });
      } else {
        this.service.create(requestBody).subscribe({
          next: (response) => {
            this.toastService.show('Colaborador criado com sucesso.', 'success');
            this.goBack();
          },
          error: (error) => {
            console.error('Erro ao criar colaborador:', error);
            this.toastService.show('Erro ao criar colaborador.', 'error');
          }
        });
      }
    }
  }

  inativar() {
    if (this.isEditMode && this.colaboradorId) {
      this.service.remove(this.colaboradorId).subscribe({
        next: (response) => {
          this.toastService.show('Colaborador desativado com sucesso.', 'success');
          this.goBack();
        },
        error: (error) => {
          console.error('Erro ao desativar colaborador:', error);
          this.toastService.show('Erro ao desativar colaborador.', 'error');
        }
      });
    }
  }

  toRequestBody(): ColaboradorRequest {
    const formValue = this.form.getRawValue();
    const request: ColaboradorRequest = {
        nome: formValue.nome,
        email: formValue.email,
        ativo: formValue.ativo,
        cpf: formValue.cpf,
        matricula: formValue.matricula,
        funcao: formValue.funcao,
        areaAtuacao: formValue.areaAtuacao,
        dataAdmissao: formValue.dataAdmissao,
        contatoEmergencia: formValue.contatoEmergencia,
        qualificacoes: formValue.qualificacoes ?? '',
    };
    if (!this.isEditMode) {
      request.senha = 'w.'+formValue.cpf; // Padrão UCSAL
    }
    return request;
  }

  toRequestInativar(): ColaboradorRequest {
    const formValue = this.form.getRawValue();
    return { ...this.toRequestBody(), ativo: formValue.ativo };
  }

  goBack() {
    this.location.back();
  }
}
