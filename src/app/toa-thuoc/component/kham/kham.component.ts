import { BenhAn } from './../../../benh-an/model/benh-an.model';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';
import { Kham } from 'src/app/benh-an/model/benh-an.kham.model';
import { NhanVienService } from 'src/app/nhan-vien/nhan-vien.service';

import { first } from 'lodash'

@Component({
  selector: 'app-kham-select-list',
  templateUrl: './kham.component.html',
  styleUrls: ['./kham.component.css']
})
export class KhamSelectComponent implements OnInit {
  @Output() public eventKhamSelect = new EventEmitter<any>();

  title = `Khám bệnh`;
  kham: Kham;
  datas: Kham[] = [];
  searchResult: Kham[] = [];
  pageSize = 3;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = false;
  // tuNgay: Date;
  // denNgay: Date;
  validateForm: FormGroup;
  startValue: Date | null = null;
  endValue: Date | null = null;
  endOpen = false;
  idBenhAn: string;
  benhAns: BenhAn[];
  selectedBenhAn: BenhAn;

  constructor(
    private service: BenhAnService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.benhAns = (await this.service.fetch(1, 10000, null, null)).rows;
    if (this.benhAns.length > 0) {
      this.selectedBenhAn = first(this.benhAns);
      this.idBenhAn = this.selectedBenhAn.maBA;
    }
    this.refesh();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh();
  }

  async refesh(query: any = {}): Promise<void> {
    this.loading = true;
    const {
      pageIndex,
      pageSize,
      total,
      rows
    } = await this.service.fetchKham(this.idBenhAn, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, query);
    this.datas = rows;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.loading = false;
  }

  async onPageChange(reset: boolean = false): Promise<void> {
    if (reset) {
      this.pageIndex = 1;
    }
    this.refesh();
  }

  // async onSearch(): Promise<void> {
  //   if (this.tuNgay && this.denNgay) {
  //     try {
  //       console.log(this.tuNgay, this.denNgay)
  //       this.loading = true;
  //       const {
  //         pageIndex,
  //         pageSize,
  //         total,
  //         rows
  //       } = await this.service.searchKhams(this.idBenhAn, this.pageIndex, this.pageSize, { tuNgay: this.tuNgay, denNgay: this.denNgay });
  //       this.datas = rows;
  //       this.pageIndex = pageIndex;
  //       this.pageSize = pageSize;
  //       this.total = total;
  //       this.loading = false;
  //     } catch ({ error }) {
  //       this.message.error(`Lưu Thất bại ${error.message}`);
  //     }
  //   }
  // }

  onLamMoi(): void {
    // this.tuNgay = null;
    // this.denNgay = null;
    this.pageSize = 5,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.refesh();
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getUTCFullYear()}/${(m.getUTCMonth() + 1)}/${m.getUTCDate()},  ${m.getUTCHours()}:${m.getUTCMinutes()}:${m.getUTCSeconds()}
    `;
  }

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

  // onStartChange(date: Date): void {
  //   this.tuNgay = date;
  // }

  // onEndChange(date: Date): void {
  //   this.denNgay = date;
  // }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open);
    this.endOpen = open;
  }

  getMaKham(idKham: number): void {
    this.eventKhamSelect.emit(idKham);
  }

  async onSearchBenhAn(value: string): Promise<void> {
    if (value.length > 0) {
      try {
        this.benhAns = (await this.service.search(1, 10000, { maBA: value })).rows
      } catch (error) {
        this.message.error(error.message);
      }
    } else {
      this.searchResult = [];
    }

  }

  async onSelectSearchChangeBenhAn(value: string): Promise<void> {
    console.log(value)
    try {
      this.selectedBenhAn = await this.service.getById(value);
      this.idBenhAn = value;
      console.log(value)
      this.refesh();
    } catch (error) {
      console.log(error);
    }

  }
}
