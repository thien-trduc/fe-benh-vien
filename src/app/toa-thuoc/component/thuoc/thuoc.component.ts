import { ThuocService } from './../../../thuoc/thuoc.service';
import { Thuoc } from './../../../thuoc/model/thuoc.model';
import { BAC_SI } from '../../../helper/constant';
import { NhanVienService } from '../../../nhan-vien/nhan-vien.service';
import { NhanVien } from '../../../nhan-vien/model/nhan-vien.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

import { THUOC_ROUTE } from '../../../helper/constant';


@Component({
  selector: 'app-thuoc-list',
  templateUrl: './thuoc.component.html',
  styleUrls: ['./thuoc.component.css'],
})
export class ThuocListComponent implements OnInit {

  @Output() public eventThuoc = new EventEmitter<string>();

  title = `Thuốc`;
  listRoute = THUOC_ROUTE;

  datas: Thuoc[] = [];
  searchResult: Thuoc[] = [];
  pageSize = 4;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;


  constructor(private service: ThuocService, private message: NzMessageService) { }

  async ngOnInit() {
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
    } = await this.service.fetch(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, query);
    this.datas = rows;
    console.log(this.datas)
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

  async onSearch(value: string): Promise<void> {
    if (value.trim().length > 0) {
      value = value.trim().toUpperCase();
      try {
        const [resText, res] = await Promise.all([
          await this.service.search(1, 10000, { tenThuoc: value }),
          await this.service.search(this.pageIndex, this.pageSize, { tenThuoc: value }),
        ]);
        this.searchResult = resText.rows;

        this.loading = true;
        const {
          pageIndex,
          pageSize,
          total,
          rows
        } = res;
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;

      } catch (error) {
        this.message.error(error.message);
      }
    } else {
      this.searchResult = [];
    }

  }

  async onSelectSearchChange(value: string): Promise<void> {
    if (value.trim().length > 0) {
      value = value.trim().toUpperCase();
      try {
        this.loading = true;
        const {
          pageIndex,
          pageSize,
          total,
          rows
        } = await this.service.search(this.pageIndex, this.pageSize, { tenThuoc: value });
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
        this.datas = rows;
      } catch (error) {
        console.log(error)
      }
    }
  }

  getThuoc(maThuoc: string): void {
    this.eventThuoc.emit(maThuoc);
  }

  onLamMoi(): void {
    this.pageSize = 4,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.refesh();
  }

  formatCurrency(money: number): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money ? money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '0';
  }


}
