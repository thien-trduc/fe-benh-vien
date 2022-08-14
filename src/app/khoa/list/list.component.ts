import { getServerErrorMessage } from 'src/app/helper/handling-error';
import { KHOA_ADD_ROUTE, KHOA_DETAIL_ROUTE, KHOA_ROUTE } from '../../helper/constant';
import { KhoaService } from '../khoa.service';
import { Khoa } from '../khoa.model';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-khoa-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = `Khoa`;
  addRoute = KHOA_ADD_ROUTE;
  editRoute = KHOA_DETAIL_ROUTE;
  listRoute = `/${KHOA_ROUTE}`;

  datas: Khoa[] = [];
  searchResult: Khoa[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;


  constructor(private service: KhoaService, private message: NzMessageService) { }

  async ngOnInit() {
    this.refesh();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh();
  }

  async refesh(): Promise<void> {
    this.loading = true;
    console.log(this.sortKey, this.sortValue);
    const {
      pageIndex,
      pageSize,
      total,
      rows
    } = await this.service.fetch(this.pageIndex, this.pageSize, this.sortKey, this.sortValue);
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
          await this.service.search(1, 10000, { tenKhoa: value }),
          await this.service.search(this.pageIndex, this.pageSize, { tenKhoa: value }),
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
        } = await this.service.search(this.pageIndex, this.pageSize, { tenKhoa: value });
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
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }
}
