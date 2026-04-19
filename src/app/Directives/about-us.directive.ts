import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit {

  @Input() delay = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {

    const element = this.el.nativeElement;

    // initial state
    this.renderer.addClass(element, 'opacity-0');
    this.renderer.addClass(element, 'translate-y-10');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {

        if (entry.isIntersecting) {

          setTimeout(() => {
            this.renderer.removeClass(element, 'opacity-0');
            this.renderer.removeClass(element, 'translate-y-10');

            this.renderer.addClass(element, 'opacity-100');
            this.renderer.addClass(element, 'translate-y-0');
          }, this.delay);

          observer.unobserve(element); // مهم جدًا عشان ما يعيدش animation

        }

      });
    }, {
      threshold: 0.15
    });

    observer.observe(element);
  }
}