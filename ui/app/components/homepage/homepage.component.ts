import { Component, OnInit } from '@angular/core';
import { WorkoutsService } from 'ui/app/services/workouts.service';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  donutChartType: ChartType = 'doughnut';
  donutChartLabels: Label[] = [];
  donutChartData: SingleDataSet[] = [];
  donutChartColors: any = [{ backgroundColor: ["#e84351", "#434a54", "#3ebf9b", "#4d86dc", "#f3af37"] }];
  

  benchMaxData: number[] = [];
  squatMaxData: number[] = [];
  deadliftMaxData: number[] = [];

  barChartType: ChartType = 'line';
  barChartLegend = true;
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: string[] = [];
  barChartData = [
    {data: this.benchMaxData, label: 'Bench Press'},
    {data: this.squatMaxData, label: 'Squat'},
    {data: this.deadliftMaxData, label: 'Deadlift'}
  ];

  totalWorkouts: number;
  workoutsPerWeek: number;
  totalWorkoutDuration: number;
  averageWorkoutDuration: number;

  bpWeight: number;
  bpDate: Date;
  sqWeight: number;
  sqDate: Date;
  dlWeight: number;
  dlDate: Date;

  constructor(private workoutsService: WorkoutsService) {
  }

  ngOnInit() {
    let ORMMonths = this.getTimeframe(8);

    this.workoutsService.getStats(ORMMonths).subscribe((result) => {
      this.totalWorkouts = result['total'];

      for(let i in result['groupsByUse']) {
        this.donutChartLabels.push(i);
        this.donutChartData.push(result['groupsByUse'][i]);
      }

      //Set ORM data
      this.bpWeight = result['maxBench'].BP_ORM_Weight;
      this.bpDate = result['maxBench'].BP_ORM_Date;

      this.sqWeight = result['maxSquat'].SQ_ORM_Weight;
      this.sqDate = result['maxSquat'].SQ_ORM_Date;

      this.dlWeight = result['maxDeadlift'].DL_ORM_Weight;
      this.dlDate = result['maxDeadlift'].DL_ORM_Date;

      //Set averages and totals
      this.totalWorkoutDuration = result['totalTime'];
      this.averageWorkoutDuration = result['averageDuration'];
      this.workoutsPerWeek = result['workoutsPerWeek'];

      let ormKeys = Object.keys(result['maxBench'].BP_ORM_History);

      //Set ORM Histories
      for (let i=0; i < ormKeys.length; i++) {
        this.benchMaxData[i] = result['maxBench'].BP_ORM_History[ormKeys[i]];
        this.squatMaxData[i] = result['maxSquat'].SQ_ORM_History[ormKeys[i]];
        this.deadliftMaxData[i] = result['maxDeadlift'].DL_ORM_History[ormKeys[i]];
      }
    })
  }

  getTimeframe(months: number) {
    let monthsTimeframe = [];
    let abbreviatedMonthsArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var today = new Date();
    var d;
    var month;
    
    for(var i = months; i >= 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      month = abbreviatedMonthsArray[d.getMonth()];
      this.barChartLabels.push(month);
      monthsTimeframe.push(d);
    }

    return monthsTimeframe;

  }

}
