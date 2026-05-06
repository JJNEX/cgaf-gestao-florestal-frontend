import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-relatorio-geracao',
  standalone: true,
  imports: [RouterModule, PageHeader],
  templateUrl: './relatorio-geracao.component.html',
  styleUrls: ['./relatorio-geracao.component.css']
})
export class RelatorioGeracaoComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
