import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthForm }  from './health-form/health-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HealthForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'health-declaration';
}
