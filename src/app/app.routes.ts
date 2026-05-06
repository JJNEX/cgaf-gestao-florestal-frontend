import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ColaboradorLayoutComponent } from './layouts/colaborador-layout/colaborador-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'area-florestal',
        loadComponent: () =>
          import('./features/area-florestal/area-florestal-list/area-florestal-list.component').then(
            (m) => m.AreaFlorestalListComponent
          ),
      },
      {
        path: 'area-florestal/nova',
        loadComponent: () =>
          import('./features/area-florestal/area-florestal-form/area-florestal-form.component').then(
            (m) => m.AreaFlorestalFormComponent
          ),
      },
      {
        path: 'area-florestal/:id/editar',
        loadComponent: () =>
          import('./features/area-florestal/area-florestal-form/area-florestal-form.component').then(
            (m) => m.AreaFlorestalFormComponent
          ),
      },
      {
        path: 'area-florestal/:id',
        loadComponent: () =>
          import('./features/area-florestal/area-florestal-detail/area-florestal-detail.component').then(
            (m) => m.AreaFlorestalDetailComponent
          ),
      },
      {
        path: 'colaboradores',
        loadComponent: () =>
          import('./features/colaboradores/colaboradores-list/colaboradores-list.component').then(
            (m) => m.ColaboradoresListComponent
          ),
      },
      {
        path: 'colaboradores/novo',
        loadComponent: () =>
          import('./features/colaboradores/colaborador-form/colaborador-form.component').then(
            (m) => m.ColaboradorFormComponent
          ),
      },
      {
        path: 'colaboradores/:id/editar',
        loadComponent: () =>
          import('./features/colaboradores/colaborador-form/colaborador-form.component').then(
            (m) => m.ColaboradorFormComponent
          ),
      },
      {
        path: 'colaboradores/:id',
        loadComponent: () =>
          import('./features/colaboradores/colaborador-detail/colaborador-detail.component').then(
            (m) => m.ColaboradorDetailComponent
          ),
      },
      {
        path: 'recursos',
        loadComponent: () =>
          import('./features/recursos/recursos-list/recursos-list.component').then(
            (m) => m.RecursosListComponent
          ),
      },
      {
        path: 'recursos/novo',
        loadComponent: () =>
          import('./features/recursos/recurso-form/recurso-form.component').then(
            (m) => m.RecursoFormComponent
          ),
      },
      {
        path: 'recursos/:id/editar',
        loadComponent: () =>
          import('./features/recursos/recurso-form/recurso-form.component').then(
            (m) => m.RecursoFormComponent
          ),
      },
      {
        path: 'recursos/:id',
        loadComponent: () =>
          import('./features/recursos/recurso-detail/recurso-detail.component').then(
            (m) => m.RecursoDetailComponent
          ),
      },
      {
        path: 'especies',
        loadComponent: () =>
          import('./features/especies/especies-list/especies-list.component').then(
            (m) => m.EspeciesListComponent
          ),
      },
      {
        path: 'especies/nova',
        loadComponent: () =>
          import('./features/especies/especie-form/especie-form.component').then(
            (m) => m.EspecieFormComponent
          ),
      },
      {
        path: 'especies/:id/editar',
        loadComponent: () =>
          import('./features/especies/especie-form/especie-form.component').then(
            (m) => m.EspecieFormComponent
          ),
      },
      {
        path: 'especies/:id',
        loadComponent: () =>
          import('./features/especies/especie-detail/especie-detail.component').then(
            (m) => m.EspecieDetailComponent
          ),
      },
      {
        path: 'relatorios/por-bioma',
        loadComponent: () =>
          import('./features/relatorios/por-bioma/relatorio-por-bioma.component').then(
            (m) => m.RelatorioPorBiomaComponent
          ),
      },
      {
        path: 'relatorios/especies/fichas-tecnicas',
        loadComponent: () =>
          import('./features/relatorios/fichas-tecnicas/fichas-tecnicas.component').then(
            (m) => m.FichasTecnicasComponent
          ),
      },
      {
        path: 'relatorios/estoque/alertas',
        loadComponent: () =>
          import('./features/relatorios/estoque-alertas/estoque-alertas.component').then(
            (m) => m.EstoqueAlertasComponent
          ),
      },
      {
        path: 'relatorios/estoque/previsao',
        loadComponent: () =>
          import('./features/relatorios/estoque-previsao/estoque-previsao.component').then(
            (m) => m.EstoquePrevisaoComponent
          ),
      },
      {
        path: 'relatorios/produtividade',
        loadComponent: () =>
          import('./features/relatorios/produtividade/produtividade.component').then(
            (m) => m.ProdutividadeComponent
          ),
      },
      {
        path: 'relatorios/alertas/criticos',
        loadComponent: () =>
          import('./features/relatorios/alertas-criticos/alertas-criticos.component').then(
            (m) => m.AlertasCriticosComponent
          ),
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/relatorios/relatorio-geracao/relatorio-geracao.component').then(
            (m) => m.RelatorioGeracaoComponent
          ),
      },
      {
        path: 'usuarios/:id/editar',
        loadComponent: () => import('./features/usuarios/usuario-edit/usuario-edit').then(c => c.UsuarioEdit)
      }
    ],
  },
  {
    path: 'colaborador',
    component: ColaboradorLayoutComponent,
    canActivate: [authGuard, userGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/colaborador-dashboard/colaborador-dashboard.component').then(
            (m) => m.ColaboradorDashboardComponent
          ),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./features/inventario/inventario-list/inventario-list.component').then(
            (m) => m.InventarioListComponent
          ),
      },
      {
        path: 'inventario/novo',
        loadComponent: () =>
          import('./features/inventario/inventario-form/inventario-form.component').then(
            (m) => m.InventarioFormComponent
          ),
      },
      {
        path: 'inventario/:id',
        loadComponent: () =>
          import('./features/inventario/inventario-detail/inventario-detail.component').then(
            (m) => m.InventarioDetailComponent
          ),
      },
      {
        path: 'ocorrencias',
        loadComponent: () =>
          import('./features/ocorrencias/ocorrencias-list/ocorrencias-list.component').then(
            (m) => m.OcorrenciasListComponent
          ),
      },
      {
        path: 'ocorrencias/nova',
        loadComponent: () =>
          import('./features/ocorrencias/ocorrencia-form/ocorrencia-form.component').then(
            (m) => m.OcorrenciaFormComponent
          ),
      },
      {
        path: 'ocorrencias/:protocolo',
        loadComponent: () =>
          import('./features/ocorrencias/ocorrencia-detail/ocorrencia-detail.component').then(
            (m) => m.OcorrenciaDetailComponent
          ),
      },
      {
        path: 'plantios',
        loadComponent: () =>
          import('./features/plantios/plantios-list/plantios-list.component').then(
            (m) => m.PlantiosListComponent
          ),
      },
      {
        path: 'plantios/novo',
        loadComponent: () =>
          import('./features/plantios/plantio-form/plantio-form.component').then(
            (m) => m.PlantioFormComponent
          ),
      },
      {
        path: 'plantios/:id',
        loadComponent: () =>
          import('./features/plantios/plantio-detail/plantio-detail.component').then(
            (m) => m.PlantioDetailComponent
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/perfil/perfil.component').then((m) => m.PerfilComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
