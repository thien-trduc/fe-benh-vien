import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { LoaiNhanVien } from 'src/app/nhan-vien/model/loai-nhan-vien.model';

import { NHAN_VIEN_ROUTE } from '../../../helper/constant';
import { NhanVien } from '../../../nhan-vien/model/nhan-vien.model';
import { NhanVienService } from '../../../nhan-vien/nhan-vien.service';
import { Y_TA } from './../../../helper/constant';


@Component({
  selector: 'app-yta-list',
  templateUrl: './yta.component.html',
  styleUrls: ['./yta.component.css'],
})
export class YtaComponent implements OnInit {

  @Output() public eventYta = new EventEmitter<string>();

  title = `Y tá`;
  listRoute = NHAN_VIEN_ROUTE;
  maLoai = Y_TA; // bac si;
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
  modal: NzModalRef;

  constructor(private service: NhanVienService, private message: NzMessageService, private modalService: NzModalService) { }

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
          await this.service.searchNhanVien(
            1,
            10000,
            this.sortKey,
            this.sortValue,
            { hoTen: value, loaiNV: { maLoaiNV: this.maLoai } }),
          await this.service.searchNhanVien(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            {
              hoTen: value, loaiNV: { maLoaiNV: this.maLoai }
            }),
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
    if (value.trim().length > 0) {
      value = value.trim().toUpperCase();
      try {
        this.loading = true;
        const {
          pageIndex,
          pageSize,
          total,
          rows
        } = await this.service.searchNhanVien(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          this.sortValue,
          { hoTen: value, loaiNV: { maLoaiNV: this.maLoai } }
        );
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

  getYta(maNV: string): void {
    this.eventYta.emit(maNV);
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
