import { BenhAnService } from './../../benh-an.service';
import { BenhAn } from './../../model/benh-an.model';
import { BENH_AN_ADD_ROUTE, BENH_AN_DETAIL_ROUTE, BENH_AN_ROUTE } from './../../../helper/constant';
import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = `Bệnh Án`;
  addRoute = BENH_AN_ADD_ROUTE;
  editRoute = BENH_AN_DETAIL_ROUTE;
  listRoute = `/${BENH_AN_ROUTE}`;

  datas: BenhAn[] = [];
  searchResult: any[] = [];
  pageSize = 10;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;
  modal: NzModalRef;


  // options
  view: any[] = [700, 400];
  single = [];
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private service: BenhAnService, private message: NzMessageService, private modalService: NzModalService,
  ) { }

  async ngOnInit() {
    this.single = await this.service.thongKeBenhAn();
    console.log(this.single)
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
          await this.service.searchBenhAnByCMND(1, 10000, { benhNhan: { cmnd: value } }),
          await this.service.searchBenhAnByCMND(this.pageIndex, this.pageSize, { benhNhan: { cmnd: value } }),
        ]);
        this.searchResult = resText.rows.map(item => item.benhNhan);
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
        console.log(error)
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
        } = await this.service.searchBenhAnByCMND(this.pageIndex, this.pageSize, { benhNhan: { cmnd: value } });
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
      } catch (error) {
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
      this.modal = this.modalService.error({
        nzTitle: 'Lỗi',
        nzContent: error,
      });
    }
  }

  getUrlEdit(id: string): string {
    return `${this.editRoute}/${id}`;
  }


  onLamMoi(): void {
    this.pageSize = 10,
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



  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
