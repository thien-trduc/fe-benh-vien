import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService, NzModalRef, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

import { BenhNhanService } from '../benh-nhan.service';
import { BENH_NHAN_ROUTE, BENH_NHAN_DETAIL_ROUTE  } from './../../helper/constant';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Bệnh Nhân';
  validateForm: FormGroup;
  listRoute = `/${BENH_NHAN_ROUTE}`;
  editRoute = `/${BENH_NHAN_DETAIL_ROUTE}`;
  modal: NzModalRef;

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${BENH_NHAN_ROUTE}`;

  constructor(
    private fb: FormBuilder,
    private service: BenhNhanService,
    private router: Router,
    private message: NzMessageService,
    private modalService: NzModalService) { }

  async submitForm(): Promise<void> {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const { hoTen, diaChi, ...data } = this.validateForm.value;
    this.validateForm.setValue({
      ...data,
      hoTen: hoTen ? hoTen.trim().toUpperCase() : '',
      diaChi: diaChi ? diaChi.trim() : '',
    });
    if (this.validateForm.invalid) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: `Xin hãy điền đẩy đủ thông tin`,
      });
      return;
    }
    try {
      const res = await this.service.store(this.validateForm.value);
      this.router.navigate([`${this.listRoute}${this.editRoute}/${res.cmnd}`]);
      this.message.info(`Tạo thành công`);
    } catch (error) {
      this.modal = this.modalService.error({
        nzTitle: 'LỖI',
        nzContent: error,
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      cmnd: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[0-9]+')]],
      hoTen: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      gioiTinh: [null, [Validators.required]],
      ngaySinh: [null, [Validators.required]],
      diaChi: [null, [Validators.required, Validators.maxLength(100)]],
      soDienThoai: [
        null,
        [Validators.required, Validators.maxLength(20), Validators.pattern(`(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})`)]
      ],
      email: [null, [Validators.email, Validators.maxLength(100)]],
      bhyt: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[0-9]+')]],
      hinhAnh: [null, [Validators.maxLength(255)]],
    });
  }

  disabledDate(current): any {
    return current && current.valueOf() > Date.now();
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{url : res.url}];
    return res;
  }
}
