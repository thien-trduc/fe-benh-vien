import { NhanVienService } from './../../nhan-vien.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { getServerErrorMessage } from 'src/app/helper/handling-error';

import { NhanVien } from '../../model/nhan-vien.model';
import { Khoa } from 'src/app/khoa/khoa.model';
import { LoaiNhanVien } from '../../model/loai-nhan-vien.model';
import { KhoaService } from 'src/app/khoa/khoa.service';
import { NHAN_VIEN_ROUTE } from 'src/app/helper/constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  title = 'Nhân Viên';
  nhanVien: NhanVien;
  validateForm: FormGroup;
  hinhAnh: string;
  listRoute = `/${NHAN_VIEN_ROUTE}`;
  khoas: Khoa[];
  loaiNvs: LoaiNhanVien[];

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${NHAN_VIEN_ROUTE}`;

  constructor(
    private fb: FormBuilder,
    private service: NhanVienService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private khoaService: KhoaService,
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
      this.router.navigate([NHAN_VIEN_ROUTE]);
    } catch ({ error }) {
      this.message.error(`Lưu thất bại ${error.message}`);
    }
  }


  async ngOnInit(): Promise<void> {
    this.validateForm = this.fb.group({
      maNV: [null, [Validators.minLength(8), Validators.maxLength(25)]],
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
      hinhAnh: [null, [Validators.maxLength(250)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    try {
      const [resKhoa, resLoaiNv, nhanVien] = await Promise.all([
        this.khoaService.fetch(1, 10000, null, null),
        this.service.getLoaiNhanVien(),
        this.service.getById(id),
      ]);
      this.khoas = resKhoa.rows;
      this.loaiNvs = resLoaiNv;
      this.nhanVien = nhanVien;
      const { createdAt, updatedAt, deletedAt, khoa, loaiNV, ...data } = this.nhanVien;
      const {maKhoa} = khoa;
      const {maLoaiNV} = loaiNV;
      this.hinhAnh =  this.nhanVien.hinhAnh;
      this.validateForm.setValue({ ...data, maKhoa, maLoaiNV });
    } catch (error) {
      this.message.error(getServerErrorMessage(error));
    }
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{url : res.url}];
    return res;
  }
}
