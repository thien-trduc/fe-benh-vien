import { DichVuService } from './../../dich-vu.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DICH_VU_ROUTE } from 'src/app/helper/constant';
import { Router } from '@angular/router';
import { NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  title = 'Dịch Vụ';
  validateForm: FormGroup;
  listRoute = `/${DICH_VU_ROUTE}`;

  files: any = [];
  apiUpload = `${environment.apiUrl}/upload/${DICH_VU_ROUTE}`;

  constructor(
    private fb: FormBuilder,
    private service: DichVuService,
    private router: Router,
    private message: NzMessageService) { }

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
      this.message.info(`Tạo thành công`);
      this.router.navigate([DICH_VU_ROUTE]);
    } catch ({ error }) {
      this.message.error(`Tạo thất bại : ${error.message}`);
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      tenDv: [null, [Validators.required, Validators.maxLength(50)]],
      gia: [null, [Validators.required, Validators.pattern('^[0-9]+')]],
      ghiChu: [null, [Validators.maxLength(255)]],
      hinhAnh: [null, [Validators.maxLength(255)]],
    });
  }

  customReq = async (item: UploadXHRArgs) => {
    const res = await this.service.uploadV2(item.file);
    this.validateForm.controls.hinhAnh.setValue(res.url);
    this.files = [{url : res.url}];
    return res;
  }
}
