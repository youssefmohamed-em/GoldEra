import { Component, inject, signal } from '@angular/core';
import { RouterModule } from "@angular/router";
import { ChartsService } from '../../../services/charts.service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [RouterModule, ChartModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {

  private chartsService = inject(ChartsService);

  data = signal<any>(null);
  options = signal<any>(null);
  toggles = signal ({
    
  })

  ngOnInit() {
    this.loadChart();
  }

loadChart() {
  this.chartsService.getGoldPriceSummary(100, 'DAY').subscribe((res: any[]) => {

    const grouped: Record<string, Record<string, number>> = {
      K18: {},
      K21: {},
      K24: {}
    };

    const labelsSet = new Set<string>();

    // 1️⃣ Group data (O(n))
    res.forEach(item => {
      labelsSet.add(item.priceDate);

      if (grouped[item.purity]) {
        grouped[item.purity][item.priceDate] = item.minSellPrice;
      }
    });

    // 2️⃣ Sort labels
    const labels = Array.from(labelsSet).sort();

    // 3️⃣ Fast mapping (O(n))
    const createDataset = (purity: string) => {
      return labels.map(date => grouped[purity][date] ?? null);
    };

    // 4️⃣ Build chart
    this.data.set({
      labels,
      datasets: [
        {
          label: 'K18',
          data: createDataset('K18'),
          borderColor: '#f97316',
          backgroundColor: 'rgba(249,115,22,0.2)',
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'K21',
          data: createDataset('K21'),
          borderColor: '#eab308',
          backgroundColor: 'rgba(234,179,8,0.2)',
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: 'K24',
          data: createDataset('K24'),
          borderColor: '#facc15',
          backgroundColor: 'rgba(250,204,21,0.2)',
          tension: 0.4,
          pointRadius: 3,
          fill:false,
          pointHoverRadius: 6,
        }
      ],
    });

    // 5️⃣ Options (Dark Dashboard Style)
    this.options.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#fff',
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: {
            color: 'rgba(255,255,255,0.05)',
          },
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: {
            color: 'rgba(255,255,255,0.05)',
          },
        },
      },
    });

  });
}

scrollToPrices() {
  document.getElementById('prices')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}
}