import { Component, OnInit } from '@angular/core';
import { WorkoutsService } from 'ui/app/services/workouts.service';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { NavService } from 'ui/app/services/nav.service';
import { UserService } from 'ui/app/services/user.service';
import { DataService } from 'ui/app/services/data.service';

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

  ormWorkouts = ['Bench Press', 'Squat', 'Deadlift'];
  ormWeights = {}
  ormDates = {}

  public isEditingSettings: boolean = true;
  private userInformation: any = {};

  constructor(
    private workoutsService: WorkoutsService,
    public navService: NavService,
    public UserService: UserService,
    public dataService: DataService) { }

  ngOnInit() {
    let ORMMonths = this.getTimeframe(8);

    this.workoutsService.getStats(ORMMonths).subscribe((result) => {
      this.totalWorkouts = result['total'];

      this.dataService.saveMuscleGroups(result['muscleGroups']);
      this.dataService.saveMuscleNames(result['muscleNames']);

      for(let i in result['muscleGroups']) {
        this.donutChartLabels.push(result['muscleGroups'][i]);
        let workoutsForThisGroup = result['groupsByUse'][result['muscleGroups'][i]] ?? 0;
        this.donutChartData.push(workoutsForThisGroup);
      }

      //Set ORM data
      this.ormWorkouts.forEach((workout) => {
        this.ormWeights[workout] = result['oneRepMax'][workout]['ORM_Weight'];
        this.ormDates[workout] = result['oneRepMax'][workout]['ORM_Date'];
      });

      //Set averages and totals
      this.totalWorkoutDuration = result['totalTime'];
      this.averageWorkoutDuration = result['averageDuration'];
      this.workoutsPerWeek = result['workoutsPerWeek'];

      let ormKeys = Object.keys(result['oneRepMax']['Bench Press']['ORM_History']);
      //Set ORM Histories
      for (let i=0; i < ormKeys.length; i++) {
        this.benchMaxData[i] = result['oneRepMax']['Bench Press']['ORM_History'][ormKeys[i]];
        this.squatMaxData[i] = result['oneRepMax']['Squat']['ORM_History'][ormKeys[i]];
        this.deadliftMaxData[i] = result['oneRepMax']['Deadlift']['ORM_History'][ormKeys[i]];
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

  closeSettings() {
    this.navService.isSettingsAccessed = false;
  }
}
