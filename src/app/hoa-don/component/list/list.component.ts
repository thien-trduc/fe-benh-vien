import { first } from 'lodash';
import { HoaDonService } from '../../hoa-don.service';
import { HoaDon } from '../../hoa-don.model';
import { HOA_DON_DETAIL_ROUTE, HOA_DON_ROUTE, HOA_DON_ADD_ROUTE } from '../../../helper/constant';
import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { BenhAn } from 'src/app/benh-an/model/benh-an.model';
import { BenhAnService } from 'src/app/benh-an/benh-an.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = `Hóa Đơn`;
  addRoute = `${HOA_DON_ADD_ROUTE}`;
  editRoute = HOA_DON_DETAIL_ROUTE;
  listRoute = HOA_DON_ROUTE;

  datas: HoaDon[] = [];
  searchResult: HoaDon[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;
  benhAnSelected: BenhAn;
  dataBenhAns: BenhAn[];
  modal: NzModalRef;

  constructor(
    private service: HoaDonService,
    private benhAnService: BenhAnService,
    private message: NzMessageService,
    private router: Router,
    private modalService: NzModalService,
  ) { }

  async ngOnInit() {
    try {
      this.dataBenhAns = (await this.benhAnService.fetch(1, 10000, null, null)).rows;
      this.benhAnSelected = first(this.dataBenhAns);
    } catch (error) {
      throw error;
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
    const benhAn = { maBA: this.benhAnSelected.maBA };
    const {
      pageIndex,
      pageSize,
      total,
      rows
    } = await this.service.fetch(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, { ...query });
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

  // async onSearch(value: string): Promise<void> {
  //   if (value.length > 0) {
  //     try {
  //       const [resText, res] = await Promise.all([
  //         this.service.search(1, 10000, { maToa: value }),
  //         this.service.search(this.pageIndex, this.pageSize, { maToa: value }),
  //       ]);
  //       this.searchResult = resText.rows;

  //       this.loading = true;
  //       const {
  //         pageIndex,
  //         pageSize,
  //         total,
  //         rows
  //       } = res;
  //       this.datas = rows;
  //       this.pageIndex = pageIndex;
  //       this.pageSize = pageSize;
  //       this.total = total;
  //       this.loading = false;

  //     } catch ({ error }) {
  //       this.message.error(error.message);
  //     }
  //   } else {
  //     this.searchResult = [];
  //   }

  // }

  // async onSelectSearchChange(value: string): Promise<void> {
  //   if (value) {
  //     try {
  //       this.loading = true;
  //       const {
  //         pageIndex,
  //         pageSize,
  //         total,
  //         rows
  //       } = await this.service.search(this.pageIndex, this.pageSize, { maToa: value });
  //       this.datas = rows;
  //       this.pageIndex = pageIndex;
  //       this.pageSize = pageSize;
  //       this.total = total;
  //       this.loading = false;
  //     } catch ({ error }) {
  //       this.message.error(error.message);
  //     }
  //   }
  // }

  async delete(id: string): Promise<void> {
    try {
      await this.service.delete(id);
      this.refesh();
      this.message.info(`Xóa Thành Công`);
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: error,
      });
    }
  }

  getUrlEdit(id: string): string {
    return `${this.editRoute}/${id}`;
  }

  async onLamMoi(): Promise<void> {
    try {
      this.dataBenhAns = (await this.benhAnService.fetch(1, 10000, null, null)).rows;
      this.benhAnSelected = first(this.dataBenhAns);
      this.pageSize = 5,
        this.pageIndex = 1,
        this.total = 1,
        this.sortValue = null,
        this.sortKey = null,
        this.refesh();
    } catch (error) {
      console.log(error);
    }
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }

  async onSelectSearchChangeBenhAn(maBA: string): Promise<void> {
    if (maBA.trim().length > 0) {
      this.benhAnSelected = await this.benhAnService.getById(maBA);
      this.refesh({ benhAn: this.benhAnSelected });
    }
  }

  async onSearchBenhAn(value: string): Promise<void> {
    if (value.trim().length > 0) {
      value = value.trim().toUpperCase();
      this.dataBenhAns = (await this.benhAnService.search(1, 10000, { maBA: value })).rows;
    }
  }


  formatCurrency(money): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }

  redirectTaoMoi(): void {
    this.router.navigateByUrl(`/${HOA_DON_ROUTE}/${HOA_DON_ADD_ROUTE}?maBA=${this.benhAnSelected.maBA}`);
  }
}
