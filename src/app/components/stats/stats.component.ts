import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor() { 
    
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['1', '2', '3', '4', '5', '6', '7'];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartData = [
    {data: [350, 360, 360, 380, 380, 385, 385], label: 'Bench Press'},
    {data: [380, 380, 380, 390, 390, 390, 405], label: 'Squat'}
  ];

  public doughnutChartLabels = ['Bicep', 'Pecs', 'Tricep', 'Hamstring'];
  public doughnutChartData = [120, 150, 180, 90];
  public doughnutChartType = 'doughnut';

  ngOnInit() {
  }

}
