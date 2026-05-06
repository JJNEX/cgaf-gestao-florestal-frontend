import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorCard } from '../../../shared/components/error-card/error-card';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeader, SpinnerComponent, ErrorCard],
  templateUrl: './usuario-edit.html',
  styleUrl: './usuario-edit.css',
})
export class UsuarioEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly usuarioService = inject(UsuarioService);
  
  form!: FormGroup;
  isLoading = signal(true);
  error = signal<string | null>(null);
  usuarioId: string | null = null;
  
  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    });

    this.usuarioId = this.route.snapshot.paramMap.get('id');
    if (this.usuarioId) {
      this.loadUsuario();
    } else {
      this.isLoading.set(false);
    }
  }

  loadUsuario() {
    this.isLoading.set(true);
    this.error.set(null);

    this.usuarioService.getById(this.usuarioId!).subscribe({
      next: (res: Usuario) => {
        this.form.patchValue({
          nome: res.nome,
          email: res.email,  
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erro ao carregar usuário.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Dados salvos', this.form.getRawValue());
    }
  }
  
  goBack() {
    this.location.back();
  }
}
