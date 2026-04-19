import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AboutUsService } from '../../services/about-us.service';
import { ScrollAnimateDirective } from '../../Directives/about-us.directive';

@Component({
  selector: 'app-about-us',
  imports: [RouterModule ,ScrollAnimateDirective],
  standalone: true,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent  implements OnInit{
  
  private aboutservice = inject(AboutUsService);
  
  sections = signal<any[]>([]);
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.aboutservice.getAboutPage().subscribe({
      next: (res) => {
        console.log('🔥 About Data:', res);
        this.sections.set(res.sections);
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }

}
