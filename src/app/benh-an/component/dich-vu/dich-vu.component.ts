import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DichVuService } from 'src/app/dich-vu/dich-vu.service';
import { DichVu } from 'src/app/dich-vu/model/dich-vu.model';
import { DICH_VU_ROUTE } from 'src/app/helper/constant';

@Component({
  selector: 'app-dich-vu-su-dung',
  templateUrl: './dich-vu.component.html',
  styleUrls: ['./dich-vu.component.css']
})
export class DichVuComponent implements OnInit {

  @Output() public eventDichVu = new EventEmitter<string>();

  title = `Dịch Vụ`;
  listRoute = DICH_VU_ROUTE;

  datas: DichVu[] = [];
  searchResult: DichVu[] = [];
  pageSize = 3;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedDichVu = null;


  constructor(private service: DichVuService) { }

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

  async onSearch(value: string): Promise<void> {
    if (value.trim().length > 0) {
      value = value.trim().toUpperCase();
      try {
        const [resText, res] = await Promise.all([
          this.service.search(1, 10000, { tenDv: value }),
          this.service.search(
            this.pageIndex, this.pageSize, { tenDv: value }),
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
        } = await this.service.search(this.pageIndex, this.pageSize, { tenDv: value});
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

  getDichVu(maDV: string): void {
    this.eventDichVu.emit(maDV);
  }

  onLamMoi(): void {
    this.pageSize = 3,
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
