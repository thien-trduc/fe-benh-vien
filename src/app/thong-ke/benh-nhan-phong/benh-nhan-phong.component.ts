import { BENH_NHAN_PHONG_ROUTE } from './../../helper/constant';
import { Component, OnInit } from '@angular/core';
import { ThongKeService } from '../thong-ke.service';
import { KhoaService } from 'src/app/khoa/khoa.service';

@Component({
  selector: 'app-benh-nhan-phong',
  templateUrl: './benh-nhan-phong.component.html',
  styleUrls: ['./benh-nhan-phong.component.css']
})
export class BenhNhanPhongComponent implements OnInit {

  title = 'Thống Kê Bệnh Nhân Điều Trị Tại Phòng';
  listRoute = `${BENH_NHAN_PHONG_ROUTE}`;
  showChart = false;
  khoas: any[];
  maKhoa: string;

  constructor(
    private service: ThongKeService,
    private khoaService: KhoaService,
  ) { }

  single: any[] = [];
  multi: any[];
  view: any[] = [1400, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Phòng';
  showYAxisLabel = true;
  yAxisLabel = 'Bệnh nhân điều trị';
  colorScheme = {
    domain: ['#1E90FF']
  };


  ngOnInit() {
    this.khoaService.fetch(1, 10000, null, null).then(res => {
      this.khoas = res.rows;
    });
  }

  thongKePhongBenhNhan() {
    this.showChart =true;
    this.service.thongKeBenhNhanPhong(this.maKhoa)
      .then(res => {
        this.single = res.map(data => {
          return {
            name: data.phong,
            value: data.tongBenhNhan,
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

}
