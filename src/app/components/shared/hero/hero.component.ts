import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-hero',
  imports: [RouterModule , ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private translate = inject(TranslateService)


  t = (key: any) => this.translate.translate(key);
}
