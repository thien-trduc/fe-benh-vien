import { BenhNhanService } from '../../../benh-nhan/benh-nhan.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BenhNhan } from '../../../benh-nhan/benh-nhan.model';
import { BENH_NHAN_ROUTE } from '../../../helper/constant';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-benh-nhan-list',
  templateUrl: './benh-nhan.component.html',
  styleUrls: ['./benh-nhan.component.css']
})
export class BenhNhanComponent implements OnInit {
  @Output() public eventCMND = new EventEmitter<string>();
  title = `Bệnh Nhân`;
  listRoute = `/${BENH_NHAN_ROUTE}`;

  datas: BenhNhan[] = [];
  searchResult: BenhNhan[] = [];
  pageSize = 3;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;


  constructor(private service: BenhNhanService, private message: NzMessageService) { }

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
        } = await this.service.search(this.pageIndex, this.pageSize, { hoTen: value });
        this.datas = rows;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }

  getBenhNhan(cmnd: string): void {
    this.eventCMND.emit(cmnd);
  }

  onLamMoi(): void {
    this.pageSize = 3,
    this.pageIndex = 1,
    this.total = 1,
    this.sortValue = null,
    this.sortKey = null,
    this.datas = null;
    this.refesh();
  }

}
