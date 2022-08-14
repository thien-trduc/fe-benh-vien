import { Component, OnInit } from '@angular/core';
import { DOANH_THU_ROUTE } from 'src/app/helper/constant';
import { ThongKeService } from '../thong-ke.service';

@Component({
  selector: 'app-doanh-thu',
  templateUrl: './doanh-thu.component.html',
  styleUrls: ['./doanh-thu.component.css']
})
export class DoanhThuComponent implements OnInit {
  title = 'Thống Kê Doanh Thu';
  listRoute = `${DOANH_THU_ROUTE}`;
  showChart = false;

  // date range picker
  startValue: Date;
  endValue: Date;
  endOpen = false;
  //

  single: any[] = [];
  multi: any[];
  view: any[] = [1400, 400];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Ngày';
  showYAxisLabel = true;
  yAxisLabel = 'VNĐ';

  colorScheme = {
    domain: ['#1E90FF']
  };

  constructor(
    private service: ThongKeService,
  ) { }

  ngOnInit() {

  }

  doanhThu() {
    this.showChart = true;
    this.service.thongKeDoanhThu(this.startValue, this.endValue)
      .then(res => {
        console.log(res);
        this.single = res.map(data => {
          return {
            name: data.ngay,
            value: data.tongTien
          };
        } );
      })
      .catch(error => {
        console.log(error);
      });
  }

  // date range picker
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open);
    this.endOpen = open;
  }
  //

}
