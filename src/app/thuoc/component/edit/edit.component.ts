import { ThuocCapNhat } from './../../model/thuoc.cap-nhat';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { THUOC_ROUTE } from 'src/app/helper/constant';
import { Thuoc } from '../../model/thuoc.model';
import { ThuocService } from '../../thuoc.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  title = 'Thuốc';
  thuoc: Thuoc;
  validateForm: FormGroup;
  validateFormGia: FormGroup;
  hinhAnh: string;
  editHinhAnh: any;
  isUpload = false;
  listRoute = `/${THUOC_ROUTE}`;
  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${THUOC_ROUTE}`;

  datas: ThuocCapNhat[] = [];
  pageSize = 5;
  pageIndex = 1;
  total = 1;
  sortValue: string | null = null;
  sortKey: string | null = null;
  loading = true;
  selectedUser = null;
  isVisibleGia = false;

  constructor(
    private fb: FormBuilder,
    private service: ThuocService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) { }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.editHinhAnh = event.target.files[0];
      this.isUpload = true;
    }
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
      const id = this.route.snapshot.paramMap.get('id');
      await this.service.update(id, this.validateForm.value);
      this.message.info(`Lưu thành công`);
      this.router.navigate([THUOC_ROUTE]);
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
      maThuoc: [null, [Validators.minLength(8), Validators.maxLength(25)]],
      tenThuoc: [null, [Validators.required, Validators.maxLength(50)]],
      congDung: [null, [Validators.required, Validators.maxLength(100)]],
      moTa: [null, [Validators.maxLength(255)]],
      hinhAnh: [null, [Validators.maxLength(255)]],
    });
    this.validateFormGia = this.fb.group({
      ngayCapNhat: [null, [Validators.required]],
      gia: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      ghiChu: [null, [Validators.maxLength(255)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    try {
      const [resThuoc] = await Promise.all([
        this.service.getById(id),
        this.refesh(),
      ]);
      this.thuoc = resThuoc;
      this.hinhAnh = this.thuoc.hinhAnh;
      const { createdAt, updatedAt, deletedAt, ...data } = this.thuoc;
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
    } = await this.service.getGias(id, this.pageIndex, this.pageSize, this.sortKey, this.sortValue, { maThuoc: id });
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
    this.files = [{url : res.url}];
    return res;
  }
}

