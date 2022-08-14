import { BAC_SI } from '../../../helper/constant';
import { NhanVienService } from '../../../nhan-vien/nhan-vien.service';
import { NhanVien } from '../../../nhan-vien/model/nhan-vien.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

import { NHAN_VIEN_ROUTE } from '../../../helper/constant';
import { LoaiNhanVien } from 'src/app/nhan-vien/model/loai-nhan-vien.model';


@Component({
  selector: 'app-bac-si-list',
  templateUrl: './bac-si.component.html',
  styleUrls: ['./bac-si.component.css'],
})
export class BacSiComponent implements OnInit {

  @Output() public eventBacSi = new EventEmitter<string>();

  title = `Bác Sĩ`;
  listRoute = NHAN_VIEN_ROUTE;
  maLoai = BAC_SI; // bac si;
  loaiNV: LoaiNhanVien;

  datas: NhanVien[] = [];
  searchResult: NhanVien[] = [];
  pageSize = 3;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;


  constructor(private service: NhanVienService, private message: NzMessageService) { }

  async ngOnInit() {
    this.loaiNV = new LoaiNhanVien();
    this.loaiNV.maLoaiNV = this.maLoai;
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
    } = await this.service.fetchByLoaiNhanVien(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, { ...query, loaiNV: this.loaiNV });
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
          this.service.searchNhanVien(1, 10000, this.sortKey,
            this.sortValue, { hoTen: value, loaiNV: { maLoaiNV: this.maLoai } }),
          this.service.searchNhanVien(
            this.pageIndex, this.pageSize, this.sortKey,
            this.sortValue, { hoTen: value, loaiNV: { maLoaiNV: this.maLoai } }),
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
        } = await this.service.searchNhanVien(this.pageIndex, this.pageSize, this.sortKey,
          this.sortValue, { hoTen: value, loaiNV: { maLoaiNV: this.maLoai }});
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

  getBenhNhan(maNV: string): void {
    this.eventBacSi.emit(maNV);
  }

  onLamMoi(): void {
    this.pageSize = 3,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.refesh();
  }

}
