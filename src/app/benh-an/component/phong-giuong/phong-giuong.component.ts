import { first } from 'lodash';
import { BenhAnService } from './../../benh-an.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChiTietPhongGiuong } from 'src/app/phong/model/phong.ct-giuong.dto';
import { Phong } from 'src/app/phong/model/phong.model';
import { PhongService } from 'src/app/phong/phong.service';


@Component({
  selector: 'app-phong-giuong',
  templateUrl: './phong-giuong.component.html',
  styleUrls: ['./phong-giuong.component.css']
})
export class PhongGiuongComponent implements OnInit {

  @Output() public eventPhongGiuong = new EventEmitter<number>();

  title = `Chọn Giường`;
  listRoute = '';

  datas: ChiTietPhongGiuong[] = [];
  searchResult: ChiTietPhongGiuong[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedPhongGiuong = null;
  phongs: Phong[] = [];
  selectedPhong: Phong;

  constructor(
    private service: PhongService,
  ) { }

  async ngOnInit() {

    this.phongs = (await   this.service.fetch(1, 10000, null, null)).rows;
    this.selectedPhong = first( this.phongs);
    this.refesh();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh();
  }

  async refesh(query: any = {}): Promise<void> {
    const maPhong = this.selectedPhong.maPhong.toString();
    if (maPhong) {
      this.loading = true;
      const {
        pageIndex,
        pageSize,
        total,
        rows
      } = await this.service.fetchChiTietGiuongs(
        maPhong,
        this.pageIndex, this.pageSize,
        this.sortKey, this.sortValue, { maPhong });
      this.datas = rows.filter(data => data.trangThai === 'Trống');
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.total = total;
      this.loading = false;
    }

  }

  async onPageChange(reset: boolean = false): Promise<void> {
    if (reset) {
      this.pageIndex = 1;
    }
    this.refesh();
  }

  // async onSearch(value: string): Promise<void> {
  //   if (value.trim().length > 0) {
  //     value = value.trim().toUpperCase();
  //     try {
  //       const [resText, res] = await Promise.all([
  //         this.service.search(1, 10000, { soGiuong: value }),
  //         this.service.search(
  //           this.pageIndex, this.pageSize, { tenDv: value }),
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

  //     } catch (error) {
  //       console.log(error)
  //     }
  //   } else {
  //     this.searchResult = [];
  //   }

  // }

  // async onSelectSearchChange(value: string): Promise<void> {
  //   if (value.trim().length > 0) {
  //     value = value.trim().toUpperCase();
  //     try {
  //       this.loading = true;
  //       const {
  //         pageIndex,
  //         pageSize,
  //         total,
  //         rows
  //       } = await this.service.search(this.pageIndex, this.pageSize, { tenDv: value});
  //       this.datas = rows;
  //       this.pageIndex = pageIndex;
  //       this.pageSize = pageSize;
  //       this.total = total;
  //       this.loading = false;
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }

  getGiuong(idCtPhongGiuong: number): void {
    this.eventPhongGiuong.emit(idCtPhongGiuong);
  }

  onLamMoi(): void {
    this.pageSize = 3,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.selectedPhong = first(this.phongs);
    this.selectedPhongGiuong = null;
    this.refesh();
  }

  async onSelectedPhong(maPhong: number): Promise<void> {
    this.selectedPhong = await this.service.getById(maPhong.toString());
    this.refesh();
  }

  formatCurrency(money: number): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money ? money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : '0';
  }
}
