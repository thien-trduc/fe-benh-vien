import { BenhNhan } from './../benh-nhan.model';
import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';

import { BENH_NHAN_ADD_ROUTE, BENH_NHAN_DETAIL_ROUTE, BENH_NHAN_ROUTE } from './../../helper/constant';
import { BenhNhanService } from './../benh-nhan.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = `Bệnh Nhân`;
  addRoute = BENH_NHAN_ADD_ROUTE;
  editRoute = BENH_NHAN_DETAIL_ROUTE;
  listRoute = `/${BENH_NHAN_ROUTE}`;

  datas: BenhNhan[] = [];
  searchResult: BenhNhan[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;
  modal: NzModalRef;

  constructor(
    private service: BenhNhanService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  async ngOnInit() {
    console.log( JSON.parse(localStorage.getItem('currentUser')))
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
          await this.service.search(1, 10000, { hoTen: value }),
          await this.service.search(this.pageIndex, this.pageSize, { hoTen: value }),
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
        console.log(error);
      }
    } else {
      this.searchResult = [];
    }

  }

  async onSelectSearchChange(value: string): Promise<void> {
    if (value.trim().length ) {
      value = value.trim().toUpperCase();
      try {
        this.loading = true;
        const {
          pageIndex,
          pageSize,
          total,
          rows
        } = await this.service.search(this.pageIndex, this.pageSize, { hoTen: value });
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
      } catch (error) {
        // this.message.error(`Lưu Thất bại ${error.message}`);
        console.log(error)
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.service.delete(id);
      this.refesh();
      this.message.info(`Xóa Thành Công`);
    } catch (error) {
      // this.message.error(error);
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: error,
      })
    }
  }

  getUrlEdit(id: string): string {
    return `${this.editRoute}/${id}`;
  }


  onLamMoi(): void {
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
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }

}
