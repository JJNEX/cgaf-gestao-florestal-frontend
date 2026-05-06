import { Component } from '@angular/core';
import { PageHeader } from "../../shared/components/page-header/page-header";

@Component({
  selector: 'app-operacoes',
  standalone: true,
  templateUrl: './operacoes.component.html',
  styleUrl: './operacoes.component.css',
  imports: [PageHeader],
})
export class OperacoesComponent {}
