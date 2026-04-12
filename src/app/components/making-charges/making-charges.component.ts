import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-making-charges',
  imports: [RouterOutlet, RouterModule, HeaderComponent],
  templateUrl: './making-charges.component.html',
  styleUrl: './making-charges.component.scss',
})
export class MakingChargesComponent {

}
