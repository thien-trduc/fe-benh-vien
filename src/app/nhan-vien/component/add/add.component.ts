import { first } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { NHAN_VIEN_ROUTE } from 'src/app/helper/constant';
import { Khoa } from 'src/app/khoa/khoa.model';

import { LoaiNhanVien } from '../../model/loai-nhan-vien.model';
import { NhanVienService } from '../../nhan-vien.service';
import { KhoaService } from './../../../khoa/khoa.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: NhanVienService,
    private router: Router,
    private message: NzMessageService,
    private khoaService: KhoaService,
  ) { }
  title = 'Nhân Viên';
  validateForm: FormGroup;
  listRoute = `/${NHAN_VIEN_ROUTE}`;
  hinhAnh: any;
  khoas: Khoa[];
  loaiNvs: LoaiNhanVien[];

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${NHAN_VIEN_ROUTE}`;

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
      await this.service.store(this.validateForm.value);
      this.router.navigate([NHAN_VIEN_ROUTE]);
      this.message.info(`Tạo thành công`);
    } catch ({ error }) {
      this.message.error(`Tạo thất bại : ${error.message}`);
    }
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.hinhAnh = event.target.files[0];
    }
  }

  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      // maNV: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^NV-[0-9]+')]],
      hoTen: [null, [Validators.required, Validators.maxLength(50)]],
      gioiTinh: [null, [Validators.required]],
      ngaySinh: [null, [Validators.required]],
      diaChi: [null, [Validators.required, Validators.maxLength(100)]],
      soDienThoai: [
        null,
        [Validators.required, Validators.maxLength(20), Validators.pattern(`(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})`)]
      ],
      email: [null, [Validators.email, Validators.maxLength(100)]],
      chucVu: [null, [Validators.maxLength(30)]],
      maLoaiNV: [null, [Validators.required]],
      maKhoa: [null, [Validators.required]],
      hinhAnh: [null, [Validators.maxLength(255)]]
    });

    try {
      const [resKhoa, resLoaiNv] = await Promise.all([
        this.khoaService.fetch(1, 10000, null, null),
        this.service.getLoaiNhanVien(),
      ]);
      this.khoas = resKhoa.rows;
      this.loaiNvs = resLoaiNv;
    } catch (error) {
      throw error;
    }
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{url : res.url}];
    return res;
  }
}
