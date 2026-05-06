import { Component } from '@angular/core';
import { PageHeader } from "../../shared/components/page-header/page-header";

@Component({
  selector: 'app-especies',
  standalone: true,
  templateUrl: './especies.component.html',
  styleUrl: './especies.component.css',
  imports: [PageHeader],
})
export class EspeciesComponent {}
