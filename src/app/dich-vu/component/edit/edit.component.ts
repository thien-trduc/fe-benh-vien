import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { DICH_VU_ROUTE } from 'src/app/helper/constant';
import { environment } from 'src/environments/environment';

import { DichVuService } from './../../dich-vu.service';
import { DichVuCapNhat } from './../../model/dich-vu.cap-nhat';
import { DichVu } from './../../model/dich-vu.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  title = 'Dịch vụ';
  dichVu: DichVu;
  validateForm: FormGroup;
  validateFormGia: FormGroup;
  listRoute = `/${DICH_VU_ROUTE}`;


  datas: DichVuCapNhat[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;
  isVisibleGia = false;

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${DICH_VU_ROUTE}`;


  constructor(
    private fb: FormBuilder,
    private service: DichVuService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) { }

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
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.update(id, this.validateForm.value);
      this.message.info(`Lưu thành công`);
      this.router.navigate([DICH_VU_ROUTE]);
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }

  async submitFormGia(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormGia.controls) {
      this.validateFormGia.controls[i].markAsDirty();
      this.validateFormGia.controls[i].updateValueAndValidity();
    }
    if (this.validateFormGia.invalid) {
      this.message.info(`Xin hãy điền đẩy đủ thông tin`);
      return;
    }
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.storeGia(id, this.validateFormGia.value);
      this.message.info(`Lưu thành công`);
      this.refesh();
      this.isVisibleGia = false;
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }


  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      tenDv: [null, [Validators.required, Validators.maxLength(50)]],
      hinhAnh: [null, [Validators.maxLength(255)]],
    });
    this.validateFormGia = this.fb.group({
      ngayCapNhat: [null, [Validators.required]],
      gia: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      ghiChu: [null, [Validators.maxLength(255)]],
    });

    try {
      const id = this.route.snapshot.paramMap.get('id');
      const [resDichVu] = await Promise.all([
        this.service.getById(id),
        this.refesh()
      ])
      this.dichVu = resDichVu;
      const { createdAt, updatedAt, deletedAt, ...data } = this.dichVu;
      this.validateForm.setValue({ ...data });
    } catch ({ error }) {
      this.message.error(`Lưu Thất bại ${error.message}`);
    }

  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.refesh();
  }

  async onPageChange(reset: boolean = false): Promise<void> {
    if (reset) {
      this.pageIndex = 1;
    }
    this.refesh();

  }

  async refesh(query: any = {}): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    const {
      pageIndex,
      pageSize,
      total,
      rows
    } = await this.service.getGias(id, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, { maDV: id });
    this.datas = rows;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.loading = false;

  }

  async deleteGia(ngayCapNhat: string): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.deleteGia(id, ngayCapNhat);
      this.refesh();
      this.message.info(`Xóa Thành Công`);
    } catch ({ error }) {
      this.message.error(error.message);
    }
  }

  showModal(): void {
    this.isVisibleGia = true;
  }

  handleCancel(): void {
    this.isVisibleGia = false;
  }

  formatCurrency(money): string {
    // return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{ url: res.url }];
    return res;
  }
}
