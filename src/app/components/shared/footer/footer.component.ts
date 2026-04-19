import { Component ,signal} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  imports: [FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isModalOpen = signal(false);
  hasAgreed = signal(false);

  toggleModal(state: boolean) {
    this.isModalOpen.set(state);
  }


  handleAccept() {
    if (this.hasAgreed()) {
      console.log('Terms Accepted!');
      this.toggleModal(false);
    }
  }
}
