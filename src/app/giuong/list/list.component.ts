import { Giuong } from './../giuong.model';
import { GIUONG_ROUTE } from './../../helper/constant';
import { Component, OnInit } from '@angular/core';
import { GiuongService } from '../giuong.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = `Giường`;
  listRoute = `/${GIUONG_ROUTE}`;

  datas: Giuong[] = [];
  searchResult: Giuong[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;

  validateForm: FormGroup;
  isVisibleModal = false;
  idUpdate: any;
  giuong: Giuong;

  constructor(
    private service: GiuongService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.idUpdate = null;
    this.giuong = null;
    this.validateForm = this.fb.group({
      soGiuong: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+')]],
    });
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
          this.service.search(1, 10000, { soGiuong: value }),
          this.service.search(this.pageIndex, this.pageSize, { soGiuong: value }),
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
        } = await this.service.search(this.pageIndex, this.pageSize, { soGiuong: value });
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

  onLamMoi(): void {
    this.pageSize = 5,
      this.pageIndex = 1,
      this.total = 1,
      this.sortValue = null,
      this.sortKey = null,
      this.refesh();
  }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.invalid) {
      this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      return;
    }
    try {
      if (this.idUpdate) {
        await this.service.update(this.idUpdate, this.validateForm.value);
      } else {
        if (this.validateForm.invalid) {
          this.message.info(`Xin hãy điền đẩy đủ thông tin`);
          return;
        }
        await this.service.store(this.validateForm.value);
      }
      this.giuong = null;
      this.idUpdate = null;
      this.isVisibleModal = false;
      this.onLamMoi();
      this.validateForm.reset();
      this.message.info(`Lưu thành công`);
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }

  async onUpdate(id: string): Promise<void> {
    try {
      this.idUpdate = id;
      this.giuong = await this.service.getById(id);
      const {createdAt, updatedAt, deletedAt, soGiuong} = this.giuong;
      this.validateForm.setValue({soGiuong});
      this.isVisibleModal = true;
    } catch (error) {
      throw error;
    }
  }

  onAdd(): void {
    this.validateForm.reset();
    this.giuong = null;
    this.idUpdate = null;
    this.isVisibleModal = true;
  }

  onCancel(): void {
    this.validateForm.reset();
    this.giuong = null;
    this.idUpdate = null;
    this.isVisibleModal = false;
  }

  formatDate(date: string): string {
    const m = new Date(date);
    return `
    ${m.getDate()}/${(m.getMonth() + 1)}/${m.getFullYear()},  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}
    `;
  }
}
