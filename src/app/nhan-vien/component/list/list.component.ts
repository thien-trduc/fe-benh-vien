import { NhanVienService } from '../../nhan-vien.service';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

import { NHAN_VIEN_ADD_ROUTE, NHAN_VIEN_DETAIL_ROUTE, NHAN_VIEN_ROUTE } from '../../../helper/constant';
import { NhanVien } from '../../model/nhan-vien.model';
import { KhoaService } from 'src/app/khoa/khoa.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  title = `Nhân Viên`;
  addRoute = NHAN_VIEN_ADD_ROUTE;
  editRoute = NHAN_VIEN_DETAIL_ROUTE;
  listRoute = NHAN_VIEN_ROUTE;

  datas: NhanVien[] = [];
  searchResult: NhanVien[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;


  constructor(private service: NhanVienService, private message: NzMessageService) { }

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
    if (value.length > 0) {
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
        this.message.error(error.message);
      }
    } else {
      this.searchResult = [];
    }

  }

  async onSelectSearchChange(value: string): Promise<void> {
    if (value) {
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
        this.message.error(error.message);
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.service.delete(id);
      this.refesh();
      this.message.info(`Xóa Thành Công`);
    } catch ({ error }) {
      this.message.error(error.message);
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
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()}
    `;
  }

}
